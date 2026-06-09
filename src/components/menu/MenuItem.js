import BaseComponent from '../BaseComponent';
import HasItems from '../$traits/has-items/HasItems';
import MenuDivider from './MenuDivider';
import MenuGroup from './MenuGroup';
import HasMenuItem from './HasMenuItem';
import { $ } from '../../core/data/Observable';
import HasEventEmitter from '../../core/utils/HasEventEmitter';

const EMPTY_PROPS = {};

/**
 * A single clickable or selectable item in a Menu. Supports icon, label, shortcut, trailing slot, disabled and selected states.
 *
 *
 * @example
 * const item = new MenuItem()
 *     .label(Span('Delete'))
 *     .icon(TrashIcon())
 *     .shortcut(Span('Del'))
 *     .disabled(false)
 *     .value('delete')
 *     .divider();
 *
 * MenuItem.use((description, instance) => {
 *     return Li(description.icon, description.label, description.shortcut);
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function MenuItem(props = {}) {
    if(!(this instanceof MenuItem)) {
        return new MenuItem(props || EMPTY_PROPS);
    }

    BaseComponent.call(this, props || EMPTY_PROPS);

    this.$description = {
        items: $.array(),
        key: null,
        action: null,
        label: null,
        icon: null,
        shortcut: null,
        disabled: null,
        selected: null,
        value: null,
        data: null,
        render: null,
        trailing: null,
        visibility: null,
        props,
    };
    this.aria = { 'role': 'menuitem', 'tabindex': '-1' };

}

MenuItem.defaultTemplate = null;

/**
 * Registers the render template for MenuItem.
 * @param {(description: {
 *     key: string|null,
 *     action: string|Record<string, *>|null,
 *     label: NdChild|null,
 *     icon: NdChild|null,
 *     shortcut: NdChild|null,
 *     disabled: Observable<boolean>|boolean|null,
 *     selected: Observable<boolean>|boolean|null,
 *     value: *,
 *     data: *|null,
 *     render: ((desc: *, instance: MenuItem) => NdChild)|null,
 *     trailing: NdChild|null,
 *     visibility: Observable<boolean>|null,
 *     props: GlobalAttributes,
 * }, instance: MenuItem) => NdChild} template
 */
MenuItem.use = function(template) {
    MenuItem.defaultTemplate = template;
};

BaseComponent.extends(MenuItem);
BaseComponent.use(MenuItem, HasItems, HasEventEmitter, HasMenuItem);

HasMenuItem.components.MenuItem = MenuItem;

/**
 * @param {NdChild} label
 * @returns {this}
 */
MenuItem.prototype.label = function(label) {
    this.$description.label = label;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
MenuItem.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * @param {NdChild} trailing
 * @returns {this}
 */
MenuItem.prototype.trailing = function(trailing) {
    this.$description.trailing = trailing;
    return this;
};

/**
 * @param {NdChild} shortcut
 * @returns {this}
 */
MenuItem.prototype.shortcut = function(shortcut) {
    this.$description.shortcut = shortcut;
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [disabled=true]
 * @returns {this}
 */
MenuItem.prototype.disabled = function(disabled = true) {
    this.$description.disabled = BaseComponent.obs(disabled);
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [selected=true]
 * @returns {this}
 */
MenuItem.prototype.selected = function(selected = true) {
    this.$description.selected = BaseComponent.obs(selected);
    return this;
};

/**
 * @param {number} value
 * @returns {*}
 */
MenuItem.prototype.value = function(value) {
    this.$description.value = value;
    return this;
};

/**
 * @param {*} action
 * @returns {this}
 */
MenuItem.prototype.action = function(action) {
    this.$description.action = action;
    return this;
};

/**
 * @param {*} data
 * @returns {this}
 */
MenuItem.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

/**
 * @returns {this}
 */
MenuItem.prototype.divider = function() {
    return this.item(new MenuDivider());
};

/**
 * @param {string} key
 * @returns {this}
 */
MenuItem.prototype.key = function(key) {
    this.$description.key = key;
    return this;
};

/**
 * @param {boolean|Observable<boolean>} mode
 * @returns {this}
 */
MenuItem.prototype.visibility = function(mode) {
    this.$description.visibility = BaseComponent.obs(mode);
    return this;
};