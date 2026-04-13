import BaseComponent from "../BaseComponent";


export default function MenuDivider(props = {}) {
    if(!(this instanceof MenuDivider)) {
        return new MenuDivider(props);
    }

    this.$description = {
        props
    };
}

BaseComponent.extends(MenuDivider);


MenuDivider.defaultTemplate = null;

MenuDivider.use = function(template) {
    MenuDivider.defaultTemplate = template;
};