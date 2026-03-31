import { ElementCreator } from "../ElementCreator";


export const cloneBindingsDataCache = new WeakMap();

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
                value: bindDingData.attributes[attr]
            });
        }
    }

    if(bindDingData.classes) {
        for (const className in bindDingData.classes) {
            bindDingData._hasClassAttribute = true;
            classAndStyles.push({
                name: 'class',
                key: className,
                value: bindDingData.classes[className]
            });
        }
    }

    if(bindDingData.styles) {
        for (const property in bindDingData.styles) {
            bindDingData._hasStyleAttribute = true;
            classAndStyles.push({
                name: 'style',
                key: property,
                value: bindDingData.styles[property]
            });
        }
    }

    bindDingData._flatAttributes = attributes;
    bindDingData._flatAttributesLength = attributes.length;
    bindDingData._flatDynamique = classAndStyles;
    bindDingData._flatDynamiqueLength = classAndStyles.length;
    bindDingData._attachLength = bindDingData.attach.length;
};


export const $hydrateFn = function(hydrateFunction, targetType, element, property) {
    if(!cloneBindingsDataCache.has(element)) {
        cloneBindingsDataCache.set(element, { attach: [] });
    }
    const hydrationState = cloneBindingsDataCache.get(element);

    if(targetType === 'value') {
        hydrationState.value = hydrateFunction;
        return;
    }
    if(targetType === 'attach') {
        hydrationState.attach = hydrationState.attach || [];
        hydrationState.attach.push({ methodName: property, fn: hydrateFunction});
        return;
    }
    hydrationState[targetType] = hydrationState[targetType] || {};
    hydrationState[targetType][property] = hydrateFunction;
};

export const bindAttachMethods = (node, bindDingData, data) => {
    for(let i = 0, length = bindDingData._attachLength; i < length; i++) {
        const method = bindDingData.attach[i];
        node.nd[method.methodName](function() {
            method.fn.call(this, ...data, ...arguments);
        });
    }
};

export const optimizeBindingData = (bindDingData) => {
    buildAttributesCache(bindDingData);
    prepareBindingMetadata(bindDingData);
};


const $applyBindingParents = [];
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