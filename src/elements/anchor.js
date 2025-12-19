import Validator from "../utils/validator";
import DebugManager from "../utils/debug-manager";
import {ElementCreator} from "../wrappers/ElementCreator";


export default function Anchor(name, isUniqueChild = false) {
    const element = document.createDocumentFragment();
    element.__Anchor__ = true;

    const anchorStart = document.createComment('Anchor Start : '+name);
    const anchorEnd = document.createComment('/ Anchor End '+name);

    element.appendChild(anchorStart);
    element.appendChild(anchorEnd);

    element.nativeInsertBefore = element.insertBefore;
    element.nativeAppendChild = element.appendChild;

    const isParentUniqueChild = (parent) => (isUniqueChild || (parent.firstChild === anchorStart && parent.lastChild === anchorEnd))

    const insertBefore = function(parent, child, target) {
        const childElement = Validator.isElement(child) ? child : ElementCreator.getChild(child);
        if(parent === element) {
            parent.nativeInsertBefore(childElement, target);
            return;
        }
        if(isParentUniqueChild(parent) && target === anchorEnd) {
            parent.append(childElement,  target);
            return;
        }
        parent.insertBefore(childElement, target);
    };

    element.appendElement = function(child, before = null) {
        const parentNode = anchorStart.parentNode;
        const targetBefore = before || anchorEnd;
        if(parentNode === element) {
            parentNode.nativeInsertBefore(child, targetBefore);
            return;
        }
        parentNode?.insertBefore(child, targetBefore);
    };

    element.appendChild = function(child, before = null) {
        const parent = anchorEnd.parentNode;
        if(!parent) {
            DebugManager.error('Anchor', 'Anchor : parent not found', child);
            return;
        }
        before = before ?? anchorEnd;
        insertBefore(parent, child, before);
    };
    element.append = function(...args ) {
        return element.appendChild(args);
    }

    element.removeChildren = function() {
        const parent = anchorEnd.parentNode;
        if(parent === element) {
            return;
        }
        if(isParentUniqueChild(parent)) {
            parent.replaceChildren(anchorStart, anchorEnd);
            return;
        }

        let itemToRemove = anchorStart.nextSibling, tempItem;
        const fragment = document.createDocumentFragment();
        while(itemToRemove && itemToRemove !== anchorEnd) {
            tempItem = itemToRemove.nextSibling;
            fragment.append(itemToRemove);
            itemToRemove =  tempItem;
        }
        fragment.replaceChildren();
    }
    element.remove = function() {
        const parent = anchorEnd.parentNode;
        if(parent === element) {
            return;
        }
        let itemToRemove = anchorStart.nextSibling, tempItem;
        while(itemToRemove && itemToRemove !== anchorEnd) {
            tempItem = itemToRemove.nextSibling;
            element.nativeAppendChild(itemToRemove);
            itemToRemove = tempItem;
        }
    };

    element.removeWithAnchors = function() {
        element.removeChildren();
        anchorStart.remove();
        anchorEnd.remove();
    };

    element.replaceContent = function(child) {
        const childElement = Validator.isElement(child) ? child : ElementCreator.getChild(child);
        const parent = anchorEnd.parentNode;
        if(!parent) {
            return;
        }
        if(isParentUniqueChild(parent)) {
            parent.replaceChildren(anchorStart, childElement, anchorEnd);
            return;
        }
        element.removeChildren();
        parent.insertBefore(childElement, anchorEnd);
    };

    element.setContent = element.replaceContent;

    element.insertBefore = function(child, anchor = null) {
        element.appendChild(child, anchor);
    };


    element.endElement = function() {
        return anchorEnd;
    };

    element.startElement = function() {
        return anchorStart;
    };
    element.restore = function() {
        element.appendChild(element);
    };
    element.clear = element.remove;
    element.detach = element.remove;

    element.getByIndex = function(index) {
        let currentNode = anchorStart;
        for(let i = 0; i <= index; i++) {
            if(!currentNode.nextSibling) {
                return null;
            }
            currentNode = currentNode.nextSibling;
        }
        return currentNode !== anchorStart ? currentNode : null;
    };

    return element;
};

/**
 *
 * @param {HTMLElement|DocumentFragment|Text|String|Array} children
 * @param {{ parent?: HTMLElement, name?: String}} configs
 * @returns {DocumentFragment}
 */
export function createPortal(children, { parent, name = 'unnamed' } = {}) {
    const anchor = Anchor('Portal '+name);
    anchor.appendChild(ElementCreator.getChild(children));

    (parent || document.body).appendChild(anchor);
    return anchor;
}