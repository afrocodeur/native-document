import Field from '../../field/Field';
import {Validation} from '../../validation/Validation';
import { $ } from '../../../../core/data/Observable';
import FileItemPreview from '../../field/types/file-field-mode/FileItemPreview';

/**
 * File upload field. Supports single/multiple files, MIME type and extension filtering,
 * size validation, file count limits, and multiple display modes (native, dropzone, button, wall, avatar).
 * @example
 * const field = new FileField('documents')
 *     .label(Span('Upload documents'))
 *     .multiple(true)
 *     .accept(['application/pdf', 'image/png'])
 *     .maxSize(5 * 1024 * 1024, 'Max 5MB per file')
 *     .maxFiles(3, 'Max 3 files')
 *     .mode(FileDropzoneMode())
 *     .onFileAdd((file) => console.log('added', file.name))
 *     .onFileRemove((file) => console.log('removed', file.name));
 *
 * FileField.use((description, instance) => {
 *     // description.accept, description.multiple, description.mode,
 *     // description.files — Observable<FileItemPreview[]>, description.fileIcons...
 *     return Input({ type: 'file', multiple: description.multiple });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props={}]
 */
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
        props,
    });
}

FileField.defaultTemplate = null;

/**
 * Registers the render template for FileField.
 * @param {(description: {
 *     name: string,
 *     type: 'file',
 *     label: NdChild|null,
 *     accept: string|null,
 *     multiple: boolean,
 *     mode: FileNativeMode|FileAvatarMode|FileDropzoneMode|FileUploadButtonMode|FileWallMode|null,
 *     files: Observable<FileItemPreview[]>,
 *     fileIcons: Array<(file: File) => NdChild>,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: FileField) => NdChild} template
 */
FileField.use = function(template) {
    FileField.defaultTemplate = template;
};

FileField.prototype = Object.create(Field.prototype);
FileField.prototype.constructor = FileField;

/**
 * @param {string|string[]} mimeTypes
 * @returns {this}
 */
FileField.prototype.accept = function(mimeTypes) {
    this.$description.accept = Array.isArray(mimeTypes) ? mimeTypes.join(',') : mimeTypes;
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
FileField.prototype.multiple = function(enabled = true) {
    this.$description.multiple = enabled;
    return this;
};

/**
 * @param {FileNativeMode|FileAvatarMode|FileDropzoneMode|FileUploadButtonMode|FileWallMode|null} mode
 * @returns {this}
 */
FileField.prototype.mode = function(mode) {
    this.$description.mode = mode;
    return this;
};

/**
 * @param {number} bytes
 * @param {string} [message]
 * @returns {this}
 */
FileField.prototype.maxSize = function(bytes, message) {
    return this.addRule(Validation.maxFileSize, [bytes], message);
};

/**
 * @param {number} bytes
 * @param {string} [message]
 * @returns {this}
 */
FileField.prototype.minSize = function(bytes, message) {
    return this.addRule(Validation.minFileSize, [bytes], message);
};

/**
 * @param {string[]} types - e.g. ['image/png', 'application/pdf']
 * @param {string} [message]
 * @returns {this}
 */
FileField.prototype.mimeTypes = function(types, message) {
    return this.addRule(Validation.mimeTypes, [types], message);
};

/**
 * @param {string[]} extensions - e.g. ['.pdf', '.docx']
 * @param {string} [message]
 * @returns {this}
 */
FileField.prototype.extensions = function(extensions, message) {
    return this.addRule(Validation.extensions, [extensions], message);
};

/**
 * @param {number} max
 * @param {string} [message]
 * @returns {this}
 */
FileField.prototype.maxFiles = function(max, message) {
    return this.addRule(Validation.maxFiles, [max], message);
};

/**
 * @param {number} min
 * @param {string} [message]
 * @returns {this}
 */
FileField.prototype.minFiles = function(min, message) {
    return this.addRule(Validation.minFiles, [min], message);
};

/**
 * @param {(file: File) => void} handler
 * @returns {this}
 */
FileField.prototype.onFileAdd = function(handler) {
    this.on('fileAdd', handler);
    return this;
};

/**
 * @param {() => void} handler
 * @returns {this}
 */
FileField.prototype.onReset = function(handler) {
    this.on('reset', handler);
    return this;
};

/**
 * @param {(file: File) => void} handler
 * @returns {this}
 */
FileField.prototype.onFileRemove = function(handler) {
    this.on('fileRemove', handler);
    return this;
};

/**
 * Adds a single file and optionally triggers a value update.
 * @param {File} file
 * @param {boolean} [update=true]
 * @returns {this}
 */
FileField.prototype.addFile = function(file, update = true) {
    const item = new FileItemPreview(file);
    this.$description.files.push(item);
    this.emit('fileAdd', item);
    update && this.$update();
    return this;
};

/**
 * Replaces all current files with the given list.
 * @param {File[]} files
 * @returns {this}
 */
FileField.prototype.setFiles = function(files) {
    this.$description.files.clear();
    this.addFiles(files);
    return this;
};

/**
 * @param {File[]} files
 * @returns {this}
 */
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

/**
 * @param {File} file
 * @returns {this}
 */
FileField.prototype.removeFile = function(file) {
    this.$description.files.remove(file);
    this.emit('fileRemove', file);
    this.$update();
    return this;
};

/**
 * @returns {File[]}
 */
FileField.prototype.getFiles = function() {
    return this.$description.files.val();
};

/**
 * Clears all files and emits the reset event.
 * @returns {this}
 */
FileField.prototype.reset = function() {
    this.$description.files.clear();
    this.emit('reset');
    this.$update();
    return this;
};

/**
 * Adds a custom icon resolver for a specific file.
 * @param {(file: File) => NdChild} desc
 * @returns {this}
 */
FileField.prototype.fileIcon = function(desc) {
    this.$description.fileIcons.push(desc);
    return this;
};

/**
 * Sets icon resolvers by file extension or MIME type.
 * @param {Record<string, NdChild>} icons
 * @returns {this}
 */
FileField.prototype.fileIcons = function(icons) {
    this.$description.fileIcons = icons;
    return this;
};