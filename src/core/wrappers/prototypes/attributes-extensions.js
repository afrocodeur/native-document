import {bindAttributeWithObservable, bindBooleanAttribute} from "../AttributesWrapper";
import ObservableItem from "../../data/ObservableItem";
import TemplateBinding from "../TemplateBinding";
import {BOOLEAN_ATTRIBUTES} from "../constants";


String.prototype.handleNdAttribute = function(element, attributeName) {
    element.setAttribute(attributeName, this);
};

Number.prototype.handleNdAttribute = function(element, attributeName) {
    element.setAttribute(attributeName, this);
};

Boolean.prototype.handleNdAttribute = function(element, attrName) {
    bindBooleanAttribute(element, attrName, this);
};

ObservableItem.prototype.handleNdAttribute = function(element, attributeName) {
    if(BOOLEAN_ATTRIBUTES.has(attributeName)) {
        bindBooleanAttribute(element, attributeName, this);
        return;
    }

    bindAttributeWithObservable(element, attributeName, this);
};

TemplateBinding.prototype.handleNdAttribute = function(element, attributeName) {
    this.$hydrate(element, attributeName);
};
