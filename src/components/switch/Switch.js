import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import { $ } from '../../../index'

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
        innerOffLabel: null
    };
}

BaseComponent.extends(Switch);
BaseComponent.use(Switch, HasEventEmitter);

// Theming
Switch.defaultTemplate = null;
Switch.use = function(template) {
    Switch.defaultTemplate = template;
};

Switch.prototype.model = function(value) {
    this.$description.value = BaseComponent.obs(value);
    return this;
};

Switch.prototype.label = function(label) {
    this.$description.label = label;
    return this;
};
Switch.prototype.innerLabel = function(onLabel, offLabel) {
    this.$description.innerOnLabel  = onLabel;
    this.$description.innerOffLabel = offLabel;
    return this;
};
Switch.prototype.labelPosition = function(position) {
    this.$description.labelPosition = position;
    return this;
};

Switch.prototype.variant = function(name) {
    this.$description.variant.set(name);
    return this;
};
Switch.prototype.primary = function() {
    return this.variant('primary');
};
Switch.prototype.secondary = function() {
    return this.variant('secondary');
};
Switch.prototype.danger = function() {
    return this.variant('danger');
};
Switch.prototype.success = function() {
    return this.variant('success');
};
Switch.prototype.warning = function() {
    return this.variant('warning');
};
Switch.prototype.ghost = function() {
    return this.variant('ghost');
};
Switch.prototype.link = function() {
    return this.variant('link');
};
Switch.prototype.outline = function() {
    this.$description.outline = true;
    return this;
};

Switch.prototype.disabled = function(condition = true) {
    this.$description.disabled = BaseComponent.obs(condition);
    return this;
};
Switch.prototype.loading = function(isLoading = true) {
    this.$description.loading = BaseComponent.obs(isLoading);
    return this;
};
Switch.prototype.readonly = function(condition = true) {
    this.$description.readonly = BaseComponent.obs(condition);
    return this;
};

Switch.prototype.icon = function(onIcon, offIcon) {
    this.$description.offIcon = offIcon;
    this.$description.onIcon = onIcon;
    return this;
};

Switch.prototype.toggle = function() {
    this.$description.value.toggle();
    return this;
};
Switch.prototype.on = function() {
    this.$description.value.set(true);
    return this;
};
Switch.prototype.off = function() {
    this.$description.value.set(false);
    return this;
};

Switch.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};
Switch.prototype.onOn = function(handler) {
    this.on('on', handler);
    return this;
};
Switch.prototype.onOff = function(handler) {
    this.on('off', handler);
    return this;
};