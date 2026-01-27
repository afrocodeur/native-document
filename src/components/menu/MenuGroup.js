import BaseComponent from "@components/BaseComponent";
import HasItems from "@components/$traits/HasItems";
import MenuDivider from "./MenuDivider";


export default function MenuGroup(label, config) {
    if(!(this instanceof MenuGroup)) {
        return new MenuGroup(label, config);
    }

    this.$description = {
        label,
        data: null,
        items: [],
        render: null,
        ...config
    }
}

MenuGroup.defaultTemplate = null;

MenuGroup.use = function(template) {
    MenuGroup.defaultTemplate = template.menuGroup;
};

BaseComponent.extends(MenuGroup, HasItems);

MenuGroup.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};


MenuGroup.prototype.divider = function() {
    return this.item(new MenuDivider());
};

MenuGroup.prototype.group = function(label, builder) {
    const group = new MenuGroup(label);
    builder && builder(group);
    return this.item(group);
};