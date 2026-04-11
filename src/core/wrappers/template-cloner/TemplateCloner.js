import TemplateBinding from "../TemplateBinding";
import { $hydrateFn} from './utils';
import NodeCloner from "./NodeCloner";

export function TemplateCloner($fn) {
    let $node = null;

    const assignClonerToNode = ($node) => {
        const childNodes = $node.childNodes;
        let containDynamicNode = !!$node.nodeCloner;
        const childNodesLength = childNodes.length;
        for(let i = 0; i < childNodesLength; i++) {
            const child = childNodes[i];
            if(child.nodeCloner) {
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
            $hydrateFn(hydrateFunction, targetType, element, property)
        });
    };

    this.style = (fn) => {
        return createBinding(fn, 'style');
    };
    this.class = (fn) => {
        return createBinding(fn, 'class');
    };
    this.property = (propertyName) => {
        return this.value(propertyName);
    }
    this.value = (callbackOrProperty) => {
        return createBinding(callbackOrProperty, 'value');
    };
    this.text = this.value;
    this.attr = (fn) => {
        return createBinding(fn, 'attributes');
    };
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
        }
    });
}

export function useCache(fn) {
    let $cache = null;

    let wrapper = (args) => {
        $cache = new TemplateCloner(fn);

        const node = $cache.clone(args);
        wrapper = $cache.clone;
        return node;
    };

    if(fn.length < 2) {
        return (...args) => {
            return wrapper(args);
        };
    }
    return (_, __, ...args) => {
        return wrapper([_, __, ...args]);
    };
}

export const template = useCache;