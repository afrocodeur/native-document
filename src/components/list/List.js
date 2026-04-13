
import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import HasItems from "../$traits/has-items/HasItems";
import Dropdown from "../dropdown/Dropdown";

export default function List(config = {}) {
    if(!(this instanceof List)) {
        return new List(config);
    }

    this.$description = {
        selectable: false,
        multiSelect: false,
        selectedValues: null,
        inset: false,
        divider: false,
        data: null,
        render: null,
        selectByCheckbox: false,
        selectByClick: false,
        loopOnKeyboard: true,
        ...config
    };

}

List.defaultTemplate = null;

List.use = function(template) {
    List.defaultTemplate = template.list;
};

BaseComponent.extends(List);
BaseComponent.use(List, HasItems, HasEventEmitter);

List.defaultTemplate = null;

List.use = function(template) {
    List.defaultTemplate = template.list;
};

List.prototype.selectable = function(selectable = true) {
    this.$description.selectable = selectable;
    return this;
};

List.prototype.selectByClick = function() {
    this.$description.selectByClick = true;
    this.$description.selectByCheckbox = false;
};
List.prototype.selectByCheckbox = function() {
    this.$description.selectByClick = false;
    this.$description.selectByCheckbox = true;
};

List.prototype.multiSelect = function(multi = true) {
    this.$description.multiSelect = multi;
    this.$description.selectable = true;
    return this;
};

List.prototype.selectedValuesModel = function(observable) {
    this.$description.selectedValues = observable;
    return this;
};

List.prototype.inset = function(inset = true) {
    this.$description.inset = inset;
    return this;
};

Dropdown.prototype.next = function() {

};

Dropdown.prototype.preview = function() {

};
Dropdown.prototype.loopOnKeyboard = function(loopOnKeyboard) {
    this.$description.loopOnKeyboard = loopOnKeyboard;
    return this;
};

List.prototype.withDivider = function(divider = true) {
    this.$description.divider = divider;
    return this;
};

List.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

List.prototype.onItemClick = function(handler) {
    this.on('itemClick', handler);
    return this;
};

List.prototype.onItemSelect = function(handler) {
    this.on('itemSelect', handler);
    return this;
};

List.prototype.$build = function() {

};