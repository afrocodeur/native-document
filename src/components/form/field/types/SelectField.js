import Field from "../Field";

export default function SelectField(name, props) {
    if(!(this instanceof SelectField)) {
        return new SelectField(name, props);
    }

    Field.call(this, name, 'select', props);

    Object.assign(this.$description, {
        options: [],
        multiple: false,
        searchable: false,
        searchPlaceholder: null,
        clearable: false,
        groups: null,
        multipleDisplay: 'text',
        removeSelected: false,
        truncateRender: false,
        countRender: false,
        selectedLabelRender: false,
        renderItem: null,
        truncateMax: null
    });
}

SelectField.defaultTemplate = null;

SelectField.use = function(template) {
    SelectField.defaultTemplate = template;
};

SelectField.prototype = Object.create(Field.prototype);
SelectField.prototype.constructor = SelectField;

SelectField.prototype.options = function(opts) {
    this.$description.options = opts;
    return this;
};

SelectField.prototype.option = function(value, label, props = {}) {
    this.$description.options.push({ label, value, props });
    return this;
};

SelectField.prototype.multiple = function(enabled = true) {
    this.$description.multiple = enabled;
    return this;
};

SelectField.prototype.searchable = function(enabled = true, placeholder = null) {
    this.$description.searchable = enabled;
    this.$description.searchPlaceholder = placeholder;
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

SelectField.prototype.multipleDisplay = function(mode) {
    this.$description.multipleDisplay = mode;
    return this;
};
SelectField.prototype.multipleDisplayAsTags = function() {
    this.$description.multipleDisplay = 'tags';
    return this;
};

SelectField.prototype.multipleDisplayAsText = function() {
    this.$description.multipleDisplay = 'text';
    return this;
};

SelectField.prototype.multipleDisplayAsCount = function() {
    this.$description.multipleDisplay = 'count';
    return this;
};

SelectField.prototype.multipleDisplayAsTruncate = function(max = 2) {
    this.$description.multipleDisplay = 'truncate';
    this.$description.truncateMax = max;
    return this;
};

SelectField.prototype.removeSelected = function(enabled = true) {
    this.$description.removeSelected = enabled;
    return this;
};

SelectField.prototype.truncateRender = function(callback) {
    this.$description.truncateRender = callback;
    return this;
};

SelectField.prototype.countRender = function(callback) {
    this.$description.countRender = callback;
    return this;
};

SelectField.prototype.selectedLabelRender = function(callback) {
    this.$description.selectedLabelRender = callback;
    return this;
};
SelectField.prototype.renderItem = function(callback) {
    this.$description.renderItem = callback;
    return this;
};
SelectField.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
}