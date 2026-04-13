import {
    bindAttributeWithObservable,
    bindBooleanAttribute
} from "../AttributesWrapper";
import ObservableItem from "../../data/ObservableItem";
import TemplateBinding from "../TemplateBinding";
import {BOOLEAN_ATTRIBUTES} from "../constants";
import ObservableChecker from "../../data/ObservableChecker";


ObservableItem.prototype.handleNdAttribute = function(element, attributeName) {
    if(BOOLEAN_ATTRIBUTES.has(attributeName)) {
        bindBooleanAttribute(element, attributeName, this);
        return;
    }

    bindAttributeWithObservable(element, attributeName, this);
};

ObservableChecker.prototype.handleNdAttribute = ObservableItem.prototype.handleNdAttribute;

    TemplateBinding.prototype.handleNdAttribute = function(element, attributeName) {
    this.$hydrate(element, attributeName);
};
