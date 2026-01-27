import BaseComponent from "@components/BaseComponent";


export default function DropdownItem(config = {}) {
    if(!(this instanceof DropdownItem)) {
        return new DropdownItem(config);
    }
    this.$description = {
        icon: null,
        content: null,
        shortcuts: null,
        value: null,
        disabled: false,
        data: null,
        render: null,
        ...config
    };
};

BaseComponent.extends(DropdownItem);

DropdownItem.prototype.value = function(value) {
    this.$description.value = value;
    return this;
};

DropdownItem.prototype.getValue = function() {
    return this.$description.value;
};

DropdownItem.prototype.disabled = function(disabled = true) {
    this.$description.disabled = disabled;
    return this;
};

DropdownItem.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

DropdownItem.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

DropdownItem.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

DropdownItem.prototype.getData = function() {
    return this.$description.data;
};

DropdownItem.prototype.shortcuts = function(shortcuts) {
    this.$description.shortcuts = shortcuts;
    return this;
};

DropdownItem.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};

DropdownItem.prototype.$build = function() {

};

DropdownItem.prototype.toNdElement = function() {

};