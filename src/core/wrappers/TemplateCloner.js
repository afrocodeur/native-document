import {ElementCreator} from "./ElementCreator";
import {createTextNode} from "./HtmlElementWrapper";
import TemplateBinding from "./TemplateBinding";

const cloneBindingsDataCache = new WeakMap();


const bindAttributes = (node, bindDingData, data) => {
    let attributes = null;
    if(bindDingData.attributes) {
        attributes = {};
        for (const attr in bindDingData.attributes) {
            attributes[attr] = bindDingData.attributes[attr].apply(null, data);
        }
    }

    if(bindDingData.classes) {
        attributes = attributes || {};
        attributes.class = {};
        for (const className in bindDingData.classes) {
            attributes.class[className] = bindDingData.classes[className].apply(null, data);
        }
    }

    if(bindDingData.styles) {
        attributes = attributes || {};
        attributes.style = {};
        for (const property in bindDingData.styles) {
            attributes.style[property] = bindDingData.styles[property].apply(null, data);
        }
    }

    if(attributes) {
        ElementCreator.processAttributes(node, attributes);
        return true;
    }

    return null;
};

const findByPath = (root, path) => {
    let target = root;
    for (let i = 0, len = path.length; i < len; i++) {
        target = target.childNodes[path[i]];
    }
    return target;
};

const $hydrateFn = function(hydrateFunction, targetType, element, property) {
    if(!cloneBindingsDataCache.has(element)) {
        // { classes, styles, attributes, value, attach }
        cloneBindingsDataCache.set(element, {});
    }
    const hydrationState = cloneBindingsDataCache.get(element);
    if(targetType === 'value') {
        hydrationState.value = hydrateFunction;
        return;
    }
    hydrationState[targetType] = hydrationState[targetType] || {};
    hydrationState[targetType][property] = hydrateFunction;
}

const bindAttachMethods = function(node, bindDingData, data) {
    if(!bindDingData.attach) {
        return null;
    }
    for(const methodName in bindDingData.attach) {
        node.nd[methodName](function(...args) {
            bindDingData.attach[methodName].apply(this, [...args, ...data]);
        });
    }
};

export function TemplateCloner($fn) {
    let $node = null;
    let $hasBindingData = false;

    const $bindingPaths = [];

    const clone = (node, data, path) => {
        const bindDingData = cloneBindingsDataCache.get(node);
        if(node.nodeType === 3) {
            if(bindDingData && bindDingData.value) {
                $bindingPaths.push({
                    path: [...path],
                    fn: (data, targetNode, currentRoot) => {
                        const newNode = bindDingData.value(data);
                        targetNode.replaceWith(newNode);
                        if (targetNode === currentRoot) {
                            return newNode;
                        }
                        return null;
                    }
                });
                return bindDingData.value(data);
            }
            return node.cloneNode(true);
        }
        const nodeCloned = node.cloneNode(node.fullCloneNode);
        if(node.fullCloneNode) {
            return nodeCloned;
        }
        if(bindDingData) {
            bindAttributes(nodeCloned, bindDingData, data);
            bindAttachMethods(nodeCloned, bindDingData, data);
            $bindingPaths.push({
                path: [...path],
                fn: (data, targetNode) => {
                    bindAttributes(targetNode, bindDingData, data);
                    bindAttachMethods(targetNode, bindDingData, data);
                }
            })
        }
        const childNodes = node.childNodes;
        for(let i = 0, length = childNodes.length; i < length; i++) {
            const childNode = childNodes[i];
            path.push(i);
            const childNodeCloned = clone(childNode, data, path);
            path.pop();
            nodeCloned.appendChild(childNodeCloned);
        }
        return nodeCloned;
    };

    const cloneWithBindingPaths = (data) => {
        let root = $node.cloneNode(true);

        for (let i = 0, len = $bindingPaths.length; i < len; i++) {
            const binding = $bindingPaths[i];
            const target = findByPath(root, binding.path);
            const newRoot = binding.fn(data, target, root);
            if(newRoot) {
                root = newRoot;
            }
        }

        return root;
    };

    this.clone = (data) => {
        $node = $fn(this);
        if(!$hasBindingData) {
            this.clone = () => $node.cloneNode(true);
            return $node.cloneNode(true);
        }

        const firstClone = clone($node, data, []);
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
        if(typeof callbackOrProperty !== 'function') {
            return createBinding(function(data) {
                const firstArgument = data[0];
                return createTextNode(firstArgument[callbackOrProperty]);
            }, 'value');
        }
        return createBinding(function(data) {
            return createTextNode(callbackOrProperty(...data));
        }, 'value');
    };
    this.attr = (fn) => {
        return createBinding(fn, 'attributes');
    };
    this.attach = (fn) => {
        return createBinding(fn, 'attach');
    };

}

export function useCache(fn) {
    let $cache = null;

    const wrapper = function(args) {
        if(!$cache) {
            $cache = new TemplateCloner(fn);
        }
        return $cache.clone(args);
    };

    if(fn.length < 2) {
        return function(...args) {
            return wrapper(args);
        };
    }
    return function(_, __, ...args) {
        return wrapper([_, __, ...args]);
    };
}