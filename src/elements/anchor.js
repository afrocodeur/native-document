import Validator from "../utils/validator";
import DebugManager from "../utils/debug-manager";
import {ElementCreator} from "../wrappers/ElementCreator";


export default function Anchor(name, isUniqueChild = false) {
    const element = document.createDocumentFragment();

    const anchorStart = document.createComment('Anchor Start : '+name);
    const anchorEnd = document.createComment('/ Anchor End '+name);

    element.appendChild(anchorStart);
    element.appendChild(anchorEnd);

    element.nativeInsertBefore = element.insertBefore;
    element.nativeAppendChild = element.appendChild;

    const isParentUniqueChild = (parent) => (isUniqueChild || (parent.firstChild === anchorStart && parent.lastChild === anchorEnd))

    const insertBefore = function(parent, child, target) {
        const element = Validator.isElement(child) ? child : ElementCreator.getChild(child);
        if(parent === element) {
            parent.nativeInsertBefore(element, target);
            return;
        }
        if(isParentUniqueChild(parent) && target === anchorEnd) {
            parent.append(element,  target);
            return;
        }
        parent.insertBefore(element, target);
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
        if(isParentUniqueChild(parent)) {
            parent.replaceChildren(anchorStart, anchorEnd);
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
        const parent = anchorEnd.parentNode;
        if(!parent) {
            return;
        }
        if(isParentUniqueChild(parent)) {
            parent.replaceChildren(anchorStart, child, anchorEnd);
            return;
        }
        element.removeChildren();
        parent.insertBefore(child, anchorEnd);
    };

    element.insertBefore = function(child, anchor = null) {
        element.appendChild(child, anchor);
    };

    element.clear = function() {
        element.remove();
    };

    element.endElement = function() {
        return anchorEnd;
    };

    element.startElement = function() {
        return anchorStart;
    };

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