import {ElementCreator} from '../ElementCreator';
import {createTextNode} from '../HtmlElementWrapper';
import {NDElement} from '../NDElement';

/**
 * Stores deferred attribute, class, style, and event bindings for a cloneable element.
 * Used internally by TemplateCloner to apply per-instance data to cloned DOM nodes.
 * Not intended for direct use in application code.
 *
 * @internal
 * @constructor
 * @param {HTMLElement} $element - The template element to clone
 */
export default function NodeCloner($element) {
    this.$element = $element;
    this.$classes = null;
    this.$styles = null;
    this.$attrs = null;
    this.$ndMethods = null;
    this.$content = null;
    this.$uniqueCallbacks= new Map();
}

NodeCloner.prototype.shouldBeHydrate = function() {
    return this.$attrs !== null || this.$classes !== null || this.$styles !== null || this.$ndMethods !== null || this.$content !== null;
};

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
        const value = properties[key];
        cache[key] = getPropertyValue(value, data);
    }
    return cache;
};

const getPropertyValue = (callbackOrProperty, data) => {
    if(callbackOrProperty?.__$Observable) {
        return callbackOrProperty;
    }
    const value = (typeof callbackOrProperty ==='string') ? data[0][callbackOrProperty] :  callbackOrProperty;
    return (typeof value === 'function') ? value.apply(this, data) : value;
};


const $nodeClonerCallbackCaller = function(callback, event) {
    const data = event.currentTarget.$ndScopeData;
    callback.apply(event.currentTarget, [...data, event]);
};

NodeCloner.prototype.resolveMethods = function() {
    for(const methodName in this.$ndMethods) {
        const callback = this.$ndMethods[methodName];
        this.$ndMethods[methodName] = $nodeClonerCallbackCaller.bind($nodeClonerCallbackCaller, callback);
    }
};
/**
 * Pre-compiles all registered bindings into a sequence of optimised steps.
 * Called once before the first clone operation. Subsequent calls are no-ops.
 *
 * @internal
 */
NodeCloner.prototype.$cleanResolve = function() {
    const fns = [];
    const fnsParamNames = [];
    const fnsParams = [];

    const $element = this.$element;

    if(this.$ndMethods !== null) {
        const methodNames = Object.keys(this.$ndMethods);
        if(methodNames.length === 1) {
            const methodName = methodNames[0];
            const callback = this.$ndMethods[methodName];
            if($element[methodName]) {
                fns.push(`clonedNode.${methodName}(callback)`);
            } else {
                fns.push(`clonedNode.nd.${methodName}(callback)`);
            }
            fnsParamNames.push('callback');
            fnsParams.push(callback);
        } else {

            for(const methodName in this.$ndMethods) {
                const callbackName = methodName+'Callback';
                const callback = this.$ndMethods[methodName];
                if($element[methodName]) {
                    fns.push(`clonedNode.${methodName}(${callbackName})`);
                } else {
                    fns.push(`clonedNode.nd.${methodName}(${callbackName})`);
                }
                fnsParamNames.push(callbackName);
                fnsParams.push(callback);
            }
        }
    }
    if(this.$classes !== null) {
        const cache = {};
        const keys = Object.keys(this.$classes);

        if(keys.length === 1) {
            const key = keys[0];
            const callback = this.$classes[key];
            fns.push(`ElementCreator.processClassAttribute(clonedNode, { ${key}: getPropertyValue(getPropertyValueCallback, data) })`);
            fnsParamNames.push('getPropertyValueCallback');
            fnsParams.push(callback);
        } else {
            fns.push(`const classesCache = {}`);
            fns.push(`ElementCreator.processClassAttribute(clonedNode, buildProperties(classesCache, $classes, data))`);
            fnsParamNames.push('$classes');
            fnsParams.push(this.$classes);
        }
    }
    if(this.$styles !== null) {
        const cache = {};
        const keys = Object.keys(this.$styles);

        if(keys.length === 1) {
            const key = keys[0];
            const callback = this.$styles[key];
            fns.push(`ElementCreator.processStyleAttribute(clonedNode, { ${key}: getPropertyValue(getStyleValueCallback, data) } )`);
            fnsParamNames.push('getStyleValueCallback');
            fnsParams.push(callback);
        } else {
            fns.push(`const stylesCache = {}`);
            fns.push(`ElementCreator.processStyleAttribute(clonedNode, buildProperties(stylesCache, $styles, data))`);
            fnsParamNames.push('$styles');
            fnsParams.push(this.$styles);
        }
    }
    if(this.$attrs !== null) {
        const cache = {};
        const keys = Object.keys(this.$attrs);

        if(keys.length === 1) {
            const key = keys[0];
            const callback = this.$attrs[key];
            fns.push(`ElementCreator.processAttributes(clonedNode, { ${key}: getPropertyValue(getAttrValueCallback, data) } )`);
            fnsParamNames.push('getAttrValueCallback');
            fnsParams.push(callback);
        } else {
            fns.push(`const attrsCache = {}`);
            fns.push(`ElementCreator.processAttributes(clonedNode, buildProperties(attrsCache, this.$attrs, data))`);
            fnsParamNames.push('$attrs');
            fnsParams.push(this.$attrs);
        }
    }

    fnsParamNames.push('ElementCreator', 'buildProperties', 'getPropertyValue', '$element', 'data');
    fnsParams.push(ElementCreator, buildProperties, getPropertyValue, $element);
    fns.unshift('const clonedNode = $element.cloneNode(false)', 'clonedNode.$ndScopeData = data');
    fns.push('return clonedNode');

    this.cloneNode = (new Function(fnsParamNames, fns.join(';'))).bind(null, ...fnsParams);
};

NodeCloner.prototype.resolve = function() {
    if(this.$content) {
        return;
    }
    this.resolveMethods();
    this.$cleanResolve();
    this.resolve = this.$cleanResolve();
    return this;
};

/**
 * Clones the template element and applies all compiled binding steps with the given data.
 *
 * @internal
 * @param {Array} data - Data array passed to each binding callback
 * @returns {HTMLElement} The cloned and hydrated element
 */
NodeCloner.prototype.cloneNode = function(data) {
    return this.$element.cloneNode(false);
};

/**
 * Registers an NDElement method binding (e.g. onClick, onInput) to be applied on each clone.
 *
 * @internal
 * @param {string} methodName - Name of the NDElement method to call (e.g. 'onClick')
 * @param {Function} callback - Callback function to pass to the method
 * @returns {NodeCloner} this
 */
NodeCloner.prototype.attach = function(methodName, callback) {
    this.$ndMethods = this.$ndMethods || {};
    this.$ndMethods[methodName] = callback;
    return this;
};

/**
 * Registers a reactive text content binding for the element.
 *
 * @internal
 * @param {Function} valueOrProperty - Function receiving data and returning the text content
 * @returns {NodeCloner} this
 */
NodeCloner.prototype.text = function(valueOrProperty) {
    this.$content = valueOrProperty;
    this.cloneNode = (data) => createTextNode(getPropertyValue(valueOrProperty, data));
    return this;
};

/**
 * Registers an attribute binding to be applied on each clone.
 *
 * @internal
 * @param {string} attrName - Attribute name
 * @param {{property: string, value: *}} value - Function receiving data and returning the attribute value
 * @returns {NodeCloner} this
 */
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
    this.$attrs[value.property] = value.value;
    return this;
};