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

    const isParentUniqueChild = (parent) => {
        console.log('on passwr ici ', isUniqueChild || (parent.firstChild === anchorStart && parent.lastChild === anchorEnd))
        return isUniqueChild || (parent.firstChild === anchorStart && parent.lastChild === anchorEnd);
    };

    const insertBefore = function(parent, child, target) {
        const element = Validator.isElement(child) ? child : ElementCreator.getChild(child);
        if(parent === element) {
            parent.nativeInsertBefore(element, target);
            return;
        }
        if(isParentUniqueChild(parent)) {
            parent.append(element,  anchorEnd);
            return;
        }
        parent.insertBefore(element, target);
    };

    element.appendElement = function(child, before = null) {
        if(isParentUniqueChild(anchorEnd.parentNode)) {
            (before && before !== anchorEnd)
                ? anchorEnd.parentNode.insertBefore(child, anchorEnd)
                : anchorEnd.parentNode.append(child, anchorEnd);
            return;
        }
        if(anchorEnd.parentNode === element) {
            anchorEnd.parentNode.nativeInsertBefore(child, before || anchorEnd);
            return;
        }
        anchorEnd.parentNode?.insertBefore(child, before || anchorEnd);
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
            parent.replaceChildren(anchorEnd, anchorEnd);
            return;
        }
        let itemToRemove = anchorStart.nextSibling, tempItem;
        while(itemToRemove !== anchorEnd) {
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

    return element;
};