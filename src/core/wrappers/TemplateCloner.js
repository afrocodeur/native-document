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


const applyBindingTreePath = (root, target, data, path) => {
    let newTarget = null;
    if(path.fn) {
        newTarget = path.fn(data, target, root);
    }
    if(path.children) {
        for(let i = 0, length = path.children.length; i < length; i++) {
            const currentPath = path.children[i];
            const pathTargetNode = target.childNodes[currentPath.index];
            applyBindingTreePath(root, pathTargetNode, data, currentPath);
        }
    }
    return newTarget;
};

export function TemplateCloner($fn) {
    let $node = null;
    let $hasBindingData = false;

    const $bindingTreePath = {
        fn: null,
        children: [],
    };

    const clone = (node, data, currentPath) => {
        const bindDingData = cloneBindingsDataCache.get(node);
        if(node.nodeType === 3) {
            if(bindDingData && bindDingData.value) {
                currentPath.fn = (data, targetNode, currentRoot) => {
                    const newNode = bindDingData.value(data);
                    if (targetNode === currentRoot) {
                        return newNode;
                    }
                    targetNode.replaceWith(newNode);
                    return null;
                };
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
            currentPath.fn = (data, targetNode) => {
                bindAttributes(targetNode, bindDingData, data);
                bindAttachMethods(targetNode, bindDingData, data);
            };
        }
        const childNodes = node.childNodes;
        const bindingPathChildren = [];
        for(let i = 0, length = childNodes.length; i < length; i++) {
            const childNode = childNodes[i];
            const path = { index: i, fn: null };
            const childNodeCloned = clone(childNode, data, path);
            if(path.children || path.fn) {
                bindingPathChildren.push(path);
            }
            nodeCloned.appendChild(childNodeCloned);
        }
        if(bindingPathChildren.length) {
            currentPath.children = currentPath.children || [];
            currentPath.children = bindingPathChildren;
        }
        return nodeCloned;
    };

    const cloneWithBindingPaths = (data) => {
        let root = $node.cloneNode(true);

        const newRoot = applyBindingTreePath(root, root, data, $bindingTreePath);
        if(newRoot) {
            root = newRoot;
        }

        return root;
    };

    this.clone = (data) => {
        $node = $fn(this);
        if(!$hasBindingData) {
            this.clone = () => $node.cloneNode(true);
            return $node.cloneNode(true);
        }

        const firstClone = clone($node, data, $bindingTreePath);
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