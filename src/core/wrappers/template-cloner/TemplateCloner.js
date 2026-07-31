import TemplateBinding from '../TemplateBinding';
import { $hydrateFn} from './utils';
import NodeCloner from './NodeCloner';
import {ElementCreator} from '../ElementCreator';
import NativeDocumentError from '../../errors/NativeDocumentError';

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

    this.$scopeDataBuilder = null;

    const assignClonerToNode = ($node) => {
        $node = ElementCreator.getChild($node);
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
        const helpers = {
            useCallback: binder.attach.bind(binder),
            useCallbacks: (callbacks) => {
                for(const key in callbacks) {
                    callbacks[key] = binder.attach(callbacks[key]);
                }
                return callbacks;
            },
            useData: (callback) => {
                this.$scopeDataBuilder = callback;
            },
            use: binder.freeProps.bind(binder),
        };
        $node = ElementCreator.getChild($fn(binder, helpers));
        if(!$node.nodeCloner) {
            $node.nodeCloner = new NodeCloner($node);
        }
        assignClonerToNode($node);

        if(this.$scopeDataBuilder) {
            this.clone = (data) => {
                const scopeData = this.scopeData();
                return $node.dynamicCloneNode([...data, scopeData]);
            };
            return $node.dynamicCloneNode([...data, this.scopeData()]);
        }

        this.clone = $node.dynamicCloneNode;
        return $node.dynamicCloneNode(data);
    };

    this.scopeData = () => {
        return this.$scopeDataBuilder?.() || {};
    };


    const createBinding = (hydrateFunction, targetType) => {
        return new TemplateBinding((element, property) => {
            $hydrateFn(hydrateFunction, targetType, element, property);
        }, this);
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

    this.data = (property) => {
        return this.freeProps((...Args) => {
            const data = Args.at(-1);
            if(process.env.NODE_ENV === 'development') {
                if(!data[property]) {
                    throw new NativeDocumentError(property + ' is not defined in useData');
                }
            }
            return data[property];
        });
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

    this.freeProps = (callbackOrProperty) => {
        return new TemplateBinding((element, property, type) => {
            let targetType = type;
            if(type === 'attribute') {
                targetType = 'attributes';
            }
            $hydrateFn(callbackOrProperty, targetType, element, property);
        });
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

const createDataProxy = ($binder) => {
    return new Proxy($binder, {
        get(target, key) {
            return target.data(key);
        },
    });
};

const createTemplateCloner = ($binder) => {
    return new Proxy($binder, {
        get(target, prop) {
            if(prop in target) {
                return target[prop];
            }
            if (typeof prop === 'symbol') {
                return target[prop];
            }
            if(prop === '$data') {
                return createDataProxy($binder);
            }
            return target.freeProps(prop);
        },
    });
};

/**
 * Creates a high-performance template factory that compiles once and clones efficiently.
 * The template function is called only on the first render to build and optimise the DOM
 * structure. Subsequent calls clone the compiled result and hydrate it with new data.
 *
 * Execution happens in three distinct phases:
 *
 * **Phase 1 — Compilation** (runs once, on first call)
 * The template function receives `$scope` — a binding proxy. Accessing `$scope.name`,
 * `$scope.color` etc. declares bindings on the template node without reading values yet.
 * `$scope.$data` provides direct bindings to local state properties declared via `useData`.
 * The DOM structure is built and optimised during this phase.
 *
 * **Phase 2 — Hydration** (runs once per clone)
 * `useData(() => ({ ... }))` creates isolated local state for each cloned instance.
 * The factory is called once per item — every clone gets its own independent state object.
 *
 * **Phase 3 — Runtime** (runs on each interaction or reactive update)
 * `useCallback`, `useCallbacks` and `use` callbacks receive the same arguments as the
 * template function, plus the local state object as the last argument:
 * - `item`  — the actual item data at the time of execution
 * - `index` — position in the list (when used with ForEachArray)
 * - `data`  — the local state for this specific clone (from useData)
 *
 * @template T
 * @param {(
 *   $scope: T & { $data: Record<string, any> },
 *   helpers: {
 *     useData: (factory: () => Record<string, any>) => void,
 *     useCallback: (fn: (item: T, index: number, data: Record<string, any>) => EventListener) => TemplateBinding,
 *     useCallbacks: (callbacks: Record<string, (item: T, index: number, data: Record<string, any>) => EventListener>) => Record<string, TemplateBinding>,
 *     use: (fn: (item: T, index: number, data: Record<string, any>) => any) => TemplateBinding,
 *   }
 * ) => HTMLElement} fn - Template builder function called once during compilation
 * @returns {(item: T, index?: number) => HTMLElement} Factory function — pass directly to ForEachArray or call manually
 *
 * @example
 * const UserRow = useCache(($scope, { useData, useCallback, useCallbacks, use }) => {
 *
 *     // Phase 1 — declare bindings (runs once)
 *     const color = $scope.color;
 *     // Bind directly from local state via $scope.$data
 *     const selectedClass = $scope.$data.selected;
 *
 *     // Phase 2 — local state per clone (runs once per item)
 *     useData(() => ({
 *         selected: $(false),
 *     }));
 *
 *     // Phase 3 — runtime callbacks (run on interaction)
 *
 *     // Single callback
 *     const toggle = useCallback((item, index, data) => {
 *         data.selected.toggle();
 *     });
 *
 *     // Multiple callbacks at once
 *     const { select, deselect } = useCallbacks({
 *         select:   (item, index, data) => data.selected.set(true),
 *         deselect: (item, index, data) => data.selected.set(false),
 *     });
 *
 *     const isSelected = use((item, index, data) => {
 *         return data.selected.val() ? 'is-selected' : '';
 *     });
 *
 *     return Div({ class: isSelected, style: { color } }, Strong($scope.name))
 *         .onClick(toggle);
 * });
 *
 * // Pass directly to ForEachArray
 * ForEachArray($users, UserRow)
 *
 * // Or call manually
 * UserRow(item, index)
 */
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