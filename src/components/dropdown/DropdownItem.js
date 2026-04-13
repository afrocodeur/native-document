import BaseComponent from "../BaseComponent";


export default function DropdownItem(props = {}) {
    if(!(this instanceof DropdownItem)) {
        return new DropdownItem(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        icon: null,
        content: null,
        shortcut: null,
        value: null,
        disabled: false,
        selected: false,
        data: null,
        render: null,
        renderContent: null,
        props
    };
};

BaseComponent.extends(DropdownItem);

DropdownItem.defaultTemplate = null;
DropdownItem.use = function(template) {
    DropdownItem.defaultTemplate = template;
};

DropdownItem.prototype.value = function(value) {
    this.$description.value = value;
    return this;
};

DropdownItem.prototype.getValue = function() {
    return this.$description.value;
};

DropdownItem.prototype.disabled = function(disabled = true) {
    this.$description.disabled = BaseComponent.obs(disabled);
    return this;
};

DropdownItem.prototype.selected = function(selected = true) {
    this.$description.selected = BaseComponent.obs(selected);
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

DropdownItem.prototype.shortcut = function(shortcut) {
    this.$description.shortcut = shortcut;
    return this;
};
DropdownItem.prototype.renderContent = function(callback) {
    this.$description.renderContent = callback;
    return this;
};
