import BaseComponent from "../BaseComponent";
import HasItems from "../$traits/HasItems";
import MenuDivider from "./MenuDivider";
import MenuGroup from "./MenuGroup";


export default function MenuItem(config = {}) {
    if(!(this instanceof MenuItem)) {
        return new MenuItem(config);
    }

    this.$description = {
        items: [],
        ...config
    };

}

MenuItem.defaultTemplate = null;

MenuItem.use = function(template) {
    MenuItem.defaultTemplate = template.menuItem;
};

BaseComponent.extends(MenuItem, HasItems);


MenuItem.prototype.label = function(label) {
    this.$description.label = label;
    return this;
};

MenuItem.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

MenuItem.prototype.shortcut = function(shortcut) {
    this.$description.shortcut = shortcut;
    return this;
};

MenuItem.prototype.disabled = function(disabled = true) {
    this.$description.disabled = disabled;
    return this;
};

MenuItem.prototype.selected = function(selected = true) {
    this.$description.selected = selected;
    return this;
};

MenuItem.prototype.value = function(value) {
    this.$description.value = value;
    return this;
};

MenuItem.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

MenuItem.prototype.divider = function() {
    return this.item(new MenuDivider());
};

MenuItem.prototype.group = function(label, builder) {
    const group = new MenuGroup(label);
    builder && builder(group);
    return this.item(group);
};