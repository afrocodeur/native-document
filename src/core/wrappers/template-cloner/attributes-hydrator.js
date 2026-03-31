import {ElementCreator} from "../ElementCreator";

export const hydrateFull = (node, bindDingData, data) => {
    const cacheAttributes = bindDingData._cache;

    for(let i = 0, length = bindDingData._flatAttributesLength; i < length; i++) {
        const attr = bindDingData._flatAttributes[i];
        cacheAttributes[attr.name] = attr.value.apply(null, data);
    }

    for(let i = 0, length = bindDingData._flatDynamiqueLength; i < length; i++) {
        const dyn = bindDingData._flatDynamique[i];
        cacheAttributes[dyn.name][dyn.key] = dyn.value.apply(null, data);
    }

    ElementCreator.processAttributesDirect(node, cacheAttributes);
    return true;
};

export const hydrateDynamic = (node, bindDingData, data) => {
    const cacheAttributes = bindDingData._cache;

    for(let i = 0, length = bindDingData._flatDynamiqueLength; i < length; i++) {
        const dyn = bindDingData._flatDynamique[i];
        cacheAttributes[dyn.name][dyn.key] = dyn.value.apply(null, data);
    }

    ElementCreator.processClassAttribute(node, cacheAttributes.class);
    ElementCreator.processStyleAttribute(node, cacheAttributes.style);
    return true;
};

export const hydrateClassAttribute = (node, bindDingData, data) => {
    const classAttributes = bindDingData._cache.class;

    for(let i = 0, length = bindDingData._flatDynamiqueLength; i < length; i++) {
        const dyn = bindDingData._flatDynamique[i];
        classAttributes[dyn.key] = dyn.value.apply(null, data);
    }

    ElementCreator.processClassAttribute(node, classAttributes);
    return true;
};

export const hydrateStyleAttribute = (node, bindDingData, data) => {
    const styleAttributes = bindDingData._cache;

    for(let i = 0, length = bindDingData._flatDynamiqueLength; i < length; i++) {
        const dyn = bindDingData._flatDynamique[i];
        styleAttributes[dyn.key] = dyn.value.apply(null, data);
    }

    ElementCreator.processStyleAttribute(node, styleAttributes);
    return true;
};

export const hydrateAttributes = (node, bindDingData, data) => {
    const cacheAttributes = bindDingData._cache;

    for(let i = 0, length = bindDingData._flatAttributesLength; i < length; i++) {
        const attr = bindDingData._flatAttributes[i];
        cacheAttributes[attr.name] = attr.value.apply(null, data);
    }

    ElementCreator.processAttributesDirect(node, cacheAttributes);
    return true;
};

export const getHydrator = (bindDingData) => {
    if(!bindDingData._cache) {
        return noUpdate;
    }
    if(bindDingData._flatAttributesLength && bindDingData._flatDynamiqueLength) {
        return hydrateFull;
    }
    if(bindDingData._flatAttributesLength) {
        return hydrateAttributes;
    }
    if(bindDingData._hasClassAttribute && bindDingData._hasStyleAttribute) {
        return hydrateDynamic;
    }
    if(bindDingData._hasClassAttribute) {
        return hydrateClassAttribute;
    }
    return hydrateStyleAttribute;
};