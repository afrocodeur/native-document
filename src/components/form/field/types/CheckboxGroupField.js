import Field from "../Field";

export default function CheckboxGroupField(name, options, defaultConfig) {
    if(!(this instanceof CheckboxGroupField)) {
        return new CheckboxGroupField(name, defaultConfig);
    }

    Field.call(this, name, 'checkbox-group', defaultConfig);

    Object.assign(this.$description, {
        options: options || [],
        layout: 'vertical',
        defaultValue: []
    });
}

CheckboxGroupField.defaultTemplate = null;

CheckboxGroupField.use = function(template) {
    CheckboxGroupField.defaultTemplate = template.checkboxGroupField;
};

CheckboxGroupField.prototype = Object.create(Field.prototype);
CheckboxGroupField.prototype.constructor = CheckboxGroupField;

CheckboxGroupField.prototype.options = function(opts) {
    this.$description.options = opts;
    return this;
};

CheckboxGroupField.prototype.layout = function(value) {
    const allowedLayouts = ['vertical', 'horizontal', 'grid'];

    if (!allowedLayouts.includes(value)) {
        throw new Error(`Invalid layout "${value}". Must be one of: ${allowedLayouts.join(', ')}`);
    }

    this.$description.layout = value;
    return this;
};

CheckboxGroupField.prototype.horizontal = function() {
    this.$description.layout = 'horizontal';
    return this;
};

CheckboxGroupField.prototype.vertical = function() {
    this.$description.layout = 'vertical';
    return this;
};

CheckboxGroupField.prototype.grid = function() {
    this.$description.layout = 'grid';
    return this;
};

CheckboxGroupField.prototype.minChecked = function(min, message) {
    this.$description.rules.push({
        validate: (values) => {
            if (!Array.isArray(values)) return false;
            return values.length >= min;
        },
        message: message || `At least ${min} option${min > 1 ? 's' : ''} must be selected`
    });
    return this;
};

CheckboxGroupField.prototype.maxChecked = function(max, message) {
    this.$description.rules.push({
        validate: (values) => {
            if (!Array.isArray(values)) return false;
            return values.length <= max;
        },
        message: message || `Maximum ${max} option${max > 1 ? 's' : ''} allowed`
    });
    return this;
};

CheckboxGroupField.prototype.exactChecked = function(count, message) {
    this.$description.rules.push({
        validate: (values) => {
            if (!Array.isArray(values)) return false;
            return values.length === count;
        },
        message: message || `Exactly ${count} option${count > 1 ? 's' : ''} must be selected`
    });
    return this;
};