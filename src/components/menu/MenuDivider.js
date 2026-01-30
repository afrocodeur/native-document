import BaseComponent from "../BaseComponent";


export default function MenuDivider() {
    if(!this instanceof MenuDivider) {
        return new MenuDivider();
    }

}

BaseComponent.extends(MenuDivider);


MenuDivider.defaultTemplate = null;

MenuDivider.use = function(template) {
    MenuDivider.defaultTemplate = template.divider;
};

MenuDivider.prototype.$build = function() {

};