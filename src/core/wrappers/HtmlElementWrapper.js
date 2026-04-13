import Validator from "../utils/validator";
import Anchor from "../elements/anchor/anchor";
import {ElementCreator} from "./ElementCreator";
import './NdPrototype';
import {normalizeComponentArgs} from "../utils/args-types";

/**
 *
 * @param {*} value
 * @returns {Text}
 */
export const createTextNode = (value) => {
    if(value) {
        return value.toNdElement();
    }
    return ElementCreator.createTextNode();
};


export const createHtmlElement = (element, _attributes, _children = null) => {
    let { props: attributes, children = null } = normalizeComponentArgs(_attributes, _children);

    ElementCreator.processAttributes(element, attributes);
    ElementCreator.processChildren(children, element);
    return element;
}

/**
 *
 * @param {string} name
 * @param {?Function=} customWrapper
 * @returns {Function}
 */
export default function HtmlElementWrapper(name, customWrapper = null) {
    if(name) {
        if(customWrapper) {
            let node = null;
            let createElement = (attr, children) => {
                node = document.createElement(name);
                createElement = (attr, children) => {
                    return createHtmlElement(customWrapper(node.cloneNode()), attr, children);
                };
                return createHtmlElement(customWrapper(node.cloneNode()), attr, children);;
            };

            return (attr, children) => createElement(attr, children)
        }

        let node = null;
        let createElement = (attr, children) => {
            node = document.createElement(name);
            createElement = (attr, children) => {
                return createHtmlElement(node.cloneNode(), attr, children);
            };
            return createHtmlElement(node.cloneNode(), attr, children);
        };

        return (attr, children) => createElement(attr, children)
    }
    return (children, name = '') => {
        const anchor = Anchor(name);
        anchor.append(children);
        return anchor;
    };
};

