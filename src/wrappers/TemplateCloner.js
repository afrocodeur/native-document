import {ElementCreator} from "./ElementCreator";
import {createTextNode} from "./HtmlElementWrapper";

const cloneBindingsDataCache = new WeakMap();


const bindAttributes = (node, bindDingData, data) => {
    if(!bindDingData) {
        return null;
    }
    const attributes = { };
    if(bindDingData.attributes) {
        for (const attr in bindDingData.attributes) {
            attributes[attr] = bindDingData.attributes[attr](...data);
        }
    }

    if(bindDingData.classes) {
        attributes.class = {};
        for (const className in bindDingData.classes) {
            attributes.class[className] = bindDingData.classes[className](...data);
        }
    }

    if(bindDingData.styles) {
        attributes.style = {};
        for (const property in bindDingData.styles) {
            attributes.style[property] = bindDingData.styles[property](...data);
        }
    }

    if(Object.keys(attributes)) {
        ElementCreator.processAttributes(node, attributes);
        return attributes;
    }

    return null;
};


const bindAttachesMethods = function(node, bindDingData, data) {
    if(!bindDingData?.attaches) {
        return null;
    }
    for(const methodName in bindDingData.attaches) {
        node.nd[methodName](function(...args) {
            bindDingData.attaches[methodName].call(this, ...[...args, ...data]);
        });
    }
}

export function TemplateCloner($fn) {
    let $node = null;

    const clone = (node, data) => {
        const bindDingData = cloneBindingsDataCache.get(node);
        if(node instanceof Text) {
            if(bindDingData?.value) {
                return bindDingData.value(data);
            }
            return node.cloneNode(true);
        }
        const nodeCloned = node.cloneNode();
        bindAttributes(nodeCloned, bindDingData, data);
        bindAttachesMethods(nodeCloned, bindDingData, data);

        for(let i = 0, length = node.childNodes.length; i < length; i++) {
            const childNode = node.childNodes[i];
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

    const createBinding = (hydrateFunction, target) => {
        return {
            $hydrate : function(element, property) {
                if(!cloneBindingsDataCache.has(element)) {
                    // { classes, styles, attributes, value, attaches }
                    cloneBindingsDataCache.set(element, {});
                }
                const hydrationState = cloneBindingsDataCache.get(element);
                if(target === 'value') {
                    hydrationState.value = hydrateFunction;
                    return;
                }
                hydrationState[target] = hydrationState[target] || {};
                hydrationState[target][property] = hydrateFunction;
            }
        }
    };

    this.style = (fn) => {
        return createBinding(fn, 'styles');
    };
    this.class = (fn) => {
        return createBinding(fn, 'classes');
    };
    this.value = (fn) => {
        return createBinding(function(data) {
            return createTextNode(fn(...data));
        }, 'value');
    };
    this.attr = (fn) => {
        return createBinding(fn, 'attributes');
    };
    this.attach = (fn) => {
        return createBinding(fn, 'attaches');
    };
}

export function useCache(fn) {
    let $cache = null;

    return function(...args) {
        if(!$cache) {
            $cache = new TemplateCloner(fn);
        }

        return $cache.clone(args);
    };
}