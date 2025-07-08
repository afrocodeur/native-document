import Validator from "../utils/validator";
import NativeDocumentError from "../errors/NativeDocumentError";


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
 * @param {Object} attributes
 */
export default function AttributesWrapper(element, attributes) {

    Validator.validateAttributes(attributes);

    if(!Validator.isObject(attributes)) {
        console.log(attributes);
        throw new NativeDocumentError('Attributes must be an object');
    }

    for(let attributeName in attributes) {
        const value = attributes[attributeName];
        if(Validator.isObservable(value)) {
            value.subscribe(newValue => element.setAttribute(attributeName, newValue));
            element.setAttribute(attributeName, value.val());
            if(attributeName === 'value') {
                if(['checkbox', 'radio'].includes(element.type)) {
                    element.addEventListener('input', () => value.set(element.checked));
                } else {
                    element.addEventListener('input', () => value.set(element.value));
                }
            }
            continue;
        }
        if(attributeName === 'class' && Validator.isObject(value)) {
            bindClassAttribute(element, value);
            continue;
        }
        if(attributeName === 'style' && Validator.isObject(value)) {
            bindStyleAttribute(element, value);
            continue;
        }
        element.setAttribute(attributeName, value);
    }
    return element;
}