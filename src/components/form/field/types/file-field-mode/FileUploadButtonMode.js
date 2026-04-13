import BaseComponent from "../../../../BaseComponent";
import HasEventEmitter from "../../../../../core/utils/HasEventEmitter";

export default function FileUploadButtonMode(props = {}) {
    if(!(this instanceof FileUploadButtonMode)) {
        return new FileUploadButtonMode(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        buttonLabel:  'Add file',
        buttonIcon:   null,
        showProgress: true,
        renderItem:   null,
        renderButton: null,
        renderList:   null,
        props
    };
}

BaseComponent.extends(FileUploadButtonMode);
BaseComponent.use(FileUploadButtonMode, HasEventEmitter);

FileUploadButtonMode.defaultTemplate = null;

FileUploadButtonMode.use = function(template) {
    FileUploadButtonMode.defaultTemplate = template;
};

FileUploadButtonMode.prototype.buttonLabel = function(label) {
    this.$description.buttonLabel = label;
    return this;
};

FileUploadButtonMode.prototype.buttonIcon = function(icon) {
    this.$description.buttonIcon = icon;
    return this;
};

FileUploadButtonMode.prototype.showProgress = function(enabled = true) {
    this.$description.showProgress = enabled;
    return this;
};

FileUploadButtonMode.prototype.renderItem = function(fn) {
    this.$description.renderItem = fn;
    return this;
};

FileUploadButtonMode.prototype.renderButton = function(fn) {
    this.$description.renderButton = fn;
    return this;
};

FileUploadButtonMode.prototype.renderList = function(fn) {
    this.$description.renderList = fn;
    return this;
};