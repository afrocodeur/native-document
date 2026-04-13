import BaseComponent from "../../../../BaseComponent";
import HasEventEmitter from "../../../../../core/utils/HasEventEmitter";

export default function FileDropzoneMode(props = {}) {
    if(!(this instanceof FileDropzoneMode)) {
        return new FileDropzoneMode(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        icon:       null,
        text:       'Click or drag & drop files here',
        hint:       null,
        height:     null,
        renderZone: null,
        removeIcon: null,
        props
    };
}

BaseComponent.extends(FileDropzoneMode);
BaseComponent.use(FileDropzoneMode, HasEventEmitter);

FileDropzoneMode.defaultTemplate = null;

FileDropzoneMode.use = function(template) {
    FileDropzoneMode.defaultTemplate = template;
};

FileDropzoneMode.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

FileDropzoneMode.prototype.text = function(text) {
    this.$description.text = text;
    return this;
};

FileDropzoneMode.prototype.hint = function(hint) {
    this.$description.hint = hint;
    return this;
};

FileDropzoneMode.prototype.height = function(value) {
    this.$description.height = value;
    return this;
};

FileDropzoneMode.prototype.renderZone = function(fn) {
    this.$description.renderZone = fn;
    return this;
};

FileDropzoneMode.prototype.removeIcon = function(icon) {
    this.$description.removeIcon = icon;
    return this;
};