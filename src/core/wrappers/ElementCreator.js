import Anchor from "../elements/anchor";
import Validator from "../utils/validator";
import AttributesWrapper from "./AttributesWrapper";
import PluginsManager from "../utils/plugins-manager";
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
            const cacheNode = $nodeCache.get(name);
            if(cacheNode) {
                return cacheNode.cloneNode();
            }
            const node = document.createElement(name);
            $nodeCache.set(name, node);
            return node.cloneNode();
        }
        return Anchor('Fragment');
    },
    bindTextNode(textNode, value) {
        if(value?.__$isObservable) {
            value.subscribe(newValue => textNode.nodeValue = newValue);
            textNode.nodeValue = value.val();
            return;
        }
        textNode.nodeValue = value;
    },
    /**
     *
     * @param {*} children
     * @param {HTMLElement|DocumentFragment} parent
     */
    processChildren(children, parent) {
        if(children === null) return;
        if(process.env.NODE_ENV === 'development') {
            PluginsManager.emit('BeforeProcessChildren', parent);
        }
        let child = this.getChild(children);
        if(child) {
            parent.appendChild(child);
        }
        if(process.env.NODE_ENV === 'development') {
            PluginsManager.emit('AfterProcessChildren', parent);
        }
    },
    getChild(child) {
        if(child == null) {
            return null;
        }
        if(child.toNdElement) {
            do {
                child =  child.toNdElement();
                if(Validator.isElement(child)) {
                    return child;
                }
            } while (child.toNdElement);
        }

        return ElementCreator.createStaticTextNode(null, child);
    },
    /**
     *
     * @param {HTMLElement} element
     * @param {Object} attributes
     */
    processAttributes(element, attributes) {
        if (attributes) {
            AttributesWrapper(element, attributes);
        }
    }
};