import ObservableItem from "../../../core/data/ObservableItem";
import {toggleElementClass} from "../AttributesWrapper";
import {ObservableWhen} from "../../data/ObservableWhen";
import TemplateBinding from "../../../core/wrappers/TemplateBinding";

ObservableItem.prototype.bindNdClass = function(element, className) {
    element.classes.toggle(className, this.val());
    this.subscribe((shouldAdd) => element.classes.toggle(className, shouldAdd));
};

ObservableWhen.prototype.bindNdClass = function(element, className) {
    element.classes.toggle(className, this.isMatch());
    this.subscribe((shouldAdd) => element.classes.toggle(className, shouldAdd));
};

TemplateBinding.prototype.bindNdClass = function(element, className) {
    this.$hydrate(element, className);
};