import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import {Validator} from "../../../index";
import DebugManager from "../../core/utils/debug-manager";

export default function Progress(props = {}) {
    if (!(this instanceof Progress)) {
        return new Progress(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        value: null,
        type: null,
        variant: null,
        max: 100,
        size: null,
        stroke: null,
        height: null,
        showValue: null,
        showPercentage: null,
        label: null,
        format: null,
        indeterminate: null,
        striped: null,
        animated: null,
        borderRadiusType: null,
        props
    };
}

BaseComponent.extends(Progress);
BaseComponent.use(Progress, HasEventEmitter);

Progress.defaultTemplate = null;

Progress.use = function(template) {
    Progress.defaultTemplate = template;
};

Progress.preset = function(name, callback) {
    if (Progress.prototype[name] || Progress[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in Progress.`);
        return;
    }
    Progress[name] = (props) => callback(new Progress(props));
};

Progress.presets = function(presets) {
    for (const name in presets) {
        Progress.preset(name, presets[name]);
    }
};

Progress.prototype.model = function(observable) {
    this.$description.value = observable;
    return this;
};

Progress.prototype.bind = Progress.prototype.model;

Progress.prototype.setCurrentStep = function(step) {
    this.$description.value?.set(step);
    this.emit('change', step);
};

Progress.prototype.value = function(value) {
    this.$description.value = BaseComponent.obs(value);
    return this;
};

Progress.prototype.setValue = function(newValue) {
    this.setCurrentStep(newValue);
    return this;
};

Progress.prototype.getCurrentValue = function() {
    return this.$description.value?.get();
}

Progress.prototype.max = function(max) {
    this.$description.max = max;
    return this;
};

Progress.prototype.type = function(type) {
    this.$description.type = type;
    return this;
};

Progress.prototype.bar = function() {
    return this.type('bar');
};

Progress.prototype.circle = function() {
    return this.type('circle');
};

Progress.prototype.line = function() {
    return this.type('line');
};

Progress.prototype.pill = function() {
    this.$description.borderRadiusType = 'pill';
    return this;
};

// Variant
Progress.prototype.variant = function(name) {
    this.$description.variant = name;
    return this;
};

Progress.prototype.primary = function() {
    return this.variant('primary');
};

Progress.prototype.secondary = function() {
    return this.variant('secondary');
};

Progress.prototype.success = function() {
    return this.variant('success');
};

Progress.prototype.warning = function() {
    return this.variant('warning');
};

Progress.prototype.danger = function() {
    return this.variant('danger');
};

Progress.prototype.info = function() {
    return this.variant('info');
};


Progress.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};
Progress.prototype.stroke = function(stroke) {
    this.$description.stroke = stroke;
    return this;
};

Progress.prototype.small = function() {
    return this.size('small');
};

Progress.prototype.medium = function() {
    return this.size('medium');
};

Progress.prototype.large = function() {
    return this.size('large');
};

Progress.prototype.height = function(height) {
    this.$description.height = height;
    return this;
};


Progress.prototype.showValue = function(enabled = true) {
    this.$description.showValue = enabled;
    return this;
};

Progress.prototype.label = function(text) {
    this.$description.label = text;
    return this;
};

Progress.prototype.format = function(formatFn) {
    this.$description.format = formatFn;
    return this;
};

Progress.prototype.indeterminate = function(enabled = true) {
    this.$description.indeterminate = enabled;
    return this;
};

Progress.prototype.striped = function(enabled = true) {
    this.$description.striped = enabled;
    return this;
};

Progress.prototype.animated = function(enabled = true) {
    this.$description.animated = enabled;
    return this;
};


Progress.prototype.start = function() {
    // TODO: Implementation
};

Progress.prototype.complete = function() {
    this.setCurrentStep(100);
    this.emit('complete');
};

Progress.prototype.increment = function(step) {
    const current = this.value() || 0;
    this.setCurrentStep(Math.min(this.$description.max, current + step));
    return this;
};

Progress.prototype.reset = function() {
    this.setCurrentStep(0);
    this.emit('reset');
    return this;
};

// Events
Progress.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};

Progress.prototype.onComplete = function(handler) {
    this.on('complete', handler);
    return this;
};

Progress.prototype.onReset = function(handler) {
    this.on('reset', handler);
    return this;
};
