import Anchor from "../elements/anchor";
import Validator from "../utils/validator";
import AttributesWrapper from "./AttributesWrapper";

const $nodeCache = new Map();
let $textNodeCache = null;

export const ElementCreator = {
    createTextNode() {
        if(!$textNodeCache) {
            $textNodeCache = document.createTextNode('');
        }
        return $textNodeCache.cloneNode();
    },
    /**
     *
     * @param {HTMLElement|DocumentFragment} parent
     * @param {ObservableItem} observable
     * @returns {Text}
     */
    createObservableNode(parent, observable) {
        const text = ElementCreator.createTextNode();
        observable.subscribe(value => text.nodeValue = String(value));
        text.nodeValue = observable.val();
        parent && parent.appendChild(text);
        return text;
    },

    /**
     *
     * @param {HTMLElement|DocumentFragment} parent
     * @param {*} value
     * @returns {Text}
     */
    createStaticTextNode(parent, value) {
        let text = ElementCreator.createTextNode();
        text.nodeValue = String(value);
        parent && parent.appendChild(text);
        return text;
    },
    /**
     *
     * @param {string} name
     * @returns {HTMLElement|DocumentFragment}
     */
    createElement(name)  {
        if(name) {
            if($nodeCache.has(name)) {
                return $nodeCache.get(name).cloneNode();
            }
            const node = document.createElement(name);
            $nodeCache.set(name, node);
            return node.cloneNode();
        }
        return new Anchor('Fragment');
    },
    /**
     *
     * @param {*} children
     * @param {HTMLElement|DocumentFragment} parent
     */
    processChildren(children, parent) {
        if(children === null) return;
        const childrenArray = Array.isArray(children) ? children : [children];

        for(let i = 0, length = childrenArray.length; i < length; i++) {
            let child = childrenArray[i];
            if (child === null) continue;
            if(Validator.isString(child) && Validator.isFunction(child.resolveObservableTemplate)) {
                child = child.resolveObservableTemplate();
            }
            if(Validator.isFunction(child)) {
                this.processChildren(child(), parent);
                continue;
            }
            if(Validator.isArray(child)) {
                this.processChildren(child, parent);
                continue;
            }
            if (Validator.isElement(child)) {
                parent.appendChild(child);
                continue;
            }
            if (Validator.isObservable(child)) {
                ElementCreator.createObservableNode(parent, child);
                continue;
            }
            if (child) {
                ElementCreator.createStaticTextNode(parent, child);
            }
        }
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
        return element;
    }
};