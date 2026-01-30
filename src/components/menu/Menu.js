import BaseComponent from "../BaseComponent";
import EventEmitter from "../../../src/core/utils/EventEmitter";
import HasItems from "../$traits/HasItems";
import MenuDivider from "./MenuDivider";
import MenuGroup from "./MenuGroup";

export default function Menu(config = {}) {

    if(!(this instanceof Menu)) {
        return new Menu(config)
    }

    this.$description = {
        items: [],
        render: null,
        orientation: 'horizontal',
        closeOnSelect: true,
        keyboardLoop: true,
        ...config
    };

}

BaseComponent.extends(Menu, HasItems, EventEmitter);

Menu.defaultTemplate = null;

Menu.use = function(template) {
    Menu.defaultTemplate = template.menu;
};

Menu.prototype.orientation = function(orientation) {
    this.$description.orientation = orientation;
    return this;
};

Menu.prototype.horizontal = function() {
    this.$description.orientation = 'horizontal';
    return this;
};

Menu.prototype.vertical = function() {
    this.$description.orientation = 'vertical';
    return this;
};

Menu.prototype.closeOnSelect = function(close = true) {
    this.$description.closeOnSelect = close;
    return this;
};

Menu.prototype.keyboardLoop = function(keyboardLoop = true) {
    this.$description.keyboardLoop = keyboardLoop;
    return this;
};

Menu.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

Menu.prototype.onItemClick = function(handler) {
    this.on('itemClick', handler);
    return this;
};

Menu.prototype.onItemSelect = function(handler) {
    this.on('itemSelect', handler);
    return this;
};



Menu.prototype.divider = function() {
    return this.item(new MenuDivider());
};

Menu.prototype.group = function(label, builder) {
    const group = new MenuGroup(label);
    builder && builder(group);
    return this.item(group);
};