import Validator from "../utils/validator";
import DebugManager from "../utils/debug-manager";
import {ElementCreator} from "./ElementCreator";
import './NdPrototype';

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


/**
 *
 * @param {string} name
 * @param {?Function} customWrapper
 * @returns {Function}
 */
export default function HtmlElementWrapper(name, customWrapper) {
    const $tagName = name.toLowerCase();

    const builder = function(attributes, children = null) {
        try {
            if(Validator.isValidChildren(attributes)) {
                const tempChildren = children;
                children = attributes;
                attributes = tempChildren;
            }
            const element = ElementCreator.createElement($tagName);
            const finalElement = (typeof customWrapper === 'function') ? customWrapper(element) : element;

            ElementCreator.processAttributes(finalElement, attributes);
            ElementCreator.processChildren(children, finalElement);

            return ElementCreator.setup(finalElement, attributes, customWrapper);
        } catch (error) {
            DebugManager.error('ElementCreation', `Error creating ${$tagName}`, error);
        }
    };

    builder.hold = (children, attributes) => (() => builder(children, attributes));

    return builder;
}

