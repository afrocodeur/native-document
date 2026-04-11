import {ElementCreator} from "../ElementCreator";
import {createTextNode} from "../HtmlElementWrapper";
import {NDElement} from "../NDElement";

export default function NodeCloner($element) {
    this.$element = $element;
    this.$classes = null;
    this.$styles = null;
    this.$attrs = null;
    this.$ndMethods = null;
}


/**
 * Attaches a template binding to the element by hydrating it with the specified method.
 *
 * @param {string} methodName - Name of the hydration method to call
 * @param {BindingHydrator} bindingHydrator - Template binding with $hydrate method
 * @returns {HTMLElement} The underlying HTML element
 * @example
 * const onClick = $binder.attach((event, data) => console.log(data));
 * element.nd.attach('onClick', onClick);
 */
NDElement.prototype.attach = function(methodName, bindingHydrator) {
    if(typeof bindingHydrator === 'function') {
        const element = this.$element;
        element.nodeCloner = element.nodeCloner || new NodeCloner(element);
        element.nodeCloner.attach(methodName, bindingHydrator);
        return element;
    }
    bindingHydrator.$hydrate(this.$element, methodName);
    return this.$element;
};

NodeCloner.prototype.__$isNodeCloner = true;

const buildProperties = (cache, properties, data) => {
    for(const key in properties) {
        cache[key] = properties[key].apply(null, data);
    }
    return cache;
};

NodeCloner.prototype.resolve = function() {
    if(this.$content) {
        return;
    }
    const steps = [];
    if(this.$ndMethods) {
        const methods = Object.keys(this.$ndMethods);
        if(methods.length === 1) {
            const methodName = methods[0];
            const callback = this.$ndMethods[methodName];
            steps.push((clonedNode, data) => {
                clonedNode.nd[methodName](callback.bind(clonedNode, ...data));
            });
        } else {
            steps.push((clonedNode, data) => {
                const nd = clonedNode.nd;
                for(const methodName in this.$ndMethods) {
                    nd[methodName](this.$ndMethods[methodName].bind(clonedNode, ...data));
                }
            });
        }
    }
    if(this.$classes) {
        const cache = {};
        const keys = Object.keys(this.$classes);

        if(keys.length === 1) {
            const key = keys[0];
            const callback = this.$classes[key];
            steps.push((clonedNode, data) => {
                cache[key] = callback.apply(null, data);
                ElementCreator.processClassAttribute(clonedNode, cache);
            });
        } else {
            steps.push((clonedNode, data) => {
                ElementCreator.processClassAttribute(clonedNode, buildProperties(cache, this.$classes, data));
            });
        }
    }
    if(this.$styles) {
        const cache = {};
        const keys = Object.keys(this.$styles);

        if(keys.length === 1) {
            const key = keys[0];
            const callback = this.$styles[key];
            steps.push((clonedNode, data) => {
                cache[key] = callback.apply(null, data);
                ElementCreator.processStyleAttribute(clonedNode, cache);
            });
        } else {
            steps.push((clonedNode, data) => {
                ElementCreator.processStyleAttribute(clonedNode, buildProperties(cache, this.$styles, data));
            });
        }
    }
    if(this.$attrs) {
        const cache = {};
        const keys = Object.keys(this.$attrs);

        if(keys.length === 1) {
            const key = keys[0];
            const callback = this.$attrs[key];
            steps.push((clonedNode, data) => {
                cache[key] = callback.apply(null, data);
                ElementCreator.processAttributes(clonedNode, cache);
            });
        } else {
            steps.push((clonedNode, data) => {
                ElementCreator.processAttributes(clonedNode, buildProperties(cache, this.$attrs, data));
            });
        }
    }

    const stepsCount = steps.length;
    const $element = this.$element;

    this.cloneNode = (data) => {
        const clonedNode = $element.cloneNode(false);
        for(let i = 0; i < stepsCount; i++) {
            steps[i](clonedNode, data);
        }
        return clonedNode;
    };
};

NodeCloner.prototype.cloneNode = function(data) {
    return this.$element.cloneNode(false);
};

NodeCloner.prototype.attach = function(methodName, callback) {
    this.$ndMethods = this.$ndMethods || {};
    this.$ndMethods[methodName] = callback;
    return this;
};

NodeCloner.prototype.text = function(value) {
    this.$content = value;
    if(typeof value === 'function') {
        this.cloneNode = (data) => createTextNode(value.apply(null, data));
        return this;
    }
    this.cloneNode = (data) => createTextNode(data[0][value]);
    return this;
};

NodeCloner.prototype.attr = function(attrName, value) {
    if(attrName === 'class') {
        this.$classes = this.$classes || {};
        this.$classes[value.property] = value.value;
        return this;
    }
    if(attrName === 'style') {
        this.$styles = this.$styles || {};
        this.$styles[value.property] = value.value;
        return this;
    }
    this.$attrs = this.$attrs || {};
    this.$attrs[attrName] = value.value;
    return this;
};