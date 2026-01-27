import BaseComponent from "@components/BaseComponent";
import EventEmitter from "@src/core/utils/EventEmitter";
import {Validator} from "@core";

export default function Progress(config = {}) {
    if (!(this instanceof Progress)) {
        return new Progress(config);
    }

    this.$description = {
        value: null,
        type: null,
        variant: null,
        max: 100,
        size: null,
        height: null,
        showValue: null,
        showPercentage: null,
        label: null,
        format: null,
        indeterminate: null,
        striped: null,
        animated: null,
        render: null,
        ...config
    };
}

BaseComponent.extends(Progress, EventEmitter);

Progress.defaultTemplate = null;

Progress.use = function(template) {};

Progress.prototype.model = function(observable) {
    this.$description.value = observable;
    return this;
};

Progress.prototype.setCurrentStep = function(step) {
    this.$description.value?.set(step);
    this.emit('change', step);
};

Progress.prototype.value = function() {
    const value = this.$description.value;
    if(Validator.isObservable(value)) {
        return value.val();
    }
    return value;
};

Progress.prototype.setValue = function(newValue) {
    const value = this.$description.value;
    if(Validator.isObservable(value)) {
        value.set(newValue);
        return this;
    }
    this.$description.value = newValue;
    return this;
};

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


Progress.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};

// Build & Render
Progress.prototype.$build = function() {
    // TODO: Implementation
};

Progress.prototype.toNdElement = function() {
    return this.$build();
};