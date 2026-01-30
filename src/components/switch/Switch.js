import BaseComponent from "../BaseComponent";
import EventEmitter from "../../../src/core/utils/EventEmitter";

function Switch(config = {}) {
    if (!(this instanceof Switch)) {
        return new Switch(config);
    }

    this.$description = {

    };
}

BaseComponent.extends(Switch, EventEmitter);

// Theming
Switch.defaultTemplate = null;
Switch.use = function(template) {

};

Switch.prototype.model = function(value) {};
Switch.prototype.value = function() {};

Switch.prototype.label = function(label) {};
Switch.prototype.labelPosition = function(position) {};

Switch.prototype.variant = function(name) {
    this.$description.variant = name;
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
    this.$description.disabled = condition;
    return this;
};
Switch.prototype.loading = function(isLoading = true) {
    this.$description.loading = isLoading;
    return this;
};
Switch.prototype.readonly = function(condition = true) {
    this.$description.readonly = condition;
    return this;
};

Switch.prototype.icon = function(onIcon, offIcon) {};

Switch.prototype.toggle = function() {};
Switch.prototype.on = function() {};
Switch.prototype.off = function() {};

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

// Render
Switch.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};

Switch.prototype.$build = function() {

};
Switch.prototype.toNdElement = function() {};