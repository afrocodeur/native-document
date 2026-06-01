import Validator from '../utils/validator';
import NativeDocumentError from '../errors/NativeDocumentError';
import {BOOL_ATTRIBUTES_NAME, BOOLEAN_ATTRIBUTES} from './constants.js';
import {Observable} from '../data/Observable';

/**
 * Applies a reactive class map to an HTMLElement.
 * Each key is a CSS class name; each value is a boolean or ObservableItem<boolean>.
 * If the value is an ObservableChecker emitting a string, toggles the class name dynamically.
 *
 * @param {HTMLElement} element - Target element
 * @param {Record<string, boolean|ObservableItem<boolean>|ObservableChecker<boolean|string>>} data - Class map
 */
export const bindClassAttribute = (element, data) => {
    for(const className in data) {
        const value = data[className];
        if(value.__$Observable) {
            if(value.__$isObservableChecker) {
                let lastClass = value.val();
                if(typeof lastClass === 'string') {
                    element.classes.toggle(lastClass, true);
                    value.subscribe((currentValue) => {
                        element.classes.remove(lastClass);
                        element.classes.toggle(currentValue, true);
                        lastClass = currentValue;
                    });
                    continue;
                }
            }
            element.classes.toggle(className, value.val());
            value.subscribe((shouldAdd) => element.classes.toggle(className, shouldAdd));
            continue;
        }
        if(value.$hydrate) {
            value.$hydrate(element, className);
            continue;
        }
        element.classes.toggle(className, value);
    }
};

/**
 * Applies a reactive style map to an HTMLElement.
 * Each key is a CSS property name (camelCase or CSS custom property `--var`);
 * each value is a string or ObservableItem<string>.
 * CSS custom properties are set via element.style.setProperty().
 *
 * @param {HTMLElement} element - Target element
 * @param {Record<string, string|ObservableItem<string>>} data - Style map
 */
export const bindStyleAttribute = (element, data) => {
    for(const styleName in data) {
        const value = data[styleName];
        const isCustomProperty = styleName.startsWith('--');

        if(value.__$Observable) {
            if(isCustomProperty) {
                element.style.setProperty(styleName, value.val());
                value.subscribe((newValue) => {
                    if(newValue === false) {
                        element.style.removeProperty(styleName);
                        return;
                    }
                    element.style.setProperty(styleName, newValue);
                });
            } else {
                element.style[styleName] = value.val();
                value.subscribe((newValue) => {
                    if(newValue === false) {
                        element.style.removeProperty(styleName);
                        return;
                    }
                    element.style[styleName] = newValue;
                });
            }
            continue;
        }

        if(isCustomProperty) {
            element.style.setProperty(styleName, value);
            continue;
        }

        element.style[styleName] = value;
    }
};

/**
 *
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {boolean|number|Observable} value
 */
export const bindBooleanAttribute = (element, attributeName, value) => {
    const isObservable = value.__$isObservable;
    const defaultValue = isObservable? value.val() : value;

    const attributeRealName = BOOL_ATTRIBUTES_NAME[attributeName];

    if(Validator.isBoolean(defaultValue)) {
        element[attributeRealName] = defaultValue;
    }
    else {
        element[attributeRealName] = defaultValue === element.value;
    }
    if(isObservable) {
        if(attributeName === 'checked') {
            if(typeof defaultValue === 'boolean') {
                element.addEventListener('input', () => value.set(element[attributeRealName]));
            }
            else {
                element.addEventListener('input', () => value.set(element.value));
            }
            value.subscribe((newValue) => element[attributeRealName] = newValue);
            return;
        }
        value.subscribe((newValue) => element[attributeRealName] = (newValue === element.value));
    }
};


/**
 *
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {Observable} value
 */
export const bindAttributeWithObservable = (element, attributeName, value) => {
    const applyValue = attributeName === 'value' ? (newValue) => element.value = newValue : (newValue) => element.setAttribute(attributeName, newValue);
    value.subscribe(applyValue);

    if(attributeName === 'value') {
        element.value = value.val();
        element.addEventListener('input', () => value.set(element.value));
        return;
    }
    element.setAttribute(attributeName, value.val());
};

/**
 *
 * @param {HTMLElement} element
 * @param {Object} attributes
 */
const AttributesWrapper = (element, attributes) => {

    if(process.env.NODE_ENV === 'development') {
        Validator.validateAttributes(attributes);
    }

    for(const originalAttributeName in attributes) {
        const attributeName = originalAttributeName.toLowerCase();
        const value = attributes[originalAttributeName];
        if(value == null) {
            continue;
        }
        if(value.handleNdAttribute) {
            value.handleNdAttribute(element, attributeName, value);
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
};

export default AttributesWrapper;