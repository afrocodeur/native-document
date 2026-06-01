import { ElementCreator } from '../ElementCreator';
import NodeCloner from './NodeCloner';

const pathProcess = (target, path, data) => {
    if(path.HYDRATE_TEXT) {
        const value = path.value;
        ElementCreator.bindTextNode(target, path.isString ? data[0][value] : value.apply(null, data));
        return;
    }
    if(path.ATTACH_METHOD) {
        const bindingData = path.bindingData;
        for(let i = 0, length = bindingData._attachLength; i < length; i++) {
            const method = bindingData.attach[i];
            target.nd[method.methodName](function() {
                method.fn.call(this, ...data, ...arguments);
            });
        }
    }
    if(path.HYDRATE_ATTRIBUTES) {
        path.hydrator(target, path.bindingData, data);
    }
};

const buildAttributesCache = (bindDingData) => {
    const cache = { };
    if(bindDingData.attributes) cache.attributes = {};
    if(bindDingData.classes)    cache.class = {};
    if(bindDingData.styles)     cache.style = {};
    bindDingData._cache = cache;
};

const prepareBindingMetadata = (bindDingData) => {
    const attributes = [];
    const classAndStyles = [];

    if(bindDingData.attributes) {
        for (const attr in bindDingData.attributes) {
            attributes.push({
                name: attr,
                value: bindDingData.attributes[attr],
            });
        }
    }

    if(bindDingData.classes) {
        for (const className in bindDingData.classes) {
            bindDingData._hasClassAttribute = true;
            classAndStyles.push({
                name: 'class',
                key: className,
                value: bindDingData.classes[className],
            });
        }
    }

    if(bindDingData.styles) {
        for (const property in bindDingData.styles) {
            bindDingData._hasStyleAttribute = true;
            classAndStyles.push({
                name: 'style',
                key: property,
                value: bindDingData.styles[property],
            });
        }
    }

    bindDingData._flatAttributes = attributes;
    bindDingData._flatAttributesLength = attributes.length;
    bindDingData._flatDynamique = classAndStyles;
    bindDingData._flatDynamiqueLength = classAndStyles.length;
    bindDingData._attachLength = bindDingData.attach.length;
};

/**
 * Applies a binding to a DOM node via its NodeCloner, routing to the correct binding type.
 * Called internally by TemplateCloner's binder methods (text, style, class, attr, event).
 *
 * @internal
 * @param {Function|string} value - Binding callback or property name
 * @param {'value'|'style'|'class'|'attach'|string} targetType - Binding type determining which NodeCloner method to call
 * @param {HTMLElement} element - Target DOM element
 * @param {string} property - Attribute name or method name (used for 'attach' and 'attr' types)
 */
export const $hydrateFn = function(value, targetType, element, property) {
    element.nodeCloner = element.nodeCloner || new NodeCloner(element);
    if(targetType === 'value') {
        element.nodeCloner.text(value);
        return;
    }
    if(targetType === 'attach') {
        element.nodeCloner.attach(property, value);
        return;
    }
    element.nodeCloner.attr(targetType, { property, value });
};

/**
 * Attaches all event handler bindings from a BindingData object to a cloned DOM node.
 *
 * @internal
 * @param {HTMLElement} node - Cloned DOM node
 * @param {BindingData} bindDingData - Pre-compiled binding metadata containing attachment definitions
 * @param {Array} data - Data array passed to each attachment callback
 */
export const bindAttachMethods = (node, bindDingData, data) => {
    for(let i = 0, length = bindDingData._attachLength; i < length; i++) {
        const method = bindDingData.attach[i];
        node.nd[method.methodName](function() {
            method.fn.call(this, ...data, ...arguments);
        });
    }
};

/**
 * Prepares a BindingData object for efficient hydration by building attribute caches
 * and flattening binding lists into indexed arrays.
 * Called once per template during compilation.
 *
 * @internal
 * @param {BindingData} bindDingData - Binding metadata object to optimise in-place
 */
export const optimizeBindingData = (bindDingData) => {
    buildAttributesCache(bindDingData);
    prepareBindingMetadata(bindDingData);
};


const $applyBindingParents = [];

/**
 * Traverses a cloned DOM tree and applies all compiled binding steps to each matching node.
 * Uses a pre-built path index for O(n) traversal without querySelector.
 *
 * @internal
 * @param {HTMLElement} root - Root cloned node
 * @param {Array} data - Data array passed to each binding callback
 * @param {Array} paths - Pre-compiled binding paths from template analysis
 * @param {number} pathSize - Number of paths to process (paths.length - 1)
 */
export const hydrateClonedNode = (root, data, paths, pathSize) => {
    const rootPath = paths[pathSize];
    $applyBindingParents[rootPath.id] = root;
    pathProcess(root, rootPath, data);

    let target = null, path = null;
    for(let i = 0; i < pathSize; i++) {
        path = paths[i];
        target = $applyBindingParents[path.parentId].childNodes[path.index];
        $applyBindingParents[path.id] = target;

        if(path.HYDRATE_TEXT) {
            const value = path.value;
            ElementCreator.bindTextNode(target, path.isString ? data[0][value] : value.apply(null, data));
            continue;
        }
        if(path.ATTACH_METHOD) {
            const bindingData = path.bindingData;
            for(let i = 0, length = bindingData._attachLength; i < length; i++) {
                const method = bindingData.attach[i];
                target.nd[method.methodName](function() {
                    method.fn.call(this, ...data, ...arguments);
                });
            }
        }
        if(path.HYDRATE_ATTRIBUTES) {
            path.hydrator(target, path.bindingData, data);
        }
    }

    for (let i = 0; i <= pathSize; i++) {
        $applyBindingParents[i] = null;
    }
};