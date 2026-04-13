import StringField from "./StringField";

export default function AutocompleteField(name, props) {
    if(!(this instanceof AutocompleteField)) {
        return new AutocompleteField(name, props);
    }

    StringField.call(this, name, 'autocomplete', props);

    Object.assign(this.$description, {
        source: null,
        minChars: 2,
        debounce: 300,
        maxResults: 10,
        valueKey: 'id',
        labelKey: 'label',
        renderItem: null,
    });
}

AutocompleteField.defaultTemplate = null;

AutocompleteField.use = function(template) {
    AutocompleteField.defaultTemplate = template;
};


AutocompleteField.prototype = Object.create(StringField.prototype);
AutocompleteField.prototype.constructor = AutocompleteField;

AutocompleteField.prototype.source = function(dataSource) {
    this.$description.source = dataSource;
    return this;
};

AutocompleteField.prototype.minChars = function(min) {
    this.$description.minChars = min;
    return this;
};

AutocompleteField.prototype.debounce = function(ms) {
    this.$description.debounce = ms;
    return this;
};

AutocompleteField.prototype.maxResults = function(max) {
    this.$description.maxResults = max;
    return this;
};

AutocompleteField.prototype.oneOf = function(allowedValues, message) {
    this.$description.rules.push({
        validate: (value) => {
            if (!value) return true;
            return allowedValues.includes(value);
        },
        message: message || `Must be one of: ${allowedValues.join(', ')}`
    });
    return this;
};

AutocompleteField.prototype.valueKey = function(key) {
    this.$description.valueKey = key;
    return this;
};

AutocompleteField.prototype.labelKey = function(key) {
    this.$description.labelKey = key;
    return this;
};
AutocompleteField.prototype.onSelect = function(handler) {
    this.on('select', handler);
    return this;
};
AutocompleteField.prototype.renderItem = function(callback) {
    this.$description.renderItem = callback;
    return this;
};