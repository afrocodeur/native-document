import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import HasItems from "../$traits/has-items/HasItems";
import MenuGroup from "./MenuGroup";
import HasMenuItem from "./HasMenuItem";
import { $ } from '../../core/data/Observable'

export default function Menu(props = {}) {

    if(!(this instanceof Menu)) {
        return new Menu(props)
    }

    BaseComponent.call(this, props);

    this.$description = {
        items: $.array(),
        render: null,
        orientation: 'horizontal',
        closeOnSelect: true,
        keyboardLoop: true,
        activeItem: $(null),
        active: null,
        compactThreshold: 60,
        clickFirst: false,
        menuActive: $(null),
        isMenuActivated: $(false),
        compact: $(null),
        props
    };

}

BaseComponent.extends(Menu);
BaseComponent.use(Menu, HasItems, HasEventEmitter, HasMenuItem);

Menu.defaultTemplate = null;

Menu.use = function(template) {
    Menu.defaultTemplate = template;
};

// Menu.prototype.$originalBuild = Menu.prototype.$build;
// Menu.prototype.$build = function() {
//     const activeSource = (typeof this.$description.active === 'function') ? this.$description.active() : this.$description.active;
//     if(activeSource.__$Observable) {
//         activeSource.subscribe((a) => {
//             console.log('Subscribe', a);
//             // Todo: update active element
//         });
//     }
//     return this.$originalBuild();
// };

Menu.prototype.dataResolver = function(resolver) {
    this.$description.dataResolver = resolver;
    return this;
};

Menu.prototype.title = function(title) {
    this.$description.title = title;
    return this;
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

Menu.prototype.inline = function() {
    this.$description.orientation = 'inline';
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

Menu.prototype.active = function(callback) {
    this.$description.active = callback;
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

Menu.prototype.group = function(label, icon, builder, props = {}) {
    const group = new MenuGroup(label, props);
    group.icon(icon);
    builder && builder(group);
    return this.add(group);
};

Menu.prototype.getItem = function(key) {
    return this.$description.items.find(
        item => item.$description.key === key || item.$description.label === key
    );
};

Menu.prototype.compactThreshold = function(width = 60) {
    this.$description.compactThreshold = width;
    return this;
};

Menu.prototype.clickFirst = function(mode = true) {
    this.$description.clickFirst = mode;
    return this;
};