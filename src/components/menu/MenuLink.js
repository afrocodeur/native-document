import MenuItem from "./MenuItem";
import HasMenuItem from "./HasMenuItem";


export default function MenuLink(props = {}) {
    if(!(this instanceof MenuLink)) {
        return new MenuLink(props);
    }
    MenuItem.call(this, props);
}

MenuLink.prototype = Object.create(MenuItem.prototype);
MenuLink.prototype.constructor = MenuLink;

HasMenuItem.components.MenuLink = MenuLink;

MenuLink.defaultTemplate = null;

MenuLink.use = function(template) {
    MenuLink.defaultTemplate = template;
};

MenuLink.prototype.target = function (target) {
    this.$description.target = target;
    return this;
};