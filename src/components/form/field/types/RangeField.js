import NumberField from "./NumberField";

export default function RangeField(name, props) {
    if(!(this instanceof RangeField)) {
        return new RangeField(name, props);
    }

    NumberField.call(this, name, 'range', props);

    Object.assign(this.$description, {
        showValue:   true,
        marks:       null,
        showMarks:   false,
        vertical:    false,
        showTooltip: false,
    });
}

RangeField.defaultTemplate = null;

RangeField.use = function(template) {
    RangeField.defaultTemplate = template;
};

RangeField.prototype = Object.create(NumberField.prototype);
RangeField.prototype.constructor = RangeField;

RangeField.prototype.showValue = function(enabled = true) {
    this.$description.showValue = enabled;
    return this;
};

RangeField.prototype.marks = function(marks) {
    this.$description.marks = marks;
    return this;
};

RangeField.prototype.showMarks = function(enabled = true) {
    this.$description.showMarks = enabled;
    return this;
};

RangeField.prototype.vertical = function(enabled = true) {
    this.$description.vertical = enabled;
    return this;
};

RangeField.prototype.showTooltip = function(enabled = true) {
    this.$description.showTooltip = enabled;
    return this;
};