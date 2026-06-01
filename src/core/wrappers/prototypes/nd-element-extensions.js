import ObservableItem from '../../data/ObservableItem';
import {NDElement} from '../NDElement';
import TemplateBinding from '../TemplateBinding';
import {ElementCreator} from '../ElementCreator';
import PluginsManager from '../../utils/plugins-manager';
import ObservableChecker from '../../data/ObservableChecker';


NDElement.$getChild = ElementCreator.getChild;

/**
 * Converts a string to a reactive text node.
 *
 * @returns {Text} Static text node containing the string value
 */
String.prototype.toNdElement = function () {
    return ElementCreator.createStaticTextNode(null, this);
};

/**
 * Converts a number to a static text node.
 *
 * @returns {Text} Static text node containing the number as a string
 */
Number.prototype.toNdElement = function () {
    return ElementCreator.createStaticTextNode(null, this.toString());
};

/**
 * Returns the element itself (identity for DOM compatibility).
 *
 * @returns {Element} this
 */
Element.prototype.toNdElement = function () {
    return this;
};

/**
 * Returns the text node itself (identity for DOM compatibility).
 *
 * @returns {Text} this
 */
Text.prototype.toNdElement = function () {
    return this;
};

/**
 * Returns the comment node itself (identity for DOM compatibility).
 *
 * @returns {Comment} this
 */
Comment.prototype.toNdElement = function () {
    return this;
};

/**
 * Returns the document itself (identity for DOM compatibility).
 *
 * @returns {Document} this
 */
Document.prototype.toNdElement = function () {
    return this;
};

/**
 * Returns the document fragment itself (identity for DOM compatibility).
 *
 * @returns {DocumentFragment} this
 */
DocumentFragment.prototype.toNdElement = function () {
    return this;
};

/**
 * Converts the ObservableItem to a reactive text node that updates automatically when the value changes.
 *
 * @returns {Text} Reactive text node bound to this observable
 */
ObservableItem.prototype.toNdElement = function () {
    return ElementCreator.createObservableNode(null, this);
};

ObservableChecker.prototype.toNdElement = ObservableItem.prototype.toNdElement;

/**
 * Converts the NDElement to its underlying HTMLElement (or ghost DOM fragment if ghostDom was used).
 *
 * @returns {HTMLElement|DocumentFragment} The underlying DOM node
 */
NDElement.prototype.toNdElement = function () {
    const element = this.$element ?? this.$build?.() ?? this.build?.() ?? null;
    if(this.$attachements) {
        if(!this.$attachements.contains(this.$element)) {
            this.$attachements.append(this.$element);
        }
        return this.$attachements;
    }
    return element;
};

/**
 * Converts the array to a DocumentFragment containing all elements.
 * Each item is processed through ElementCreator.getChild().
 *
 * @returns {DocumentFragment} Fragment containing all array children
 */
Array.prototype.toNdElement = function () {
    const fragment = document.createDocumentFragment();
    for(let i = 0, length = this.length; i < length; i++) {
        const child = ElementCreator.getChild(this[i]);
        if(child === null) continue;
        fragment.appendChild(child);
    }
    return fragment;
};

/**
 * Calls the function and converts its return value to a DOM node.
 * Used internally by ElementCreator to process function-based children.
 *
 * @returns {Node} The DOM node returned by the function
 */
Function.prototype.toNdElement = function () {
    const child = this;
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('BeforeProcessComponent', child);
    }
    return ElementCreator.getChild(child());
};

/**
 * Converts the TemplateBinding to a hydratable DOM node for use in TemplateCloner.
 *
 * @returns {Node} Hydratable node
 */
TemplateBinding.prototype.toNdElement = function () {
    return ElementCreator.createHydratableNode(null, this);
};
