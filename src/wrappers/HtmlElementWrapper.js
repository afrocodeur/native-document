import Validator from "../utils/validator";
import {ElementCreator} from "./ElementCreator";
import './NdPrototype';
import {normalizeComponentArgs} from "../utils/args-types";

/**
 *
 * @param {*} value
 * @returns {Text}
 */
export const createTextNode = function(value) {
    return (Validator.isObservable(value))
        ? ElementCreator.createObservableNode(null, value)
        : ElementCreator.createStaticTextNode(null, value);
};


function createHtmlElement($tagName, customWrapper, _attributes, _children = null) {
    let { props: attributes, children = null } = normalizeComponentArgs(_attributes, _children);
    let element = ElementCreator.createElement($tagName);
    let finalElement = (customWrapper && typeof customWrapper === 'function') ? customWrapper(element) : element;

    if(attributes) {
        ElementCreator.processAttributes(finalElement, attributes);
    }
    if(children) {
        ElementCreator.processChildren(children, finalElement);
    }

    return ElementCreator.setup(finalElement, attributes, customWrapper);
}

/**
 *
 * @param {string} name
 * @param {?Function} customWrapper
 * @returns {Function}
 */
export default function HtmlElementWrapper(name, customWrapper) {
    return createHtmlElement.bind(null, name.toLowerCase(), customWrapper);
};

