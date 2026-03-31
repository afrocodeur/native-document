import {ElementCreator} from "../ElementCreator";
import TemplateBinding from "../TemplateBinding";
import { hydrateClonedNode, optimizeBindingData, $hydrateFn, bindAttachMethods, cloneBindingsDataCache } from './utils';
import { getHydrator } from './attributes-hydrator';

export function TemplateCloner($fn) {
    let $node = null;
    let $hasBindingData = false;

    let $bindingTreePathSize = 0;
    const $bindingTreePath = [
        {
            id: 0,
            parentId: null
        }
    ];

    let pathCounter = 0;
    const clone = (node, data, currentPath) => {
        const bindDingData = cloneBindingsDataCache.get(node);
        if(bindDingData) {
            optimizeBindingData(bindDingData);
        }
        if(node.nodeType === 3) {
            if(bindDingData && bindDingData.value) {
                const value = bindDingData.value;
                const textNode = node.cloneNode();
                currentPath.value = value;
                currentPath.HYDRATE_TEXT = true;
                currentPath.operation = true;
                currentPath.isString = (typeof value === 'string');
                ElementCreator.bindTextNode(textNode, (currentPath.isString ? data[0][value] : value.apply(null, data)));
                return textNode;
            }
            return node.cloneNode(true);
        }
        const nodeCloned = node.cloneNode();
        if(bindDingData) {
            const hydrator = getHydrator(bindDingData);
            hydrator(nodeCloned, bindDingData, data);
            bindAttachMethods(nodeCloned, bindDingData, data);

            const hasAttributes = bindDingData.classes || bindDingData.styles || bindDingData.attributes;
            const hasAttachMethods = bindDingData.attach.length;

            currentPath.bindingData = bindDingData;
            currentPath.hydrator = hydrator;

            if(hasAttributes) {
                currentPath.HYDRATE_ATTRIBUTES = true;
                currentPath.operation = true;
            }
            if(hasAttachMethods) {
                currentPath.ATTACH_METHOD = true;
                currentPath.operation = true;
            }
        }
        const childNodes = node.childNodes;
        const parentId = currentPath.id;

        for(let i = 0, length = childNodes.length; i < length; i++) {
            const childNode = childNodes[i];
            const path = { parentId, id: ++pathCounter,  index: i };
            const childNodeCloned = clone(childNode, data, path);
            if(path.hasChildren || path.operation) {
                $bindingTreePath.push(path);
                currentPath.hasChildren = true;
            }
            nodeCloned.appendChild(childNodeCloned);
        }
        return nodeCloned;
    };

    const cloneWithBindingPaths = (data) => {
        let root = $node.cloneNode(true);

        hydrateClonedNode(root, data, $bindingTreePath, $bindingTreePathSize);
        return root;
    };

    this.clone = (data) => {
        const binder = createTemplateCloner(this);
        $node = $fn(binder);
        if(!$hasBindingData) {
            this.clone = () => $node.cloneNode(true);
            return $node.cloneNode(true);
        }

        const firstClone = clone($node, data, $bindingTreePath[0]);
        $bindingTreePath.reverse();
        $bindingTreePathSize = $bindingTreePath.length - 1;

        this.clone = cloneWithBindingPaths;
        return firstClone;
    };


    const createBinding = (hydrateFunction, targetType) => {
        return new TemplateBinding((element, property) => {
            $hasBindingData = true;
            $hydrateFn(hydrateFunction, targetType, element, property)
        });
    };

    this.style = (fn) => {
        return createBinding(fn, 'styles');
    };
    this.class = (fn) => {
        return createBinding(fn, 'classes');
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

        wrapper = (args) => {
            return $cache.clone(args);
        };
        return $cache.clone(args);
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