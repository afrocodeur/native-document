import Field from "../Field";

export default function SelectField(name, options, defaultConfig) {
    if(!(this instanceof SelectField)) {
        return new SelectField(name, defaultConfig);
    }

    Field.call(this, name, 'select', defaultConfig);

    Object.assign(this.$description, {
        options: options || [],
        multiple: false,
        searchable: false,
        clearable: false,
        groups: null
    });
}

SelectField.defaultTemplate = null;

SelectField.use = function(template) {
    SelectField.defaultTemplate = template.selectField;
};

SelectField.prototype = Object.create(Field.prototype);
SelectField.prototype.constructor = SelectField;

SelectField.prototype.options = function(opts) {
    this.$description.options = opts;
    return this;
};

SelectField.prototype.multiple = function(enabled = true) {
    this.$description.multiple = enabled;
    return this;
};

SelectField.prototype.searchable = function(enabled = true) {
    this.$description.searchable = enabled;
    return this;
};

SelectField.prototype.clearable = function(enabled = true) {
    this.$description.clearable = enabled;
    return this;
};

SelectField.prototype.groups = function(groupsConfig) {
    this.$description.groups = groupsConfig;
    return this;
};