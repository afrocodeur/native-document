import Validator from "../utils/validator";
import DebugManager from "../utils/debug-manager";
import {ElementCreator} from "../wrappers/ElementCreator";


export default function Anchor(name, isUniqueChild = false) {
    const anchorFragment = document.createDocumentFragment();
    anchorFragment.__Anchor__ = true;

    const anchorStart = document.createComment('Anchor Start : '+name);
    const anchorEnd = document.createComment('/ Anchor End '+name);

    anchorFragment.appendChild(anchorStart);
    anchorFragment.appendChild(anchorEnd);

    anchorFragment.nativeInsertBefore = anchorFragment.insertBefore;
    anchorFragment.nativeAppendChild = anchorFragment.appendChild;

    const isParentUniqueChild = (parent) => (isUniqueChild || (parent.firstChild === anchorStart && parent.lastChild === anchorEnd))

    const insertBefore = function(parent, child, target) {
        const childElement = Validator.isElement(child) ? child : ElementCreator.getChild(child);
        if(parent === anchorFragment) {
            parent.nativeInsertBefore(childElement, target);
            return;
        }
        if(isParentUniqueChild(parent) && target === anchorEnd) {
            parent.append(childElement,  target);
            return;
        }
        parent.insertBefore(childElement, target);
    };

    anchorFragment.appendElement = function(child, before = null) {
        const parentNode = anchorStart.parentNode;
        const targetBefore = before || anchorEnd;
        if(parentNode === anchorFragment) {
            parentNode.nativeInsertBefore(child, targetBefore);
            return;
        }
        parentNode?.insertBefore(child, targetBefore);
    };

    anchorFragment.appendChild = function(child, before = null) {
        const parent = anchorEnd.parentNode;
        if(!parent) {
            DebugManager.error('Anchor', 'Anchor : parent not found', child);
            return;
        }
        before = before ?? anchorEnd;
        insertBefore(parent, child, before);
    };
    anchorFragment.append = function(...args ) {
        return anchorFragment.appendChild(args);
    }

    anchorFragment.removeChildren = function() {
        const parent = anchorEnd.parentNode;
        if(parent === anchorFragment) {
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
    anchorFragment.remove = function() {
        const parent = anchorEnd.parentNode;
        if(parent === anchorFragment) {
            return;
        }
        let itemToRemove = anchorStart.nextSibling, tempItem;
        while(itemToRemove && itemToRemove !== anchorEnd) {
            tempItem = itemToRemove.nextSibling;
            anchorFragment.nativeAppendChild(itemToRemove);
            itemToRemove = tempItem;
        }
    };

    anchorFragment.removeWithAnchors = function() {
        anchorFragment.removeChildren();
        anchorStart.remove();
        anchorEnd.remove();
    };

    anchorFragment.replaceContent = function(child) {
        const childElement = Validator.isElement(child) ? child : ElementCreator.getChild(child);
        const parent = anchorEnd.parentNode;
        if(!parent) {
            return;
        }
        if(isParentUniqueChild(parent)) {
            parent.replaceChildren(anchorStart, childElement, anchorEnd);
            return;
        }
        anchorFragment.removeChildren();
        parent.insertBefore(childElement, anchorEnd);
    };

    anchorFragment.setContent = anchorFragment.replaceContent;

    anchorFragment.insertBefore = function(child, anchor = null) {
        anchorFragment.appendChild(child, anchor);
    };


    anchorFragment.endElement = function() {
        return anchorEnd;
    };

    anchorFragment.startElement = function() {
        return anchorStart;
    };
    anchorFragment.restore = function() {
        anchorFragment.appendChild(anchorFragment);
    };
    anchorFragment.clear = anchorFragment.remove;
    anchorFragment.detach = anchorFragment.remove;

    anchorFragment.getByIndex = function(index) {
        let currentNode = anchorStart;
        for(let i = 0; i <= index; i++) {
            if(!currentNode.nextSibling) {
                return null;
            }
            currentNode = currentNode.nextSibling;
        }
        return currentNode !== anchorStart ? currentNode : null;
    };

    return anchorFragment;
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

DocumentFragment.prototype.setAttribute = () => {}