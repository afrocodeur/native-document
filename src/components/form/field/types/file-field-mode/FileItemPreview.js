import BaseComponent from "../../../../BaseComponent";
import HasEventEmitter from "../../../../../core/utils/HasEventEmitter";
import { $ } from '../../../../../core/data/Observable';

/**
 * Represents a single file in a FileField upload list.
 * Tracks upload status, progress, and error state reactively.
 * Used internally by FileField modes to display per-file feedback.
 * @example
 * const preview = new FileItemPreview(file)
 *     .uploading()
 *     .progress(45)
 *     .done()
 *     .onClick((file, e) => console.log('clicked', file.name))
 *     .onRemove((file) => fileField.removeFile(file));
 *
 * FileItemPreview.use((description, instance) => {
 *     // description.file    — File object
 *     // description.status  — Observable<'idle'|'uploading'|'done'|'error'>
 *     // description.progress — Observable<number> (0-100)
 *     // description.error   — Observable<string|null>
 *     return Div({ class: 'file-preview' },
 *         Span(description.file.name),
 *         ShowIf(description.status.isEqualTo('uploading'), () =>
 *             Div({ class: 'progress' }, Span(description.progress))
 *         ),
 *     );
 * });
 *
 * @constructor
 * @param {File} file
 * @param {GlobalAttributes} [props={}]
 */
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

/**
 * Registers the render template for FileItemPreview.
 * @param {(description: {
 *     file: File|null,
 *     status: Observable<'idle'|'uploading'|'done'|'error'>,
 *     progress: Observable<number>,
 *     error: Observable<string|null>,
 *     props: GlobalAttributes
 * }, instance: FileItemPreview) => NdChild} template
 */
FileItemPreview.use = function(template) {
    FileItemPreview.defaultTemplate = template;
};

/**
 * Returns the File object associated with this preview.
 * @returns {File}
 */
FileItemPreview.prototype.file = function() {
    return this.$description.file;
};

/**
 * @param {'idle'|'uploading'|'done'|'error'} status
 * @returns {this}
 */
FileItemPreview.prototype.status = function(status) {
    this.$description.status.set(status);
    return this;
};

/**
 * @param {number} value - Upload progress from 0 to 100
 * @returns {this}
 */
FileItemPreview.prototype.progress = function(value) {
    this.$description.progress.set(value);
    return this;
};

/**
 * Sets an error message and transitions status to 'error'.
 * @param {string} message
 * @returns {this}
 */
FileItemPreview.prototype.error = function(message) {
    this.$description.error.set(message);
    this.$description.status.set('error');
    return this;
};

/**
 * Marks the upload as done and sets progress to 100.
 * @returns {this}
 */
FileItemPreview.prototype.done = function() {
    this.$description.status.set('done');
    this.$description.progress.set(100);
    return this;
};

/**
 * Transitions status to 'uploading'.
 * @returns {this}
 */
FileItemPreview.prototype.uploading = function() {
    this.$description.status.set('uploading');
    return this;
};

/**
 * @param {(file: File, event: MouseEvent) => void} handler
 * @returns {this}
 */
FileItemPreview.prototype.onClick = function(handler) {
    this.on('click', handler);
    return this;
};

/**
 * @param {(file: File) => void} handler
 * @returns {this}
 */
FileItemPreview.prototype.onRemove = function(handler) {
    this.on('remove', handler);
    return this;
};

/**
 * @param {(file: File) => void} handler
 * @returns {this}
 */
FileItemPreview.prototype.onReplace = function(handler) {
    this.on('replace', handler);
    return this;
};