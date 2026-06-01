import BaseComponent from '../BaseComponent';
import HasItems from '../$traits/has-items/HasItems';
import MenuDivider from './MenuDivider';
import HasMenuItem from './HasMenuItem';
import { $ } from '../../core/data/Observable';

/**
 * A collapsible group of MenuItems inside a Menu. Can hold items, dividers, and nested groups.
 *
 *
 * @example
 * const group = new MenuGroup(Span('Settings'))
 *     .icon(SettingsIcon())
 *     .collapsable(true)
 *     .collapsed(false)
 *     .item('Profile').item('Security').divider().item('Billing');
 *
 * @constructor
 * @param {NdChild} label
 * @param {GlobalAttributes} [props={}]
 */
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
        props,
    };
}

HasMenuItem.components.MenuGroup = MenuGroup;

MenuGroup.defaultTemplate = null;

/**
 * Registers the render template for MenuGroup.
 * @param {(description: {
 *     icon: NdChild|null,
 *     label: NdChild,
 *     data: *|null,
 *     items: Observable<Array<MenuItem|MenuDivider>>,
 *     render: ((desc: *, instance: MenuGroup) => NdChild)|null,
 *     collapsable: boolean,
 *     collapsed: boolean|null,
 *     visibility: Observable<boolean>,
 *     collapsableOpenedIcon: NdChild|null,
 *     collapsableClosedIcon: NdChild|null,
 *     props: GlobalAttributes,
 * }, instance: MenuGroup) => NdChild} template
 */
MenuGroup.use = function(template) {
    MenuGroup.defaultTemplate = template;
};

BaseComponent.extends(MenuGroup);
BaseComponent.use(MenuGroup, HasItems, HasMenuItem);

/**
 * @param {*} data
 * @returns {this}
 */
MenuGroup.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
MenuGroup.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * @param {boolean} [mode=true]
 * @param {NdChild} [openedIcon]
 * @param {NdChild} [closedIcon]
 * @returns {this}
 */
MenuGroup.prototype.collapsable = function(mode = true, openedIcon, closedIcon) {
    this.$description.collapsable = mode;
    this.$description.collapsed = this.$description.collapsed || $(true);
    this.$description.collapsableOpenedIcon = openedIcon;
    this.$description.collapsableClosedIcon = closedIcon;
    return this;
};

/**
 * @param {*} [mode]
 * @returns {this}
 */
MenuGroup.prototype.collapsed = function(mode = true) {
    this.$description.collapsed.set(mode);
    return this;
};

/**
 * @returns {this}
 */
MenuGroup.prototype.divider = function() {
    return this.item(new MenuDivider());
};

/**
 * @param {boolean|Observable<boolean>} mode
 * @returns {this}
 */
MenuGroup.prototype.visibility = function(mode) {
    this.$description.visibility = BaseComponent.obs(mode);
    return this;
};