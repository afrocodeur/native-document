import Validator from "../utils/validator";
import NativeDocumentError from "../errors/NativeDocumentError";
import {BOOLEAN_ATTRIBUTES} from "./constants.js";

/**
 *
 * @param {HTMLElement} element
 * @param {string} className
 * @param {string} value
 */
const toggleClassItem = function(element, className, value) {
    if(value) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}

/**
 *
 * @param {HTMLElement} element
 * @param {Object} data
 */
function bindClassAttribute(element, data) {
    for(let className in data) {
        const value = data[className];
        if(Validator.isObservable(value)) {
            toggleClassItem(element, className, value.val());
            value.subscribe(newValue => toggleClassItem(element, className, newValue));
            continue;
        }
        toggleClassItem(element, className, value);
    }
}

/**
 *
 * @param {HTMLElement} element
 * @param {Object} data
 */
function bindStyleAttribute(element, data) {
    for(let styleName in data) {
        const value = data[styleName];
        if(Validator.isObservable(value)) {
            element.style[styleName] = value.val();
            value.subscribe(newValue => {
                element.style[styleName] = newValue;
            });
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
function bindBooleanAttribute(element, attributeName, value) {
    element[attributeName] = Boolean(Validator.isObservable(value) ? value.val() : value);
    if(Validator.isObservable(value)) {
        if(['checked'].includes(attributeName)) {
            element.addEventListener('input', () => value.set(element[attributeName]));
        }
        value.subscribe(newValue => {
            element[attributeName] = Boolean(newValue);
        });
    }
}


/**
 *
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {Observable} value
 */
function bindAttributeWithObservable(element, attributeName, value) {
    value.subscribe(newValue => element.setAttribute(attributeName, newValue));
    element.setAttribute(attributeName, value.val());
    if(attributeName === 'value') {
        if(['checkbox', 'radio'].includes(element.type)) {
            element.addEventListener('input', () => value.set(element.checked));
        } else {
            element.addEventListener('input', () => value.set(element.value));
        }
    }
}

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
        const value = attributes[attributeName];
        if(BOOLEAN_ATTRIBUTES.includes(attributeName)) {
            bindBooleanAttribute(element, attributeName, value);
            continue;
        }
        if(Validator.isObservable(value)) {
            bindAttributeWithObservable(element, attributeName, value);
            continue;
        }
        if(attributeName === 'class' && Validator.isJson(value)) {
            bindClassAttribute(element, value);
            continue;
        }
        if(attributeName === 'style' && Validator.isJson(value)) {
            bindStyleAttribute(element, value);
            continue;
        }
        element.setAttribute(attributeName, value);
    }
    return element;
}