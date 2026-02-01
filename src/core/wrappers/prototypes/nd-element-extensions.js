import ObservableItem from "../../data/ObservableItem";
import {NDElement} from "../NDElement";
import TemplateBinding from "../TemplateBinding";
import {ElementCreator} from "../ElementCreator";
import PluginsManager from "../../utils/plugins-manager";
import Validator from "../../utils/validator";

String.prototype.toNdElement = function () {
    const formattedChild = this.resolveObservableTemplate ? this.resolveObservableTemplate() : this;
    if(Validator.isString(formattedChild)) {
        return ElementCreator.createStaticTextNode(null, formattedChild);
    }
    return ElementCreator.getChild(null, formattedChild);
};

Element.prototype.toNdElement = function () {
    return this;
};
Text.prototype.toNdElement = function () {
    return this;
};
Comment.prototype.toNdElement = function () {
    return this;
};
Document.prototype.toNdElement = function () {
    return this;
};
DocumentFragment.prototype.toNdElement = function () {
    return this;
};

ObservableItem.prototype.toNdElement = function () {
    return ElementCreator.createObservableNode(null, this);
};

NDElement.prototype.toNdElement = function () {
    return this.$element ?? this.$build?.() ?? this.build?.() ?? null;
};

Array.prototype.toNdElement = function () {
    const fragment = document.createDocumentFragment();
    for(let i = 0, length = this.length; i < length; i++) {
        const child = ElementCreator.getChild(this[i]);
        if(child === null) continue;
        fragment.appendChild(child);
    }
    return fragment;
};

Function.prototype.toNdElement = function () {
    const child = this;
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('BeforeProcessComponent', child);
    }
    return ElementCreator.getChild(child());
};

TemplateBinding.prototype.toNdElement = function () {
    return ElementCreator.createHydratableNode(null, this);
};
