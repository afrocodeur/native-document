import ObservableItem from "@/core/data/ObservableItem";
import {toggleElementClass} from "@/core/wrappers/AttributesWrapper";
import {ObservableWhen} from "@/core/data/ObservableWhen";
import TemplateBinding from "@/core/wrappers/TemplateBinding";

ObservableItem.prototype.bindNdClass = function(element, className) {
    element.classes.toggle(className, this.val());
    this.subscribe(toggleElementClass.bind(null, element, className));
};

ObservableWhen.prototype.bindNdClass = function(element, className) {
    element.classes.toggle(className, this.isMath());
    this.subscribe(toggleElementClass.bind(null, element, className));
};

TemplateBinding.prototype.bindNdClass = function(element, className) {
    this.$hydrate(element, className);
};