import Validator from "../utils/validator";
import NativeDocumentError from "../errors/NativeDocumentError";
import {BOOLEAN_ATTRIBUTES} from "./constants.js";
import {Observable} from "../data/Observable";

/**
 *
 * @param {HTMLElement} element
 * @param {Object} data
 */
export function bindClassAttribute(element, data) {
    for(const className in data) {
        const value = data[className];
        if(value.__$isObservable) {
            element.classes.toggle(className, value.val());
            value.subscribe((shouldAdd) => element.classes.toggle(className, shouldAdd));
            continue;
        }
        if(value.__$isObservableWhen) {
            element.classes.toggle(className, value.isMath());
            value.subscribe((shouldAdd) => element.classes.toggle(className, shouldAdd));
            continue;
        }
        if(value.$hydrate) {
            value.$hydrate(element, className);
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
    for(const styleName in data) {
        const value = data[styleName];
        if(value.__$isObservable) {
            element.style[styleName] = value.val();
            value.subscribe((newValue) => element.style[styleName] = newValue);
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
    const isObservable = value.__$isObservable;
    const defaultValue = isObservable? value.val() : value;
    if(Validator.isBoolean(defaultValue)) {
        element[attributeName] = defaultValue;
    }
    else {
        element[attributeName] = defaultValue === element.value;
    }
    if(isObservable) {
        if(attributeName === 'checked') {
            if(typeof defaultValue === 'boolean') {
                element.addEventListener('input', () => value.set(element[attributeName]));
            }
            else {
                element.addEventListener('input', () => value.set(element.value));
            }
            value.subscribe((newValue) => element[attributeName] = newValue);
            return;
        }
        value.subscribe((newValue) => element[attributeName] = (newValue === element.value));
    }
}


/**
 *
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {Observable} value
 */
export function bindAttributeWithObservable(element, attributeName, value) {
    const applyValue = attributeName === 'value' ? (newValue) => element.value = newValue : (newValue) => element.setAttribute(attributeName, newValue);
    value.subscribe(applyValue);

    if(attributeName === 'value') {
        element.value = value.val();
        element.addEventListener('input', () => value.set(element.value));
        return;
    }
    element.setAttribute(attributeName, value.val());
}

/**
 *
 * @param {HTMLElement} element
 * @param {Object} attributes
 */
export default function AttributesWrapper(element, attributes) {

    Validator.validateAttributes(attributes);

    for(const originalAttributeName in attributes) {
        const attributeName = originalAttributeName.toLowerCase();
        let value = attributes[originalAttributeName];
        if(value == null) {
            continue;
        }
        if(value.handleNdAttribute) {
            value.handleNdAttribute(element, attributeName, value)
            continue;
        }
        if(typeof value ===  'object') {
            if(attributeName === 'class') {
                bindClassAttribute(element, value);
                continue;
            }
            if(attributeName === 'style') {
                bindStyleAttribute(element, value);
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