import Field from "../Field";
import {Validation} from "@components/form/validation/Validation";

export default function FileField(name, type = 'file', defaultConfig = {}) {
    if(!(this instanceof FileField)) {
        return new FileField(name, defaultConfig);
    }

    Field.call(this, name, type, defaultConfig);

    Object.assign(this.$description, {
        accept: null,
        multiple: false,
        preview: false,
        dragDrop: false,
        compress: false
    });
}

FileField.defaultTemplate = null;

FileField.use = function(template) {
    FileField.defaultTemplate = template.fileField;
};

FileField.prototype = Object.create(Field.prototype);
FileField.prototype.constructor = FileField;

FileField.prototype.accept = function(mimeTypes) {
    this.$description.accept = Array.isArray(mimeTypes) ? mimeTypes.join(',') : mimeTypes;
    return this;
};

FileField.prototype.multiple = function(enabled = true) {
    this.$description.multiple = enabled;
    return this;
};

FileField.prototype.preview = function(enabled = true) {
    this.$description.preview = enabled;
    return this;
};

FileField.prototype.dragDrop = function(enabled = true) {
    this.$description.dragDrop = enabled;
    return this;
};

FileField.prototype.compress = function(enabled = true) {
    this.$description.compress = enabled;
    return this;
};

FileField.prototype.maxSize = function(bytes, message) {
    return this.addRule(Validation.maxFileSize, [bytes], message);
};

FileField.prototype.minSize = function(bytes, message) {
    return this.addRule(Validation.minFileSize, [bytes], message);
};

FileField.prototype.mimeTypes = function(types, message) {
    return this.addRule(Validation.mimeTypes, [types], message);
};

FileField.prototype.extensions = function(extensions, message) {
    return this.addRule(Validation.extensions, [extensions], message);
};

FileField.prototype.maxFiles = function(max, message) {
    return this.addRule(Validation.maxFiles, [max], message);
};

FileField.prototype.minFiles = function(min, message) {
    return this.addRule(Validation.minFiles, [min], message);
};