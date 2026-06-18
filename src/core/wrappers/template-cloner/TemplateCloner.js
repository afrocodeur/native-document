import TemplateBinding from '../TemplateBinding';
import { $hydrateFn} from './utils';
import NodeCloner from './NodeCloner';

/**
 * Creates a high-performance template cloner for repeated rendering of the same structure.
 * On the first call, builds the template by calling $fn with a binder object.
 * On subsequent calls, clones the compiled template and hydrates it with new data.
 * Used internally by ForEachArray and other list renderers.
 *
 * @constructor
 * @param {(binder: TemplateCloner) => HTMLElement} $fn - Function that builds the template using binder methods
 * @example
 * const cloner = new TemplateCloner((t) =>
 *   Div({},
 *     Span(t.text((item) => item.name)),
 *     Button({}, 'Delete').nd.onClick(t.event((item) => () => list.removeItem(item)))
 *   )
 * );
 * cloner.clone([item]); // returns a hydrated clone
 */
export function TemplateCloner($fn) {
    let $node = null;

    const assignClonerToNode = ($node) => {
        const childNodes = $node.childNodes;
        let containDynamicNode = $node.nodeCloner?.shouldBeHydrate();
        const childNodesLength = childNodes.length;
        for(let i = 0; i < childNodesLength; i++) {
            const child = childNodes[i];
            if(child.nodeCloner && child.nodeCloner.shouldBeHydrate()) {
                containDynamicNode = true;
            }
            const localContainDynamicNode = assignClonerToNode(child);
            if(localContainDynamicNode) {
                containDynamicNode = true;
            }
        }

        if(!containDynamicNode) {
            $node.dynamicCloneNode = $node.cloneNode.bind($node, true);
        } else {
            if($node.nodeCloner) {
                $node.nodeCloner.resolve();
                $node.dynamicCloneNode = (data) => {
                    const clonedNode = $node.nodeCloner.cloneNode(data);
                    for(let i = 0; i < childNodesLength; i++) {
                        clonedNode.appendChild(childNodes[i].dynamicCloneNode(data));
                    }
                    return clonedNode;
                };
            } else {
                $node.dynamicCloneNode = (data) => {
                    const clonedNode = $node.cloneNode();
                    for(let i = 0; i < childNodesLength; i++) {
                        clonedNode.appendChild(childNodes[i].dynamicCloneNode(data));
                    }
                    return clonedNode;
                };
            }
        }

        return containDynamicNode;
    };


    /**
     * Clones the compiled template and hydrates it with the given data.
     * On the first call, also compiles the template (builds and optimizes binding steps).
     *
     * @param {Array} data - Data array passed to all binding callbacks
     * @returns {HTMLElement} Cloned and hydrated DOM node
     */
    this.clone = (data) => {
        const binder = createTemplateCloner(this);
        $node = $fn(binder);
        if(!$node.nodeCloner) {
            $node.nodeCloner = new NodeCloner($node);
        }
        assignClonerToNode($node);
        this.clone = $node.dynamicCloneNode;
        return $node.dynamicCloneNode(data);
    };


    const createBinding = (hydrateFunction, targetType) => {
        return new TemplateBinding((element, property) => {
            $hydrateFn(hydrateFunction, targetType, element, property);
        });
    };

    /**
     * Creates a style binding — the result of fn(data) is applied as inline styles.
     *
     * @param {((...data: any[]) => Record<string, string>)} fn - Function returning a style object
     * @returns {TemplateBinding}
     */
    this.style = (fn) => {
        return createBinding(fn, 'style');
    };

    /**
     * Creates a class binding — the result of fn(data) is applied as a class map.
     *
     * @param {((...data: any[]) => Record<string, boolean>)} fn - Function returning a class map
     * @returns {TemplateBinding}
     */
    this.class = (fn) => {
        return createBinding(fn, 'class');
    };

    this.property = (propertyName) => {
        return this.value(propertyName);
    };

    /**
     * Creates a text/value binding — the result is set as text content or input value.
     * Alias: .text()
     *
     * @param {string|(((...data: any[]) => string))} callbackOrProperty - Property name (string) or callback returning the value
     * @returns {TemplateBinding}
     */
    this.value = (callbackOrProperty) => {
        return createBinding(callbackOrProperty, 'value');
    };

    /**
     * Alias for .value() — creates a text content binding.
     *
     * @param {string|(((...data: any[]) => string))} callbackOrProperty
     * @returns {TemplateBinding}
     */
    this.text = this.value;

    /**
     * Creates an attribute binding — the result of fn(data) is set as an attribute value.
     *
     * @param {((...data: any[]) => string)} fn - Function returning the attribute value
     * @returns {TemplateBinding}
     */
    this.attr = (fn) => {
        return createBinding(fn, 'attributes');
    };

    /**
     * Creates an event binding — fn(data) returns the event handler to attach.
     *
     * @param {((...data: any[]) => EventListener)} fn - Function returning the event callback
     * @returns {TemplateBinding}
     */
    this.attach = (fn) => {
        return createBinding(fn, 'attach');
    };

    this.callback = this.attach;
}


const createTemplateCloner = ($binder) => {
    return new Proxy($binder, {
        get(target, prop) {
            if(prop in target) {
                return target[prop];
            }
            if (typeof prop === 'symbol') return target[prop];
            return target.value(prop);
        },
    });
};

export function useCache(fn) {
    let $cache = null;

    let wrapper = (args) => {
        $cache = new TemplateCloner(fn);

        const node = $cache.clone(args);
        wrapper = $cache.clone;
        return node;
    };

    if(fn.length === 0) {
        return () => wrapper();
    }
    if(fn.length < 2) {
        return (arg) => {
            return wrapper([arg]);
        };
    }
    return (_, __, ...args) => {
        return wrapper([_, __, ...args]);
    };
}

export const template = useCache;