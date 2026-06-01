import {ElementCreator} from '../ElementCreator';

/**
 * Hydrates a cloned node with all attribute, class, style, and attachment bindings
 * from a compiled BindingData object. Full update path — applies both static attributes
 * and dynamic class/style maps.
 *
 * @internal
 * @param {HTMLElement} node - Cloned DOM node to hydrate
 * @param {BindingData} bindDingData - Pre-compiled binding metadata
 * @param {Array} data - Data array passed to each binding callback
 * @returns {true}
 */
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

/**
 * Hydrates only the dynamic class and style bindings on a cloned node.
 * Used when there are no static attribute bindings.
 *
 * @internal
 * @param {HTMLElement} node - Cloned DOM node to hydrate
 * @param {BindingData} bindDingData - Pre-compiled binding metadata
 * @param {Array} data - Data array passed to each binding callback
 * @returns {true}
 */
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

/**
 * Hydrates only the dynamic class bindings on a cloned node.
 *
 * @internal
 * @param {HTMLElement} node - Cloned DOM node to hydrate
 * @param {BindingData} bindDingData - Pre-compiled binding metadata
 * @param {Array} data - Data array passed to each binding callback
 * @returns {true}
 */
export const hydrateClassAttribute = (node, bindDingData, data) => {
    const classAttributes = bindDingData._cache.class;

    for(let i = 0, length = bindDingData._flatDynamiqueLength; i < length; i++) {
        const dyn = bindDingData._flatDynamique[i];
        classAttributes[dyn.key] = dyn.value.apply(null, data);
    }

    ElementCreator.processClassAttribute(node, classAttributes);
    return true;
};

/**
 * Hydrates only the dynamic style bindings on a cloned node.
 *
 * @internal
 * @param {HTMLElement} node - Cloned DOM node to hydrate
 * @param {BindingData} bindDingData - Pre-compiled binding metadata
 * @param {Array} data - Data array passed to each binding callback
 * @returns {true}
 */
export const hydrateStyleAttribute = (node, bindDingData, data) => {
    const styleAttributes = bindDingData._cache;

    for(let i = 0, length = bindDingData._flatDynamiqueLength; i < length; i++) {
        const dyn = bindDingData._flatDynamique[i];
        styleAttributes[dyn.key] = dyn.value.apply(null, data);
    }

    ElementCreator.processStyleAttribute(node, styleAttributes);
    return true;
};

/**
 * Hydrates only the static attribute bindings on a cloned node.
 *
 * @internal
 * @param {HTMLElement} node - Cloned DOM node to hydrate
 * @param {BindingData} bindDingData - Pre-compiled binding metadata
 * @param {Array} data - Data array passed to each binding callback
 * @returns {true}
 */
export const hydrateAttributes = (node, bindDingData, data) => {
    const cacheAttributes = bindDingData._cache;

    for(let i = 0, length = bindDingData._flatAttributesLength; i < length; i++) {
        const attr = bindDingData._flatAttributes[i];
        cacheAttributes[attr.name] = attr.value.apply(null, data);
    }

    ElementCreator.processAttributesDirect(node, cacheAttributes);
    return true;
};

/**
 * Selects and returns the most efficient hydration function for the given BindingData.
 * Called once during template compilation to assign the optimal update path.
 *
 * @internal
 * @param {BindingData} bindDingData - Pre-compiled binding metadata
 * @returns {Function} One of: hydrateFull, hydrateDynamic, hydrateClassAttribute, hydrateStyleAttribute, hydrateAttributes, or noUpdate
 */
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