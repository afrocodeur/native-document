import BaseComponent from "../../../../BaseComponent";
import HasEventEmitter from "../../../../../core/utils/HasEventEmitter";
import { $ } from '../../../../../../index';

export default function FileItemPreview(file, props = {}) {
    if(!(this instanceof FileItemPreview)) {
        return new FileItemPreview(file, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        file:     file || null,
        status:   $('idle'),
        progress: $(0),
        error:    $(null),
        props
    };
}

BaseComponent.extends(FileItemPreview);
BaseComponent.use(FileItemPreview, HasEventEmitter);

FileItemPreview.defaultTemplate = null;

FileItemPreview.use = function(template) {
    FileItemPreview.defaultTemplate = template;
};

FileItemPreview.prototype.file = function() {
    return this.$description.file;
};

FileItemPreview.prototype.status = function(status) {
    this.$description.status.set(status);
    return this;
};

FileItemPreview.prototype.progress = function(value) {
    this.$description.progress.set(value);
    return this;
};

FileItemPreview.prototype.error = function(message) {
    this.$description.error.set(message);
    this.$description.status.set('error');
    return this;
};

FileItemPreview.prototype.done = function() {
    this.$description.status.set('done');
    this.$description.progress.set(100);
    return this;
};

FileItemPreview.prototype.uploading = function() {
    this.$description.status.set('uploading');
    return this;
};

FileItemPreview.prototype.onClick = function(handler) {
    this.on('click', handler);
    return this;
};

FileItemPreview.prototype.onRemove = function(handler) {
    this.on('remove', handler);
    return this;
};

FileItemPreview.prototype.onReplace = function(handler) {
    this.on('replace', handler);
    return this;
};