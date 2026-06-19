import Validator from '../utils/validator';
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
        if (value.__$isObservableChecker) {
            let lastClass = value.val();
            if (typeof lastClass === 'string') {
                element.classes.toggle(lastClass, true);
                value.subscribe((currentValue) => {
                    element.classes.remove(lastClass);
                    element.classes.toggle(currentValue, true);
                    lastClass = currentValue;
                });
                return;
            }
        }

        if (value.__$Observable) {
            element.classes.toggle(className, value.val());
            value.subscribe((shouldAdd) => element.classes.toggle(className, shouldAdd));
            return;
        }

        if (value.$hydrate) {
            value.$hydrate(element, className);
            return;
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
                    if(newValue === false || newValue == null) {
                        element.style.removeProperty(styleName);
                        return;
                    }
                    element.style.setProperty(styleName, newValue);
                });
            } else {
                element.style[styleName] = value.val();
                value.subscribe((newValue) => {
                    if(newValue === false || newValue == null) {
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
    const isObservable = value.__$Observable;
    const defaultValue = isObservable? value.val() : value;

    const attributeRealName = BOOL_ATTRIBUTES_NAME[attributeName] || attributeName;

    if(typeof defaultValue === 'boolean') {
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
    if(attributeName === 'value') {
        element.value = value.val();
        element.addEventListener('input', () => value.set(element.value));
        value.subscribe((newValue) => element.value = newValue);
        return;
    }
    element.setAttribute(attributeName, value.val());
    value.subscribe((newValue) => {
        if(newValue == null) {
            element.removeAttribute(attributeName);
            return;
        }
        element.setAttribute(attributeName, newValue);
    });
};

/**
 *
 * @param {HTMLElement} element
 * @param {Object} attributes
 */
const AttributesWrapper = (element, attributes = {}) => {

    if(process.env.NODE_ENV === 'development') {
        Validator.validateAttributes(attributes);
    }

    for(const attributeName in attributes) {
        const value = attributes[attributeName];
        if(value == null) {
            continue;
        }
        const type = typeof value;
        if(type === 'string' || type === 'number') {
            element.setAttribute(attributeName, value);
            continue;
        }
        // const attributeName = originalAttributeName.toLowerCase();
        if(value.__$Observable) {
            if(BOOLEAN_ATTRIBUTES.has(attributeName)) {
                bindBooleanAttribute(element, attributeName, value);
                continue;
            }
            bindAttributeWithObservable(element, attributeName, value);
            continue;
        }
        if(type ===  'object') {
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
        if(value.__$isTemplateBinding) {
            value.$hydrate(element, attributeName);
        }

        element.setAttribute(attributeName, value);
    }
    return element;
};

export default AttributesWrapper;