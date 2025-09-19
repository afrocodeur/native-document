import {ElementCreator} from "./ElementCreator";
import {createTextNode} from "./HtmlElementWrapper";

const cloneBindingsDataCache = new WeakMap();


const bindAttributes = (node, bindDingData, data) => {
    let attributes = null;
    if(bindDingData.attributes) {
        attributes = attributes || {};
        for (const attr in bindDingData.attributes) {
            attributes[attr] = bindDingData.attributes[attr](...data);
        }
    }

    if(bindDingData.classes) {
        attributes = attributes || {};
        attributes.class = {};
        for (const className in bindDingData.classes) {
            attributes.class[className] = bindDingData.classes[className](...data);
        }
    }

    if(bindDingData.styles) {
        attributes = attributes || {};
        attributes.style = {};
        for (const property in bindDingData.styles) {
            attributes.style[property] = bindDingData.styles[property](...data);
        }
    }

    if(attributes) {
        ElementCreator.processAttributes(node, attributes);
        return true;
    }

    return null;
};


const bindAttachMethods = function(node, bindDingData, data) {
    if(!bindDingData.attach) {
        return null;
    }
    bindDingData.attach(node, ...data);
};

export function TemplateCloner($fn) {
    let $node = null;

    const clone = (node, data) => {
        const bindDingData = cloneBindingsDataCache.get(node);
        if(node.nodeType === 3) {
            if(bindDingData && bindDingData.value) {
                return bindDingData.value(data);
            }
            return node.cloneNode(true);
        }
        const nodeCloned = node.cloneNode();
        if(bindDingData) {
            bindAttributes(nodeCloned, bindDingData, data);
            bindAttachMethods(nodeCloned, bindDingData, data);
        }
        const childNodes = node.childNodes;
        for(let i = 0, length = childNodes.length; i < length; i++) {
            const childNode = childNodes[i];
            const childNodeCloned = clone(childNode, data);
            nodeCloned.appendChild(childNodeCloned);
        }
        return nodeCloned;
    };

    this.clone = (data) => {
        if(!$node) {
            $node = $fn(this);
        }
        return clone($node, data);
    };

    const $hydrateFn = function(hydrateFunction, target, element, property) {
        if(!cloneBindingsDataCache.has(element)) {
            // { classes, styles, attributes, value, attach }
            cloneBindingsDataCache.set(element, {});
        }
        const hydrationState = cloneBindingsDataCache.get(element);
        if(target === 'value') {
            hydrationState.value = hydrateFunction;
            return;
        }
        if(target === 'attach') {
            hydrationState.attach = hydrateFunction;
            return;
        }
        hydrationState[target] = hydrationState[target] || {};
        hydrationState[target][property] = hydrateFunction;
    }

    const createBinding = (hydrateFunction, target) => {
        return {
            $hydrate : (element, property) => $hydrateFn(hydrateFunction, target, element, property),
        }
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