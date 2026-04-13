import Field from "../form/field/Field";

export default function Slider(name, props = {}) {
    if(!(this instanceof Slider)) {
        return new Slider(props);
    }

    Field.call(this, props);

    this.$description = {
        name,
        id: name || null,
        value:         null,
        defaultValue:  null,
        valueStart:    null,
        valueEnd:      null,
        range:         false,
        min:           0,
        max:           100,
        step:          1,
        showValue:     null,
        showTooltip:   null,
        tooltipFormat: null,
        renderTooltip: null,
        marks:         null,
        showMarks:     null,
        variant:       null,
        color:         null,
        trackColor:    null,
        fillColor:    null,
        vertical:      false,
        height:        null,
        disabled:      null,
        readonly:      null,
        reverse:       false,
        snapToMarks:   false,
        renderCursor:  null,
        renderThumb:   null,
        props
    };
}

Slider.prototype = Object.create(Field.prototype);
Slider.prototype.constructor = Slider;


Slider.defaultTemplate = null;
Slider.use = function(template) {
    Slider.defaultTemplate = template;
};

Slider.prototype.model = function(observable) {
    this.$description.value = observable;
    return this;
};

Slider.prototype.modelStart = function(observable) {
    this.$description.valueStart = observable;
    return this;
};

Slider.prototype.modelEnd = function(observable) {
    this.$description.valueEnd = observable;
    return this;
};

Slider.prototype.defaultValue = function(value) {
    this.$description.defaultValue = value;
    return this;
};

Slider.prototype.setCurrentStep = function(value) {
    this.$description.value?.set(value);
    this.emit('change', value);
    return this;
};

Slider.prototype.range = function(enabled = true) {
    this.$description.range = enabled;
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

Slider.prototype.renderTooltip = function(renderFn) {
    this.$description.renderTooltip = renderFn;
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

Slider.prototype.snapToMarks = function(enabled = true) {
    this.$description.snapToMarks = enabled;
    return this;
};

Slider.prototype.variant = function(name) {
    this.$description.variant = name;
    return this;
};

Slider.prototype.primary   = function() { return this.variant('primary');   };
Slider.prototype.secondary = function() { return this.variant('secondary'); };
Slider.prototype.success   = function() { return this.variant('success');   };
Slider.prototype.warning   = function() { return this.variant('warning');   };
Slider.prototype.danger    = function() { return this.variant('danger');    };
Slider.prototype.info      = function() { return this.variant('info');      };

Slider.prototype.color = function(color) {
    this.$description.color = color;
    return this;
};

Slider.prototype.trackColor = function(color) {
    this.$description.trackColor = color;
    return this;
};

Slider.prototype.fillColor = function(color) {
    this.$description.fillColor = color;
    return this;
};


Slider.prototype.fullColor = function(color) {
    this.color(color).fillColor(color);
    return this;
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

Slider.prototype.renderThumb = function(renderFn) {
    this.$description.renderThumb = renderFn;
    return this;
};

Slider.prototype.renderCursor = function(renderFn) {
    this.$description.renderCursor = renderFn;
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