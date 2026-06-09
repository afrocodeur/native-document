import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import HasListItem from './HasListItem';

/**
 * A single item in a List. Supports icon, label, subtitle, trailing slot,
 * disabled/selected states, swipe actions (mobile), and custom render.
 *
 * @example
 * ListItem()
 *     .label('Dashboard')
 *     .icon(DashboardIcon())
 *     .subtitle('View your metrics')
 *     .trailing(Badge('New').primary())
 *     .value('dashboard')
 *     .selected(isActive)
 *     .swipeLeading([Button('Archive').success()])
 *     .swipeTrailing([Button('Delete').danger()])
 *     .onClick(() => navigate('/dashboard'));
 *
 * ListItem.use((description, instance) => {
 *     return Li({ class: 'list-item' }, description.label);
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props={}]
 */
export default function ListItem(props = {}) {
    if (!(this instanceof ListItem)) {
        return new ListItem(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        label:           null,
        subtitle:        null,
        icon:            null,
        trailing:        null,
        value:           null,
        data:            null,
        key:             null,
        disabled:        null,
        selected:        null,
        visibility:      null,
        isSelectedIcon:  null,
        swipeLeading:    [],
        swipeTrailing:   [],
        render:          null,
        props,
    };
    this.aria = { 'role': 'listitem', 'tabindex': '-1' };
}

BaseComponent.extends(ListItem);
BaseComponent.use(ListItem, HasEventEmitter);

HasListItem.components.ListItem = ListItem;

ListItem.defaultTemplate = null;

/**
 * Registers the render template for ListItem.
 * @param {(description: {
 *     label:          NdChild|null,
 *     subtitle:       NdChild|null,
 *     icon:           NdChild|null,
 *     trailing:       NdChild|null,
 *     value:          *,
 *     data:           *|null,
 *     key:            string|null,
 *     disabled:       Observable<boolean>|null,
 *     selected:       Observable<boolean>|null,
 *     visibility:     Observable<boolean>|null,
 *     isSelectedIcon: NdChild|null,
 *     swipeLeading:   NdChild[],
 *     swipeTrailing:  NdChild[],
 *     render:         ((desc: *, instance: ListItem) => NdChild)|null,
 *     props:          GlobalAttributes,
 * }, instance: ListItem) => NdChild} template
 */
ListItem.use = function(template) {
    ListItem.defaultTemplate = template;
};

/**
 * @param {NdChild} label
 * @returns {this}
 */
ListItem.prototype.label = function(label) {
    this.$description.label = label;
    return this;
};

/**
 * @param {NdChild} subtitle
 * @returns {this}
 */
ListItem.prototype.subtitle = function(subtitle) {
    this.$description.subtitle = subtitle;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
ListItem.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * @param {NdChild} trailing
 * @returns {this}
 */
ListItem.prototype.trailing = function(trailing) {
    this.$description.trailing = trailing;
    return this;
};

/**
 * @param {*} value
 * @returns {this}
 */
ListItem.prototype.value = function(value) {
    this.$description.value = value;
    return this;
};

/**
 * @param {*} data
 * @returns {this}
 */
ListItem.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

/**
 * @param {string} key
 * @returns {this}
 */
ListItem.prototype.key = function(key) {
    this.$description.key = key;
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [disabled=true]
 * @returns {this}
 */
ListItem.prototype.disabled = function(disabled = true) {
    this.$description.disabled = BaseComponent.obs(disabled);
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [selected=true]
 * @returns {this}
 */
ListItem.prototype.selected = function(selected = true) {
    this.$description.selected = BaseComponent.obs(selected);
    return this;
};

/**
 * @param {boolean|Observable<boolean>} mode
 * @returns {this}
 */
ListItem.prototype.visibility = function(mode) {
    this.$description.visibility = BaseComponent.obs(mode);
    return this;
};

/**
 * Icon displayed when the item is selected (selectByClick mode).
 * @param {NdChild} icon
 * @returns {this}
 */
ListItem.prototype.isSelectedIcon = function(icon) {
    this.$description.isSelectedIcon = icon;
    return this;
};

/**
 * Swipe actions revealed on the leading (left) side — mobile swipe gesture.
 * @param {NdChild[]} actions
 * @returns {this}
 */
ListItem.prototype.swipeLeading = function(actions) {
    this.$description.swipeLeading = Array.isArray(actions) ? actions : [actions];
    return this;
};

/**
 * Swipe actions revealed on the trailing (right) side — mobile swipe gesture.
 * @param {NdChild[]} actions
 * @returns {this}
 */
ListItem.prototype.swipeTrailing = function(actions) {
    this.$description.swipeTrailing = Array.isArray(actions) ? actions : [actions];
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
ListItem.prototype.onClick = function(handler) {
    this.on('click', handler);
    return this;
};
