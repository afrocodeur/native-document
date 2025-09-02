import Anchor from "../elements/anchor";
import Validator from "../utils/validator";
import AttributesWrapper from "./AttributesWrapper";
import PluginsManager from "../utils/plugins-manager";

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
        observable.subscribe(value => text.nodeValue = value);
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
        text.nodeValue = value;
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

        PluginsManager.emit('BeforeProcessChildren', parent);

        for(let i = 0, length = childrenArray.length; i < length; i++) {
            let child = this.getChild(childrenArray[i]);
            if (child === null) continue;
            parent.appendChild(child);
        }

        PluginsManager.emit('AfterProcessChildren', parent);
    },
    getChild(child) {
        if(child === null) {
            return null;
        }
        if(Validator.isString(child)) {
            child = child.resolveObservableTemplate ? child.resolveObservableTemplate() : child;
            if(Validator.isString(child)) {
                return ElementCreator.createStaticTextNode(null, child);
            }
        }
        if (Validator.isElement(child)) {
            return child;
        }
        if (Validator.isObservable(child)) {
            return ElementCreator.createObservableNode(null, child);
        }
        if(Validator.isNDElement(child)) {
            return child.$element ?? child.$build?.() ?? null;
        }
        if(Validator.isArray(child)) {
            const fragment = document.createDocumentFragment();
            for(let i = 0, length = child.length; i < length; i++) {
                fragment.appendChild(this.getChild(child[i]));
            }
            return fragment;
        }
        if(Validator.isFunction(child)) {
            PluginsManager.emit('BeforeProcessComponent', child);
            return this.getChild(child());
        }
        return ElementCreator.createStaticTextNode(null, child);
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
        PluginsManager.emit('Setup', element, attributes, customWrapper);
        return element;
    }
};