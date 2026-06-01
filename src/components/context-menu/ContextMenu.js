import Menu from "../menu/types/Menu";
import BaseComponent from "../BaseComponent";
import {NDElement} from "../../core/wrappers/NDElement";
import { $ } from '../../core/data/Observable';

/**
 * Floating context menu triggered by right-click or custom trigger element. Wraps a Menu component.
 *
 *
 * @example
 * const ctxMenu = new ContextMenu()
 *     .trigger(myElement)
 *     .menu((menu) => {
 *         menu.item('Edit', () => edit())
 *             .item('Delete', () => remove())
 *             .separator()
 *             .item('Copy link', () => copy());
 *     });
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
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

/**
 * Registers the render template and interaction handler for ContextMenu.
 * @param {(description: {
 *     props: GlobalAttributes,
 * }, instance: ContextMenu) => NdChild} template
 * @param {Function} handler
 */
ContextMenu.use = function(template, handler) {
    ContextMenu.defaultTemplate = template;
    if(!handler) {
        return;
    }
    if(ContextMenu.defaultHandler === handler) {
        return;
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

/**
 * @param {number} x
 * @param {number} y
 * @returns {this}
 */
ContextMenu.prototype.position = function(x, y) {
    this.$description.positionX.set(x);
    this.$description.positionY.set(y);
    return this;
};

/**
 * @param {HTMLElement|NDElement} trigger
 * @returns {this}
 */
ContextMenu.prototype.trigger = function(trigger) {
    this.$description.trigger = trigger;
    return this;
};

/**
 * @param {(menu: Menu) => void} callback
 * @param {GlobalAttributes} [props={}]
 * @returns {this}
 */
ContextMenu.prototype.menu = function(callback, props = {}) {
    const menu = new Menu(props);
    menu.dataResolver(() => this.$description.data);
    callback && callback(menu);
    menu.vertical().onHovered();

    this.$description.menu = menu;
    return this;
};

/**
 * @returns {this}
 */
ContextMenu.prototype.hide = function() {
    this.$description.isOpen.set(false);
    return this;
};

/**
 * @returns {this}
 */
ContextMenu.prototype.show = function() {
    this.$description.isOpen.set(true);
    return this;
};
