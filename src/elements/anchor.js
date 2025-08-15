import Validator from "../utils/validator";
import DebugManager from "../utils/debug-manager";
import {createTextNode} from "../wrappers/HtmlElementWrapper";


const getChildAsNode = (child) => {
    if(Validator.isFunction(child)) {
        return getChildAsNode(child());
    }
    if(Validator.isElement(child)) {
        return child;
    }
    return createTextNode(child)
}

export default function Anchor(name) {
    const element = document.createDocumentFragment();

    const anchorStart = document.createComment('Anchor Start : '+name);
    const anchorEnd = document.createComment('/ Anchor End '+name);

    element.appendChild(anchorStart);
    element.appendChild(anchorEnd);

    element.nativeInsertBefore = element.insertBefore;
    element.nativeAppendChild = element.appendChild;

    const insertBefore = function(parent, child, target) {
        if(parent === element) {
            parent.nativeInsertBefore(getChildAsNode(child), target);
            return;
        }
        parent.insertBefore(getChildAsNode(child), target);
    };

    element.appendElement = function(child, before = null) {
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
        if(Validator.isArray(child)) {
            const fragment = document.createDocumentFragment();
            for(let i = 0, length = child.length; i < length; i++) {
                fragment.appendChild(getChildAsNode(child[i]));
            }
            insertBefore(parent, fragment, before);
            return element;
        }
        insertBefore(parent, child, before);
    };

    element.removeChildren = function() {
        const parent = anchorEnd.parentNode;
        if(parent === element) {
            return;
        }
        if(parent.firstChild === anchorStart && parent.lastChild === anchorEnd) {
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
        if(parent.firstChild === anchorStart && parent.lastChild === anchorEnd) {
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