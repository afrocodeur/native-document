import {Validation} from "../../validation/Validation";
import Field from "../Field";

export default function NumberField(name, type = 'number', defaultConfig = {}) {
    if(!(this instanceof NumberField)) {
        return new NumberField(name, defaultConfig);
    }

    Field.call(this, name, type, defaultConfig);

    Object.assign(this.$description, {
        ...this.$description,
        step: null,
        decimals: null,
        prefix: null,
        suffix: null,
    });
}

NumberField.defaultTemplate = null;

NumberField.use = function(template) {
    NumberField.defaultTemplate = template.numberField;
};

NumberField.prototype = Object.create(Field.prototype);
NumberField.prototype.constructor = NumberField;

NumberField.prototype.min = function(min, message) {
    return this.addRule(Validation.min, [min], message);
};

NumberField.prototype.max = function(max, message) {
    return this.addRule(Validation.max, [max], message);
};

NumberField.prototype.between = function(min, max, message) {
    return this.addRule(Validation.between, [min, max], message);
};

NumberField.prototype.integer = function(message) {
    return this.addRule(Validation.integer, [], message);
};

NumberField.prototype.positive = function(message) {
    return this.addRule(Validation.positive, [], message);
};

NumberField.prototype.unsigned = NumberField.prototype.positive;

NumberField.prototype.negative = function(message) {
    return this.addRule(Validation.negative, [], message);
};

NumberField.prototype.multipleOf = function(n, message) {
    this.$description.rules.push({
        validate: (value) => {
            if (!value && value !== 0) return true;
            return Number(value) % n === 0;
        },
        message: message || `Must be a multiple of ${n}`
    });
    return this;
};

NumberField.prototype.step = function(value) {
    this.$description.step = value;
    return this;
};

NumberField.prototype.decimals = function(value) {
    this.$description.decimals = value;
    return this;
};

NumberField.prototype.prefix = function(text) {
    this.$description.prefix = text;
    return this;
};

NumberField.prototype.suffix = function(text) {
    this.$description.suffix = text;
    return this;
};