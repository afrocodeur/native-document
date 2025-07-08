import HtmlElementEventsWrapper from "./HtmlElementEventsWrapper";
import AttributesWrapper from "./AttributesWrapper";
import NativeDocumentError from "../errors/NativeDocumentError";
import DocumentObserver from "./DocumentObserver";
import Validator from "../utils/validator";
import DebugManager from "../utils/debug-manager";

/**
 *
 * @param {HTMLElement|DocumentFragment} parent
 * @param {ObservableItem} observable
 * @returns {Text}
 */
const createObservableNode = function(parent, observable) {
    const text = document.createTextNode('');
    observable.subscribe(value => text.textContent = String(value));
    text.textContent = observable.val();
    parent && parent.appendChild(text);
    return text;
}

/**
 *
 * @param {HTMLElement|DocumentFragment} parent
 * @param {*} value
 * @returns {Text}
 */
const createStaticTextNode = function(parent, value) {
    const text = document.createTextNode('');
    text.textContent = String(value);
    parent && parent.appendChild(text);
    return text;
}

/**
 *
 * @param {HTMLElement} element
 */
const addUtilsMethods = function(element) {
    element.nd.wrap = (callback) => {
        if(!Validator.isFunction(callback)) {
            throw new NativeDocumentError('Callback must be a function');
        }
        callback && callback(element);
        return element;
    };
    element.nd.ref = (target, name) => {
        target[name] = element;
        return element;
    };

    let $observer = null;

    element.nd.lifecycle = function(states) {
        $observer = $observer || DocumentObserver.watch(element);

        states.mounted && $observer.mounted(states.mounted);
        states.unmounted && $observer.unmounted(states.unmounted);
        return element;
    };

    element.nd.mounted = (callback) => {
        $observer = $observer || DocumentObserver.watch(element);
        $observer.mounted(callback);
        return element;
    };
    element.nd.unmounted = (callback) => {
        $observer = $observer || DocumentObserver.watch(element);
        $observer.unmounted(callback);
        return element;
    };
};

/**
 *
 * @param {*} value
 * @returns {Text}
 */
export const createTextNode = function(value) {
    return (Validator.isObservable(value))
        ? createObservableNode(null, value)
        : createStaticTextNode(null, value);
};

export const ElementCreator = {
    /**
     *
     * @param {string} name
     * @returns {HTMLElement|DocumentFragment}
     */
    createElement(name)  {
        return name ? document.createElement(name) : document.createDocumentFragment();
    },
    /**
     *
     * @param {*} children
     * @param {HTMLElement|DocumentFragment} parent
     */
    processChildren(children, parent) {
        if(children === null) return;
        const childrenArray = Array.isArray(children) ? children : [children];
        childrenArray.forEach(child => {
            if (child === null) return;
            if (Validator.isElement(child)) {
                parent.appendChild(child);
                return;
            }
            if (Validator.isObservable(child)) {
                createObservableNode(parent, child);
                return;
            }
            if (child) {
                createStaticTextNode(parent, child);
            }
        });
    },
    /**
     *
     * @param {HTMLElement} element
     * @param {Object} attributes
     */
    processAttributes(element, attributes) {
        if(Validator.isFragment(element)) return;
        if (attributes) {
            AttributesWrapper(element, attributes);
        }
    },
    /**
     *
     * @param {HTMLElement} element
     * @param {Object} attributes
     * @param {?Function} customWrapper
     * @returns {HTMLElement|DocumentFragment}
     */
    setup(element, attributes, customWrapper) {
        element.nd = {};
        HtmlElementEventsWrapper(element);
        const item = (typeof customWrapper === 'function') ? customWrapper(element) : element;
        addUtilsMethods(item);
        return item;
    }
};

/**
 *
 * @param {string} name
 * @param {?Function} customWrapper
 * @returns {Function}
 */
export default function HtmlElementWrapper(name, customWrapper) {
    const $tagName = name.toLowerCase().trim();

    const builder = function(attributes, children = null) {
        try {
            if(Validator.isValidChildren(attributes)) {
                const tempChildren = children;
                children = attributes;
                attributes = tempChildren;
            }
            const element = ElementCreator.createElement($tagName);

            ElementCreator.processAttributes(element, attributes);
            ElementCreator.processChildren(children, element);

            return ElementCreator.setup(element, attributes, customWrapper);
        } catch (error) {
            DebugManager.error('ElementCreation', `Error creating ${$tagName}`, error);
        }
    }

    builder.hold = (children, attributes) => (() => builder(children, attributes));

    return builder;
}