import Field from "../Field";
import {Validator} from "../../../../../index";

export default function RadioField(name, props = {}) {
    if(!(this instanceof RadioField)) {
        return new RadioField(name, props);
    }

    Field.call(this, name, 'radio', props);

    Object.assign(this.$description, {
        options: [],
        layout: 'vertical',
        checked: false
    });
}

RadioField.defaultTemplate = null;

RadioField.use = function(template) {
    RadioField.defaultTemplate = template;
};

RadioField.prototype = Object.create(Field.prototype);
RadioField.prototype.constructor = RadioField;

RadioField.prototype.options = function(opts) {
    this.$description.options = opts;
    return this;
};

RadioField.prototype.option = function(value, label, props = {}) {
    this.$description.options.push({ value, label, props });
    return this;
};

RadioField.prototype.model = function(observable) {
    this.$description.checked = observable;
    return this;
};

RadioField.prototype.checked = function() {
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