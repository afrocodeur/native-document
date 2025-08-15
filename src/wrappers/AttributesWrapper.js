import Validator from "../utils/validator";
import NativeDocumentError from "../errors/NativeDocumentError";
import {BOOLEAN_ATTRIBUTES} from "./constants.js";
import {Observable} from "../data/Observable";

/**
 *
 * @param {HTMLElement} element
 * @param {Object} data
 */
function bindClassAttribute(element, data) {
    for(let className in data) {
        const value = data[className];
        if(Validator.isObservable(value)) {
            element.classList.toggle(className, value.val());
            value.subscribe(newValue => element.classList.toggle(className, newValue));
            continue;
        }
        element.classList.toggle(className, value)
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
    const defaultValue = Validator.isObservable(value) ? value.val() : value;
    if(Validator.isBoolean(defaultValue)) {
        element[attributeName] = defaultValue;
    }
    else {
        element[attributeName] = defaultValue === element.value;
    }
    if(Validator.isObservable(value)) {
        if(['checked'].includes(attributeName)) {
            element.addEventListener('input', () => {
                if(Validator.isBoolean(defaultValue)) {
                    value.set(element[attributeName]);
                    return;
                }
                value.set(element.value);
            });
        }
        value.subscribe(newValue => {
            if(Validator.isBoolean(newValue)) {
                element[attributeName] = newValue;
                return;
            }
            element[attributeName] = newValue === element.value;
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
        let value = attributes[attributeName];
        if(Validator.isString(value) && Validator.isFunction(value.resolveObservableTemplate)) {
            value = value.resolveObservableTemplate();
            if(Validator.isArray(value)) {
                const observables = value.filter(item => Validator.isObservable(item));
                value = Observable.computed(() => {
                    return value.map(item => Validator.isObservable(item) ? item.val() : item).join(' ') || ' ';
                }, observables);
            }
        }
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