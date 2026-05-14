import Menu from "../menu/Menu";
import BaseComponent from "../BaseComponent";
import {NDElement} from "../../core/wrappers/NDElement";
import { $ } from '../../core/data/Observable';

export default function ContextMenu(props = {}) {
    if(!(this instanceof ContextMenu)) {
        return new ContextMenu(props);
    }
    BaseComponent.call(this, props);

    Object.assign(this.$description, {
        positionX: $(0),
        positionY: $(0),
        isOpen: $(false),
        menu: null,
        contextContainer: null,
        trigger: null,
        data: null,
    });
}

BaseComponent.extends(ContextMenu);

ContextMenu.defaultTemplate = null;
ContextMenu.defaultHandler = null;

ContextMenu.use = function(template, handler) {
    ContextMenu.defaultTemplate = template;
    if(!handler) {
        return;
    }
    if(ContextMenu.defaultHandler === handler) {
        return
    };
    ContextMenu.defaultHandler = handler;

    if(!NDElement.prototype.contextMenu) {
        NDElement.prototype.contextMenu = function(contextMenu, data = null) {
            ContextMenu.defaultHandler(this, contextMenu, data);
            return this;
        };
    }
    if(!BaseComponent.prototype.contextMenu) {
        BaseComponent.prototype.contextMenu = function(contextMenu, data = null) {
            this.postBuild(() => {
                ContextMenu.defaultHandler(this, contextMenu, data);
            });
            return this;
        };
    }
};

ContextMenu.prototype.position = function(x, y) {
    this.$description.positionX.set(x);
    this.$description.positionY.set(y);
    return this;
};

ContextMenu.prototype.trigger = function(trigger) {
    this.$description.trigger = trigger;
    return this;
}

ContextMenu.prototype.menu = function(callback, props = {}) {
    const menu = new Menu(props);
    menu.dataResolver(() => this.$description.data);
    callback && callback(menu);
    menu.vertical().onHovered();

    this.$description.menu = menu;
    return this;
};

ContextMenu.prototype.hide = function() {
    this.$description.isOpen.set(false);
    return this;
};

ContextMenu.prototype.show = function() {
    this.$description.isOpen.set(true);
    return this;
};
