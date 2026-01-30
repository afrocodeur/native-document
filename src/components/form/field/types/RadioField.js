import Field from "../Field";
import {Validator} from "../../../../../index";
import CheckboxField from "./CheckboxField";

export default function RadioField(name, options, defaultConfig = {}) {
    if(!(this instanceof RadioField)) {
        return new RadioField(name, defaultConfig);
    }

    Field.call(this, name, 'radio', defaultConfig);

    Object.assign(this.$description, {
        options: options || [],
        layout: 'vertical' || defaultConfig?.layout,
        checked: false
    });
}

RadioField.defaultTemplate = null;

RadioField.use = function(template) {
    RadioField.defaultTemplate = template.radioField;
};

RadioField.prototype = Object.create(Field.prototype);
RadioField.prototype.constructor = RadioField;

RadioField.prototype.options = function(opts) {
    this.$description.options = opts;
    return this;
};

RadioField.prototype.model = function(observable) {
    this.$description.checked = observable;
    return this;
};

CheckboxField.prototype.checked = function() {
    const checked = this.$description.checked;
    if(Validator.isObservable(checked)) {
        return checked.val();
    }
    return checked;
};

RadioField.prototype.layout = function(value) {
    const allowedLayouts = ['vertical', 'horizontal', 'grid'];

    if (!allowedLayouts.includes(value)) {
        throw new Error(`Invalid layout "${value}". Must be one of: ${allowedLayouts.join(', ')}`);
    }

    this.$description.layout = value;
    return this;
};

RadioField.prototype.horizontal = function() {
    this.$description.layout = 'horizontal';
    return this;
};

RadioField.prototype.vertical = function() {
    this.$description.layout = 'vertical';
    return this;
};

RadioField.prototype.grid = function() {
    this.$description.layout = 'grid';
    return this;
};