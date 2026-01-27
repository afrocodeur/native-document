import NumberField from "./NumberField";

export default function RangeField(name, defaultConfig) {
    if(!(this instanceof RangeField)) {
        return new RangeField(name, defaultConfig);
    }

    NumberField.call(this, name, 'range', defaultConfig);

    Object.assign(this.$description, {
        showValue: true
    });
}

RangeField.defaultTemplate = null;

RangeField.use = function(template) {
    RangeField.defaultTemplate = template.rangeField;
};

RangeField.prototype = Object.create(NumberField.prototype);
RangeField.prototype.constructor = RangeField;

RangeField.prototype.showValue = function(enabled = true) {
    this.$description.showValue = enabled;
    return this;
};