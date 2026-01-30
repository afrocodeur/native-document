import Anchor from "@src/core/elements/anchor";
import Validator from "@src/core/utils/validator";
import AttributesWrapper from "./AttributesWrapper";
import PluginsManager from "@src/core/utils/plugins-manager";
import './prototypes/nd-element-extensions';
import './prototypes/attributes-extensions';

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
     * @param {{$hydrate: Function}} item
     * @returns {Text}
     */
    createHydratableNode(parent, item) {
        const text = ElementCreator.createTextNode();
        item.$hydrate(text);
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
        return Anchor('Fragment');
    },
    /**
     *
     * @param {*} children
     * @param {HTMLElement|DocumentFragment} parent
     */
    processChildren(children, parent) {
        if(children === null) return;
        PluginsManager.emit('BeforeProcessChildren', parent);
        let child = this.getChild(children);
        if(child) {
            parent.appendChild(child);
        }
        PluginsManager.emit('AfterProcessChildren', parent);
    },
    getChild(child) {
        while (child?.toNdElement) {
            child = child.toNdElement();

            if (Validator.isElement(child)) return child;
            if (!child) return null;
        }

        return child ? ElementCreator.createStaticTextNode(null, child) : null;
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