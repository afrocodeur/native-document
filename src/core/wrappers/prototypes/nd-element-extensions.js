import ObservableItem from '../../data/ObservableItem';
import { NDElement } from '../NDElement';
import TemplateBinding from '../TemplateBinding';
import { ElementCreator } from '../ElementCreator';
import PluginsManager from '../../utils/plugins-manager';
import ObservableChecker from '../../data/ObservableChecker';
import MemoryManager from '../../data/MemoryManager';



const OBS_PATTERN = /({{obs:\d+}})/;
const OBS_ID_PATTERN = /\d+/;


/**
 * Parses a string containing Observable placeholders and returns an array
 * of strings and Observable instances.
 *
 * Placeholders are generated automatically when an ObservableItem is interpolated
 * in a template string via its toString() method.
 *
 * @returns {Array<string|ObservableItem>} Mixed array of static strings and resolved Observables
 * @example
 * const name = Observable('John');
 * const count = Observable(5);
 *
 * `Hello ${name}, count: ${count}`.toNdChildren()
 * // → ['Hello ', ObservableItem(John), ', count: ', ObservableItem(5)]
 */
Object.defineProperty(String.prototype, 'toNdChildren', {
    value: function() {
        return this.split(OBS_PATTERN).filter(Boolean).map((item) => {
            if(OBS_PATTERN.test(item)) {
                const id = item.match(OBS_ID_PATTERN)[0];
                return MemoryManager.getObservableById(Number(id));
            }
            return item;
        });
    },
    writable: true,
    configurable: true,
    enumerable: false,
});

/**
 * Registers a non-enumerable toNdElement method on a prototype.
 *
 * @param {object} target - The prototype to extend
 * @param {Function} fn - The toNdElement implementation
 */
const defineToNdElement = (target, fn) => {
    Object.defineProperty(target, 'toNdElement', {
        value: fn,
        writable: true,
        configurable: true,
        enumerable: false,
    });
};

/**
 * Marks a prototype as a valid NativeDocument child node.
 *
 * @param {object} target - The prototype to mark
 */
const defineValidNdChild = (target) => {
    Object.defineProperty(target, '__$isValidNdChild', {
        value: true,
        writable: true,
        configurable: true,
        enumerable: false,
    });
};

/**
 * Marks a prototype as a native DOM node.
 * Faster alternative to instanceof Node for hot paths.
 *
 * @param {object} target - The prototype to mark
 */
const defineNativeNode = (target) => {
    Object.defineProperty(target, '__$isNativeNode', {
        value: true,
        writable: true,
        configurable: true,
        enumerable: false,
    });
};

NDElement.$getChild = ElementCreator.getChild;

// -- __$isNativeNode ----------------------------------------------------------

defineNativeNode(Element.prototype);
defineNativeNode(Text.prototype);
defineNativeNode(Comment.prototype);
defineNativeNode(Document.prototype);
defineNativeNode(DocumentFragment.prototype);

// -- __$isValidNdChild --------------------------------------------------------

defineValidNdChild(String.prototype);
defineValidNdChild(Number.prototype);
defineValidNdChild(Boolean.prototype);
defineValidNdChild(Array.prototype);
defineValidNdChild(Element.prototype);
defineValidNdChild(Text.prototype);
defineValidNdChild(Comment.prototype);
defineValidNdChild(DocumentFragment.prototype);
defineValidNdChild(NDElement.prototype);
defineValidNdChild(ObservableItem.prototype);
defineValidNdChild(ObservableChecker.prototype);
defineValidNdChild(TemplateBinding.prototype);
defineValidNdChild(Function.prototype);

// -- toNdElement --------------------------------------------------------------

/**
 * Converts a string to a static text node.
 *
 * @returns {Text}
 */
defineToNdElement(String.prototype, function () {
    return ElementCreator.createStaticTextNodeWithoutParent(this);
});

/**
 * Converts a number to a static text node.
 *
 * @returns {Text}
 */
defineToNdElement(Number.prototype, function () {
    return ElementCreator.createStaticTextNodeWithoutParent(this.toString());
});

/**
 * Returns the DOM node itself (identity).
 *
 * @returns {Element|Text|Comment|Document|DocumentFragment}
 */
defineToNdElement(Element.prototype, function () { return this; });
defineToNdElement(Text.prototype, function () { return this; });
defineToNdElement(Comment.prototype, function () { return this; });
defineToNdElement(Document.prototype, function () { return this; });
defineToNdElement(DocumentFragment.prototype, function () { return this; });

/**
 * Converts an ObservableItem to a reactive text node that updates when the value changes.
 *
 * @returns {Text}
 */
defineToNdElement(ObservableItem.prototype, function () {
    return ElementCreator.createObservableNodeWithoutParent(this);
});

ObservableChecker.prototype.toNdElement = ObservableItem.prototype.toNdElement;

/**
 * Returns the underlying HTMLElement of this NDElement.
 *
 * @returns {HTMLElement|DocumentFragment}
 */
defineToNdElement(NDElement.prototype, function () {
    return this.$element;
});

/**
 * Converts the array to a DocumentFragment containing all child elements.
 *
 * @returns {DocumentFragment}
 */
defineToNdElement(Array.prototype, function () {
    const fragment = document.createDocumentFragment();
    for(let i = 0, length = this.length; i < length; i++) {
        const child = ElementCreator.getChild(this[i]);
        if(child === null) continue;
        fragment.appendChild(child);
    }
    return fragment;
});

/**
 * Calls the function and converts its return value to a DOM node.
 *
 * @returns {Node}
 */
defineToNdElement(Function.prototype, function () {
    const child = this;
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('BeforeProcessComponent', child);
    }
    return ElementCreator.getChild(child());
});

/**
 * Converts the TemplateBinding to a hydratable DOM node.
 *
 * @returns {Node}
 */
defineToNdElement(TemplateBinding.prototype, function () {
    return ElementCreator.createHydratableNode(null, this);
});