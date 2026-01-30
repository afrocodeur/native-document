import {bindAttributeWithObservable, bindBooleanAttribute} from "@src/core/wrappers/AttributesWrapper";
import ObservableItem from "@src/core/data/ObservableItem";
import TemplateBinding from "@src/core/wrappers/TemplateBinding";
import {BOOLEAN_ATTRIBUTES} from "@src/core/wrappers/constants";


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
