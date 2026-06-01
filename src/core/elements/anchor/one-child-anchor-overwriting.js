import Validator from '../../utils/validator';
import {ElementCreator} from '../../wrappers/ElementCreator';


export default function oneChildAnchorOverwriting(anchor, parent) {

    anchor.remove = () => {
        anchor.append.apply(anchor, parent.childNodes);
    };
    anchor.getParent = () => parent;

    anchor.appendChild = (child) => {
        child = Validator.isElement(child) ? child : ElementCreator.getChild(child);
        parent.appendChild(child);
    };

    anchor.appendChildRaw = parent.appendChild.bind(parent);
    anchor.append = anchor.appendChild;
    anchor.appendRaw = anchor.appendChildRaw;

    anchor.insertAtStart = (child) => {
        child = Validator.isElement(child) ? child : ElementCreator.getChild(child);
        parent.firstChild ? parent.insertBefore(child, parent.firstChild) : parent.appendChild(child);
    };
    anchor.insertAtStartRaw = (child) => {
        parent.firstChild ? parent.insertBefore(child, parent.firstChild) : parent.appendChild(child);
    };

    anchor.appendElement = anchor.appendChild;

    anchor.removeChildren = () => {
        parent.textContent = '';
    };

    anchor.replaceContent = function(content) {
        const child = Validator.isElement(content) ? content : ElementCreator.getChild(content);
        parent.replaceChildren(child);
    };

    anchor.replaceContentRaw = function(child) {
        parent.replaceChildren(child);
    };
    anchor.setContent = anchor.replaceContent;

    anchor.insertBefore = (child, anchor) => {
        child = Validator.isElement(child) ? child : ElementCreator.getChild(child);
        parent.insertBefore(child, anchor);
    };
    anchor.insertBeforeRaw = (child, anchor) => {
        parent.insertBefore(child, anchor);
    };

    anchor.appendChildBefore = anchor.insertBefore;
    anchor.appendChildBeforeRaw = anchor.insertBeforeRaw;

    anchor.clear = anchor.remove;
    anchor.detach = anchor.remove;

    anchor.replaceChildren = function() {
        parent.replaceChildren(...arguments);
    };

    anchor.getByIndex = (index) => {
        return parent.childNodes[index];
    };
}