import Validator from '../../utils/validator';
import {ElementCreator} from '../../wrappers/ElementCreator';
import AnchorWithSentinel from './anchor-with-sentinel';
import oneChildAnchorOverwriting from './one-child-anchor-overwriting';

/**
 * Creates an anchor fragment — a managed DocumentFragment delimited by comment sentinels.
 * Used internally by ForEach, ShowIf, Switch, Match and other control-flow directives
 * to manage dynamic DOM regions without a real container element.
 *
 * @param {string} name - Debug name for the anchor (visible as HTML comments in the DOM)
 * @param {boolean} [isUniqueChild=false] - If true, optimises rendering when this anchor is the only child of its parent
 * @returns {AnchorDocumentFragment} An augmented DocumentFragment with anchor management methods
 */
export default function Anchor(name, isUniqueChild = false) {
    const anchorFragment = new AnchorWithSentinel(name);

    anchorFragment.onConnectedOnce((parent) => {
        if(isUniqueChild) {
            oneChildAnchorOverwriting(anchorFragment, parent);
        }
    });

    anchorFragment.__Anchor__ = true;

    const anchorStart = anchorFragment.$start;
    const anchorEnd = anchorFragment.$end;

    anchorFragment.nativeInsertBefore = anchorFragment.insertBefore;
    anchorFragment.nativeAppendChild = anchorFragment.appendChild;
    anchorFragment.nativeAppend = anchorFragment.append;

    const isParentUniqueChild = isUniqueChild
        ? () => true: (parent) => (parent.firstChild === anchorStart && parent.lastChild === anchorEnd);

    const insertBefore = (parent, child, target) => {
        const childElement = Validator.isElement(child) ? child : ElementCreator.getChild(child);
        insertBeforeRaw(parent, childElement, target);
    };

    const insertBeforeRaw = (parent, child, target) => {
        if(parent === anchorFragment) {
            parent.nativeInsertBefore(child, target);
            return;
        }
        if(isParentUniqueChild(parent) && target === anchorEnd) {
            parent.append(child,  target);
            return;
        }
        parent.insertBefore(child, target);
    };

    anchorFragment.appendElement = function(child) {
        const parentNode = anchorStart.parentNode;
        if(parentNode === anchorFragment) {
            parentNode.nativeInsertBefore(child, anchorEnd);
            return;
        }
        parentNode.insertBefore(child, anchorEnd);
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

    anchorFragment.appendChildRaw = function(child, before = null) {
        const parent = anchorEnd.parentNode;
        if(!parent) {
            DebugManager.error('Anchor', 'Anchor : parent not found', child);
            return;
        }
        before = before ?? anchorEnd;
        insertBeforeRaw(parent, child, before);
    };

    anchorFragment.getParent = () => anchorEnd.parentNode;
    anchorFragment.append = anchorFragment.appendChild;
    anchorFragment.appendRaw = anchorFragment.appendChildRaw;

    anchorFragment.insertAtStart = function(child) {
        child = Validator.isElement(child) ? child : ElementCreator.getChild(child);
        anchorFragment.insertAtStartRaw(child);
    };

    anchorFragment.insertAtStartRaw = function(child) {
        const parentNode = anchorStart.parentNode;
        if(parentNode === anchorFragment) {
            parentNode.nativeInsertBefore(child, anchorStart);
            return;
        }
        parentNode.insertBefore(child, anchorStart.nextSibling);
    };

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
        while(itemToRemove && itemToRemove !== anchorEnd) {
            tempItem = itemToRemove.nextSibling;
            itemToRemove.remove();
            itemToRemove =  tempItem;
        }
    };

    anchorFragment.remove = function() {
        const parent = anchorEnd.parentNode;
        if(parent === anchorFragment) {
            return;
        }
        if(isParentUniqueChild(parent)) {
            anchorFragment.nativeAppend.apply(anchorFragment, parent.childNodes);
            parent.replaceChildren(anchorStart, anchorEnd);
            return;
        }
        let itemToRemove = anchorStart.nextSibling, tempItem;
        while(itemToRemove && itemToRemove !== anchorEnd) {
            tempItem = itemToRemove.nextSibling;
            anchorFragment.nativeAppend(itemToRemove);
            itemToRemove = tempItem;
        }
    };

    anchorFragment.removeWithAnchors = function() {
        anchorFragment.removeChildren();
        anchorStart.remove();
        anchorEnd.remove();
    };
    anchorFragment.delete = anchorFragment.removeWithAnchors;

    anchorFragment.replaceContent = function(child) {
        const childElement = Validator.isElement(child) ? child : ElementCreator.getChild(child);
        anchorFragment.replaceContentRaw(childElement);
    };

    anchorFragment.replaceContentRaw = function(child) {
        const parent = anchorEnd.parentNode;
        if(!parent) {
            return;
        }
        if(isParentUniqueChild(parent)) {
            parent.replaceChildren(anchorStart, child, anchorEnd);
            return;
        }
        anchorFragment.removeChildren();
        parent.insertBefore(child, anchorEnd);
    };

    anchorFragment.setContent = anchorFragment.replaceContent;
    anchorFragment.setContentRaw = anchorFragment.replaceContentRaw;

    anchorFragment.insertBefore = anchorFragment.appendChild;
    anchorFragment.insertBeforeRaw = anchorFragment.appendChildRaw;

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

DocumentFragment.prototype.setAttribute = () => {};