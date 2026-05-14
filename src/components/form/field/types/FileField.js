import Field from "../Field";
import {Validation} from "../../validation/Validation";
import { $ } from '../../../../core/data/Observable';
import FileItemPreview from "./file-field-mode/FileItemPreview";

export default function FileField(name, props = {}) {
    if(!(this instanceof FileField)) {
        return new FileField(name, props);
    }

    Field.call(this, name, 'file', props);

    Object.assign(this.$description, {
        accept:   null,
        multiple: false,
        mode:     null,
        files:    $.array([]),
        fileIcons: [],
        props
    });
}

FileField.defaultTemplate = null;

FileField.use = function(template) {
    FileField.defaultTemplate = template;
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

FileField.prototype.mode = function(mode) {
    this.$description.mode = mode;
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

FileField.prototype.onFileAdd = function(handler) {
    this.on('fileAdd', handler);
    return this;
};

FileField.prototype.onReset = function(handler) {
    this.on('reset', handler);
    return this;
};

FileField.prototype.onFileRemove = function(handler) {
    this.on('fileRemove', handler);
    return this;
};

FileField.prototype.addFile = function(file, update = true) {
    const item = new FileItemPreview(file);
    this.$description.files.push(item);
    this.emit('fileAdd', item);
    update && this.$update();
    return this;
};

FileField.prototype.setFiles = function(files) {
    this.$description.files.clear();
    this.addFiles(files);
    return this;
}
FileField.prototype.addFiles = function(files) {
    if (!Array.isArray(files)) {
        throw new Error('addFiles expects an array of files');
    }
    for(let i = 0, len = files.length; i < len; i++) {
        this.addFile(files[i], false);
    }
    this.$update();
    return this;
};

FileField.prototype.$update = function() {
    const files = this.$description.files.val();
    this.$description.value.set(this.$description.multiple ? files.map(i => i.file()) : files[0]?.file() || null);
    this.validate();
};

FileField.prototype.removeFile = function(file) {
    this.$description.files.remove(file);
    this.emit('fileRemove', file);
    this.$update();
    return this;
};

FileField.prototype.getFiles = function() {
    return this.$description.files.val();
};

FileField.prototype.reset = function() {
    this.$description.files.clear();
    this.emit('reset');
    this.$update();
    return this;
};

FileField.prototype.fileIcon = function(desc) {
    this.$description.fileIcons.push(desc);
    return this;
};

FileField.prototype.fileIcons = function(icons) {
    this.$description.fileIcons = icons;
    return this;
}