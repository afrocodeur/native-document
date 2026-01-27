import BaseComponent from "@components/BaseComponent";
import EventEmitter from "@src/core/utils/EventEmitter";

export default function Slider(config = {}) {
    if (!(this instanceof Slider)) {
        return new Slider(config);
    }

    this.$description = {
        value: null,
        defaultValue: null,
        range: null,
        min: null,
        max: null,
        step: null,
        showValue: null,
        showTooltip: null,
        tooltipFormat: null,
        marks: null,
        showMarks: null,
        variant: null,
        color: null,
        trackColor: null,
        vertical: null,
        height: null,
        disabled: null,
        readonly: null,
        reverse: null,
        snapToMarks: null,
        render: null,
        renderCursor: null,
        ...config
    };
}

BaseComponent.extends(Slider, EventEmitter);

Slider.use = function(template) {};
Slider.defaultTemplate = null;


Slider.prototype.value = function(value) {
    this.$description.value = value;
    return this;
};

Slider.prototype.value = function() {
    return this.$description.value?.val();
};

Slider.prototype.setCurrentStep = function(value) {
    this.$description.value?.set(value);
    this.emit('change', value);
    return this;
};

Slider.prototype.range = function(min, max) {
    this.$description.range = {min, max};
    return this;
};

Slider.prototype.min = function(min) {
    this.$description.min = min;
    return this;
};

Slider.prototype.max = function(max) {
    this.$description.max = max;
    return this;
};

Slider.prototype.step = function(step) {
    this.$description.step = step;
    return this;
};

Slider.prototype.showValue = function(enabled = true) {
    this.$description.showValue = enabled;
    return this;
};

Slider.prototype.showTooltip = function(enabled = true) {
    this.$description.showTooltip = enabled;
    return this;
};

Slider.prototype.tooltipFormat = function(formatFn) {
    this.$description.tooltipFormat = formatFn;
    return this;
};

Slider.prototype.marks = function(marks) {
    this.$description.marks = marks;
    return this;
};

Slider.prototype.showMarks = function(enabled = true) {
    this.$description.showMarks = enabled;
    return this;
};

Slider.prototype.variant = function(name) {
    this.$description.variant = name;
    return this;
};

Slider.prototype.primary = function() {
    return this.variant('primary');
};
Slider.prototype.secondary = function() {
    return this.variant('secondary');
};
Slider.prototype.success = function() {
    return this.variant('success');
};
Slider.prototype.warning = function() {
    return this.variant('warning');
};
Slider.prototype.danger = function() {
    return this.variant('danger');
};
Slider.prototype.info = function() {
    return this.variant('info');
};

Slider.prototype.vertical = function(enabled = true) {
    this.$description.vertical = enabled;
    return this;
};

Slider.prototype.height = function(height) {
    this.$description.height = height;
    return this;
};

Slider.prototype.disabled = function(condition = true) {
    this.$description.disabled = condition;
    return this;
};

Slider.prototype.readonly = function(condition = true) {
    this.$description.readonly = condition;
    return this;
};

Slider.prototype.reverse = function(enabled = true) {
    this.$description.reverse = enabled;
    return this;
};

Slider.prototype.snapToMarks = function(enabled = true) {
    this.$description.snapToMarks = enabled;
    return this;
};

Slider.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};

Slider.prototype.onComplete = function(handler) {
    this.on('complete', handler);
    return this;
};


Slider.prototype.renderCursor = function(renderFn) {
    this.$description.renderCursor = renderFn;
    return this;
};

Slider.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
};


Slider.prototype.$build = function() {
    // TODO: Implementation
};

Slider.prototype.toNdElement = function() {
    return this.$build();
};