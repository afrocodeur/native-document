import BaseComponent from "../BaseComponent";
import HasItems from "../$traits/has-items/HasItems";
import MenuDivider from "./MenuDivider";
import MenuGroup from "./MenuGroup";
import HasMenuItem from "./HasMenuItem";
import { $ } from '../../core/data/Observable';
import HasEventEmitter from "../../core/utils/HasEventEmitter";

const EMPTY_PROPS = {}

export default function MenuItem(props = {}) {
    if(!(this instanceof MenuItem)) {
        return new MenuItem(props || EMPTY_PROPS);
    }

    BaseComponent.call(this, props || EMPTY_PROPS);

    this.$description = {
        items: $.array(),
        key: null,
        action: null,
        label: null,
        icon: null,
        shortcut: null,
        disabled: null,
        selected: null,
        value: null,
        data: null,
        render: null,
        trailing: null,
        visibility: null,
        props
    };

}

MenuItem.defaultTemplate = null;

MenuItem.use = function(template) {
    MenuItem.defaultTemplate = template;
};

BaseComponent.extends(MenuItem);
BaseComponent.use(MenuItem, HasItems, HasEventEmitter, HasMenuItem);

HasMenuItem.components.MenuItem = MenuItem;


MenuItem.prototype.label = function(label) {
    this.$description.label = label;
    return this;
};

MenuItem.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

MenuItem.prototype.trailing = function(trailing) {
    this.$description.trailing = trailing;
    return this;
};

MenuItem.prototype.shortcut = function(shortcut) {
    this.$description.shortcut = shortcut;
    return this;
};

MenuItem.prototype.disabled = function(disabled = true) {
    this.$description.disabled = BaseComponent.obs(disabled);
    return this;
};

MenuItem.prototype.selected = function(selected = true) {
    this.$description.selected = BaseComponent.obs(selected);
    return this;
};

MenuItem.prototype.value = function(value) {
    this.$description.value = value;
    return this;
};

MenuItem.prototype.action = function(action) {
    this.$description.action = action;
    return this;
};

MenuItem.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

MenuItem.prototype.divider = function() {
    return this.item(new MenuDivider());
};

MenuItem.prototype.key = function(key) {
    this.$description.key = key;
    return this;
};

MenuItem.prototype.visibility = function(mode) {
    this.$description.visibility = BaseComponent.obs(mode);
    return this;
};