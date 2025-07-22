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
    return createTextNode(String(child))
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

    element.appendChild = function(child, before = null) {
        const parent = anchorEnd.parentNode;
        if(!parent) {
            DebugManager.error('Anchor', 'Anchor : parent not found', child);
            return;
        }
        before = before ?? anchorEnd;
        if(Validator.isArray(child)) {
            child.forEach((element) => {
                insertBefore(parent, element, before);
            });
            return element;
        }
        insertBefore(parent, child, before);
    };

    element.remove = function(trueRemove) {
        if(anchorEnd.parentNode === element) {
            return;
        }
        let itemToRemove = anchorStart.nextSibling, tempItem;
        while(itemToRemove !== anchorEnd) {
            tempItem = itemToRemove.nextSibling;
            trueRemove ? itemToRemove.remove() : element.nativeAppendChild(itemToRemove);
            itemToRemove = tempItem;
        }
        if(trueRemove) {
            anchorEnd.remove();
            anchorStart.remove();
        }
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