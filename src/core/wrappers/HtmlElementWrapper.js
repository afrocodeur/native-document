import Anchor from '../elements/anchor/anchor';
import {ElementCreator} from './ElementCreator';
import {normalizeComponentArgs} from '../utils/args-types';
import './NdPrototype';

import '../../core/utils/prototypes.js';
import '../wrappers/prototypes/nd-element-extensions';
import '../wrappers/prototypes/bind-class-extensions';
import '../wrappers/prototypes/nd-element.transition.extensions';
import '../wrappers/prototypes/attributes-extensions';


/**
 * Creates a reactive or static text node from the given value.
 * If the value has a .toNdElement() method, delegates to it.
 * Otherwise creates an empty text node.
 *
 * @param {string|number|ObservableItem|*} value - Value to convert to a text node
 * @returns {Text} Text node, reactive if value is an ObservableItem
 */
export const createTextNode = (value) => {
    if(value) {
        return value.toNdElement();
    }
    return ElementCreator.createTextNode();
};


/**
 * Applies attributes to an existing HTMLElement.
 * Used internally by HtmlElementWrapper on each cloned node.
 *
 * @internal
 * @param {HTMLElement} element - Element to configure
 * @param {Object|null} attributes - Attributes object or children if no attrs provided
 * @returns {HTMLElement} The configured element
 */
export const createVoidHtmlElement = (element, attributes) => {
    attributes && ElementCreator.processAttributes(element, attributes);
    return element;
};


const OBJECT_PROTOTYPE = Object.prototype;
/**
 * Applies attributes and children to an existing HTMLElement.
 * Used internally by HtmlElementWrapper on each cloned node.
 *
 * @internal
 * @param {HTMLElement} element - Element to configure
 * @param {Object|null} _attributes - Attributes object or children if no attrs provided
 * @param {ValidChild|null} [_children=null] - Children to append
 * @returns {HTMLElement} The configured element
 */
export const createHtmlElement = (element, _attributes, _children = null) => {
    let attributes = _attributes, children = _children;
    if(_attributes?.__$isValidNdChild) { // If attributes is a ValidChild
        attributes = _children;
        children = _attributes;
    }

    if(attributes) {
        ElementCreator.processAttributes(element, attributes);
    }
    if(children) {
        ElementCreator.processChildren(children, element);
    }
    return element;
};

/**
 * Creates a reusable element factory function for the given HTML tag.
 * The factory clones a cached template node on each call for performance.
 * Optionally wraps the created element with a custom wrapper function.
 *
 * @param {string} name - HTML tag name (e.g. 'div', 'button', 'input'). Pass empty string to create a Fragment.
 * @param {((element: HTMLElement) => HTMLElement)|null} [customWrapper=null] - Optional function to augment the element before returning
 * @returns {(attr?: Object, children?: ValidChild) => HTMLElement} Element factory function
 * @example
 * const Div = HtmlElementWrapper('div');
 * Div({ class: 'container' }, 'Hello');
 *
 * // With custom wrapper
 * const Form = HtmlElementWrapper('form', (el) => {
 *   el.submit = (action) => { ... };
 *   return el;
 * });
 */
export default function  HtmlElementWrapper(name, customWrapper = null, isVoid = false) {
    const elementCreator = isVoid ? createVoidHtmlElement : createHtmlElement;
    if(name) {
        if(customWrapper) {
            let node = null;
            let createElement = (attr, children) => {
                node = document.createElement(name);
                createElement = (attr, children) => {
                    return elementCreator(customWrapper(node.cloneNode()), attr, children);
                };
                return elementCreator(customWrapper(node.cloneNode()), attr, children);;
            };

            return (attr, children) => createElement(attr, children);
        }

        let node = null;
        let createElement = (attr, children) => {
            node = document.createElement(name);
            createElement = (attr, children) => {
                return elementCreator(node.cloneNode(), attr, children);
            };
            return elementCreator(node.cloneNode(), attr, children);
        };

        return (attr, children) => createElement(attr, children);
    }
    return (children, name = '') => {
        const anchor = Anchor(name);
        anchor.append(children);
        return anchor;
    };
};

