import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import { $ } from '../../core/data/Observable';

/**
 * Toggle switch for boolean values. Supports reactive model binding, inner labels, icon states, variants, loading and readonly states.
 *
 *
 * @example
 * const toggle = new Switch()
 *     .model(darkModeObs)
 *     .label(Span('Dark mode'))
 *     .labelPosition('right')
 *     .variant('primary')
 *     .icon(SunIcon(), MoonIcon())
 *     .onChange((value) => applyTheme(value));
 *
 * Switch.use((description, instance) => {
 *     return Div({ class: 'switch' });
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function Switch(props = {}) {
    if (!(this instanceof Switch)) {
        return new Switch(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        value: $(false),
        label: null,
        labelPosition: $('right'),
        variant: $('primary'),
        outline: false,
        disabled: false,
        loading: false,
        readonly: false,
        onIcon: null,
        offIcon: null,
        innerOnLabel: null,
        innerOffLabel: null,
    };
}

BaseComponent.extends(Switch);
BaseComponent.use(Switch, HasEventEmitter);

// Theming
Switch.defaultTemplate = null;

/**
 * Registers the render template for Switch.
 * @param {(description: {
 *     value: Observable<boolean>,
 *     label: NdChild|null,
 *     labelPosition: Observable<'left'|'right'>,
 *     variant: Observable<string>,
 *     outline: boolean,
 *     disabled: boolean|Observable<boolean>,
 *     loading: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     onIcon: NdChild|null,
 *     offIcon: NdChild|null,
 *     innerOnLabel: NdChild|null,
 *     innerOffLabel: NdChild|null,
 * }, instance: Switch) => NdChild} template
 */
Switch.use = function(template) {
    Switch.defaultTemplate = template;
};

/**
 * @param {boolean|Observable<boolean>} value
 * @returns {this}
 */
Switch.prototype.model = function(value) {
    this.$description.value = BaseComponent.obs(value);
    return this;
};

/**
 * @param {NdChild} label
 * @returns {this}
 */
Switch.prototype.label = function(label) {
    this.$description.label = label;
    return this;
};

/**
 * @param {NdChild} onLabel
 * @param {NdChild} offLabel
 * @returns {this}
 */
Switch.prototype.innerLabel = function(onLabel, offLabel) {
    this.$description.innerOnLabel  = onLabel;
    this.$description.innerOffLabel = offLabel;
    return this;
};

/**
 * @param {'left'|'right'} position
 * @returns {this}
 */
Switch.prototype.labelPosition = function(position) {
    this.$description.labelPosition = position;
    return this;
};

/**
 * @param {string} name
 * @returns {this}
 */
Switch.prototype.variant = function(name) {
    this.$description.variant.set(name);
    return this;
};

/**
 * @returns {this}
 */
Switch.prototype.primary = function() {
    return this.variant('primary');
};

/**
 * @returns {this}
 */
Switch.prototype.secondary = function() {
    return this.variant('secondary');
};

/**
 * @returns {this}
 */
Switch.prototype.danger = function() {
    return this.variant('danger');
};

/**
 * @returns {this}
 */
Switch.prototype.success = function() {
    return this.variant('success');
};

/**
 * @returns {this}
 */
Switch.prototype.warning = function() {
    return this.variant('warning');
};

/**
 * @returns {this}
 */
Switch.prototype.ghost = function() {
    return this.variant('ghost');
};

/**
 * @returns {this}
 */
Switch.prototype.link = function() {
    return this.variant('link');
};

/**
 * @returns {this}
 */
Switch.prototype.outline = function() {
    this.$description.outline = true;
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [condition=true]
 * @returns {this}
 */
Switch.prototype.disabled = function(condition = true) {
    this.$description.disabled = BaseComponent.obs(condition);
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [isLoading=true]
 * @returns {this}
 */
Switch.prototype.loading = function(isLoading = true) {
    this.$description.loading = BaseComponent.obs(isLoading);
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [condition=true]
 * @returns {this}
 */
Switch.prototype.readonly = function(condition = true) {
    this.$description.readonly = BaseComponent.obs(condition);
    return this;
};

/**
 * @param {NdChild} onIcon
 * @param {NdChild} offIcon
 * @returns {this}
 */
Switch.prototype.icon = function(onIcon, offIcon) {
    this.$description.offIcon = offIcon;
    this.$description.onIcon = onIcon;
    return this;
};

/**
 * @returns {this}
 */
Switch.prototype.toggle = function() {
    this.$description.value.toggle();
    return this;
};

/**
 * @returns {this}
 */
Switch.prototype.setOn = function() {
    this.$description.value.set(true);
    return this;
};

/**
 * @returns {this}
 */
Switch.prototype.setOff = function() {
    this.$description.value.set(false);
    return this;
};

/**
 * @param {(value: boolean) => void} handler
 * @returns {this}
 */
Switch.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Switch.prototype.onOn = function(handler) {
    this.on('on', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Switch.prototype.onOff = function(handler) {
    this.on('off', handler);
    return this;
};