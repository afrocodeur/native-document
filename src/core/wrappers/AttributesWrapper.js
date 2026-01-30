import Validator from "../utils/validator";
import NativeDocumentError from "../errors/NativeDocumentError";
import {BOOLEAN_ATTRIBUTES} from "./constants.js";
import {Observable} from "../data/Observable";
import './prototypes/bind-class-extensions';


export function toggleElementClass(element, className, shouldAdd) {
    element.classes.toggle(className, shouldAdd);
}

export function toggleElementStyle(element, styleName, newValue) {
    element.style[styleName] = newValue;
}

export function updateInputFromObserver(element, attributeName, newValue) {
    if(Validator.isBoolean(newValue)) {
        element[attributeName] = newValue;
        return;
    }
    element[attributeName] = newValue === element.value;
}

export function updateObserverFromInput(element, attributeName, defaultValue, value) {
    if(Validator.isBoolean(defaultValue)) {
        value.set(element[attributeName]);
        return;
    }
    value.set(element.value);
}

/**
 *
 * @param {HTMLElement} element
 * @param {Object} data
 */
export function bindClassAttribute(element, data) {
    for(let className in data) {
        const value = data[className];
        if(value?.bindNdClass) {
            value.bindNdClass(element, className);
            continue;
        }
        element.classes.toggle(className, value)
    }
    data = null;
}

/**
 *
 * @param {HTMLElement} element
 * @param {Object} data
 */
export function bindStyleAttribute(element, data) {
    for(let styleName in data) {
        const value = data[styleName];
        if(Validator.isObservable(value)) {
            element.style[styleName] = value.val();
            value.subscribe(toggleElementStyle.bind(null, element, styleName));
            continue;
        }
        element.style[styleName] = value;
    }
}

/**
 *
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {boolean|number|Observable} value
 */
export function bindBooleanAttribute(element, attributeName, value) {
    const defaultValue = Validator.isObservable(value) ? value.val() : value;
    if(Validator.isBoolean(defaultValue)) {
        element[attributeName] = defaultValue;
    }
    else {
        element[attributeName] = defaultValue === element.value;
    }
    if(Validator.isObservable(value)) {
        if(['checked'].includes(attributeName)) {
            element.addEventListener('input', updateObserverFromInput.bind(null, element, attributeName, defaultValue, value));
        }
        value.subscribe(updateInputFromObserver.bind(null, element, attributeName));
    }
}


/**
 *
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {Observable} value
 */
export function bindAttributeWithObservable(element, attributeName, value) {
    const applyValue = (newValue) => {
        if(attributeName === 'value') {
            element.value = newValue;
            return;
        }
        element.setAttribute(attributeName, newValue);
    };
    applyValue(value.val());
    value.subscribe(applyValue);

    if(attributeName === 'value') {
        element.addEventListener('input', () => value.set(element.value));
    }
}

const NdBindings = {
    class: (element, value) => bindClassAttribute(element, value),
    style: (element, value) => bindStyleAttribute(element, value),
};


/**
 *
 * @param {HTMLElement} element
 * @param {Object} attributes
 */
export default function AttributesWrapper(element, attributes) {

    Validator.validateAttributes(attributes);

    if(!Validator.isObject(attributes)) {
        throw new NativeDocumentError('Attributes must be an object');
    }

    for(let key in attributes) {
        const attributeName = key.toLowerCase();
        let value = attributes[key];
        if(value == null) {
            continue;
        }
        if(value.handleNdAttribute) {
            value.handleNdAttribute(element, attributeName, value)
            continue;
        }
        if(typeof value === 'object') {
            const binding = NdBindings[attributeName];
            if(binding) {
                binding(element, value);
                continue;
            }
        }
        if(BOOLEAN_ATTRIBUTES.has(attributeName)) {
            bindBooleanAttribute(element, attributeName, value);
            continue;
        }

        element.setAttribute(attributeName, value);
    }
    return element;
}