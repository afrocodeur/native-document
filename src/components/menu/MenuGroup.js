import BaseComponent from "../BaseComponent";
import HasItems from "../$traits/has-items/HasItems";
import MenuDivider from "./MenuDivider";
import HasMenuItem from "./HasMenuItem";
import { $ } from '../../core/data/Observable';


export default function MenuGroup(label, props = {}) {
    if(!(this instanceof MenuGroup)) {
        return new MenuGroup(label, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        icon: null,
        label,
        data: null,
        items: $.array(),
        render: null,
        collapsable: false,
        collapsed: null,
        visibility: $(true),
        collapsableOpenedIcon: null,
        collapsableClosedIcon: null,
        props
    };
}

HasMenuItem.components.MenuGroup = MenuGroup;

MenuGroup.defaultTemplate = null;

MenuGroup.use = function(template) {
    MenuGroup.defaultTemplate = template;
};

BaseComponent.extends(MenuGroup);
BaseComponent.use(MenuGroup, HasItems, HasMenuItem);

MenuGroup.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

MenuGroup.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

MenuGroup.prototype.collapsable = function(mode = true, openedIcon, closedIcon) {
    this.$description.collapsable = mode;
    this.$description.collapsed = this.$description.collapsed || $(true);
    this.$description.collapsableOpenedIcon = openedIcon;
    this.$description.collapsableClosedIcon = closedIcon;
    return this;
};

MenuGroup.prototype.collapsed = function(mode = true) {
    this.$description.collapsed.set(mode);
    return this;
};

MenuGroup.prototype.divider = function() {
    return this.item(new MenuDivider());
};

MenuGroup.prototype.visibility = function(mode) {
    this.$description.visibility = BaseComponent.obs(mode);
    return this;
};