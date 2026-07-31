import BaseComponent from '../BaseComponent';

/**
 * Individual selectable item inside a Dropdown. Supports value, icon, shortcut, disabled/selected states.
 *
 *
 * @example
 * const item = new DropdownItem()
 *     .value('fr')
 *     .icon(FlagIcon())
 *     .content(Span('French'))
 *     .shortcut(Span('Ctrl+F'))
 *     .disabled(false);
 *
 * DropdownItem.use((description, instance) => {
 *     return Li(description.icon, description.content, description.shortcut);
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function DropdownItem(props = {}) {
    if(!(this instanceof DropdownItem)) {
        return new DropdownItem(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        icon: null,
        content: null,
        shortcut: null,
        value: null,
        disabled: false,
        selected: false,
        data: null,
        render: null,
        renderContent: null,
        action: null,
        props,
    };
    this.aria = { 'role': 'option', 'tabindex': '-1' };
};

BaseComponent.extends(DropdownItem);

DropdownItem.defaultTemplate = null;

/**
 * Registers the render template for DropdownItem.
 * @param {(description: {
 *     icon: NdChild|null,
 *     content: NdChild|null,
 *     shortcut: NdChild|null,
 *     value: *,
 *     disabled: boolean|Observable<boolean>,
 *     selected: boolean|Observable<boolean>,
 *     data: *,
 *     render: ((desc: *, instance: DropdownItem) => NdChild)|null,
 *     renderContent: ((item: DropdownItem) => NdChild)|null,
 *     props: GlobalAttributes,
 * }, instance: DropdownItem) => NdChild} template
 */
DropdownItem.use = function(template) {
    DropdownItem.defaultTemplate = template;
};

/**
 * @param {*} value
 * @returns {this}
 */
DropdownItem.prototype.value = function(value) {
    this.$description.value = value;
    return this;
};

/**
 * @returns {*}
 */
DropdownItem.prototype.getValue = function() {
    return this.$description.value;
};

/**
 * @param {boolean|Observable<boolean>} [disabled=true]
 * @returns {this}
 */
DropdownItem.prototype.disabled = function(disabled = true) {
    this.$description.disabled = BaseComponent.obs(disabled);
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [selected=true]
 * @returns {this}
 */
DropdownItem.prototype.selected = function(selected = true) {
    this.$description.selected = BaseComponent.obs(selected);
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
DropdownItem.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
DropdownItem.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};
/**
 * @param {Function} action
 * @returns {this}
 */
DropdownItem.prototype.action = function(action) {
    this.$description.action = action;
    return this;
};

/**
 * @param {*} data
 * @returns {this}
 */
DropdownItem.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

/**
 * @returns {*}
 */
DropdownItem.prototype.getData = function() {
    return this.$description.data;
};

/**
 * @param {NdChild} shortcut
 * @returns {this}
 */
DropdownItem.prototype.shortcut = function(shortcut) {
    this.$description.shortcut = shortcut;
    return this;
};

/**
 * @param {Function} callback
 * @returns {this}
 */
DropdownItem.prototype.renderContent = function(callback) {
    this.$description.renderContent = callback;
    return this;
};
