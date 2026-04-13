import StringField from "./StringField";

export default function TextAreaField(name, props) {
    if(!(this instanceof TextAreaField)) {
        return new TextAreaField(name, props);
    }

    StringField.call(this, name, 'textarea', props);

    Object.assign(this.$description, {
        ...this.$description,
        rows: 4,
        cols: null,
        resize: 'vertical',
        autoGrow: false,
        wordCount: false,
        characterCounter: false,
    });
}

TextAreaField.defaultTemplate = null;

TextAreaField.use = function(template) {
    TextAreaField.defaultTemplate = template;
};

TextAreaField.prototype = Object.create(StringField.prototype);
TextAreaField.prototype.constructor = TextAreaField;

TextAreaField.prototype.rows = function(value) {
    this.$description.rows = value;
    return this;
};

TextAreaField.prototype.cols = function(value) {
    this.$description.cols = value;
    return this;
};

TextAreaField.prototype.resize = function(value) {
    this.$description.resize = value;
    return this;
};

TextAreaField.prototype.autoGrow = function(enabled = true) {
    this.$description.autoGrow = enabled;
    return this;
};

TextAreaField.prototype.characterCounter = function(enabled = true) {
    this.$description.characterCounter = enabled;
    return this;
};

TextAreaField.prototype.wordCount = function(min, max, message) {
    this.$description.wordCount = true;
    this.$description.rules.push({
        fn: (value) => {
            if (!value) return true;
            const words = value.trim().split(/\s+/).length;
            if (min && words < min) return false;
            if (max && words > max) return false;
            return true;
        },
        message: message || `Word count must be between ${min || 0} and ${max || '∞'}`
    });
    return this;
};