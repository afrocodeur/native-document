import BaseComponent from '../../../../BaseComponent';
import HasEventEmitter from '../../../../../core/utils/HasEventEmitter';

/**
 * Button-triggered file upload mode for FileField.
 * Renders a button to open the file picker and a list of uploaded files below it.
 * Each file is represented by a FileItemPreview instance.
 * @example
 * new FileField('attachments')
 *     .mode('button')
 *     .multiple(true);
 *
 * FileUploadButtonMode.use((description, instance) => {
 *     // description.buttonLabel, description.buttonIcon,
 *     // description.showProgress, description.renderItem,
 *     // description.renderButton, description.renderList
 *     return Div({ class: 'upload-button' },
 *         Button(description.buttonLabel),
 *         Div({ class: 'file-list' }),
 *     );
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props={}]
 */
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
        props,
    };
}

BaseComponent.extends(FileUploadButtonMode);
BaseComponent.use(FileUploadButtonMode, HasEventEmitter);

FileUploadButtonMode.defaultTemplate = null;

/**
 * Registers the render template for FileUploadButtonMode.
 * @param {(description: {
 *     buttonLabel: NdChild,
 *     buttonIcon: NdChild|null,
 *     showProgress: boolean,
 *     renderItem: ((file: File, preview: FileItemPreview) => NdChild)|null,
 *     renderButton: ((desc: *, instance: FileUploadButtonMode) => NdChild)|null,
 *     renderList: ((files: File[]) => NdChild)|null,
 *     props: GlobalAttributes
 * }, instance: FileUploadButtonMode) => NdChild} template
 */
FileUploadButtonMode.use = function(template) {
    FileUploadButtonMode.defaultTemplate = template;
};

/**
 * @param {NdChild} label
 * @returns {this}
 */
FileUploadButtonMode.prototype.buttonLabel = function(label) {
    this.$description.buttonLabel = label;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
FileUploadButtonMode.prototype.buttonIcon = function(icon) {
    this.$description.buttonIcon = icon;
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
FileUploadButtonMode.prototype.showProgress = function(enabled = true) {
    this.$description.showProgress = enabled;
    return this;
};

/**
 * Custom render for each uploaded file row.
 * @param {(file: File, preview: FileItemPreview) => NdChild} fn
 * @returns {this}
 */
FileUploadButtonMode.prototype.renderItem = function(fn) {
    this.$description.renderItem = fn;
    return this;
};

/**
 * Custom render for the upload button itself.
 * @param {(desc: *, instance: FileUploadButtonMode) => NdChild} fn
 * @returns {this}
 */
FileUploadButtonMode.prototype.renderButton = function(fn) {
    this.$description.renderButton = fn;
    return this;
};

/**
 * Custom render for the entire file list.
 * @param {(files: File[]) => NdChild} fn
 * @returns {this}
 */
FileUploadButtonMode.prototype.renderList = function(fn) {
    this.$description.renderList = fn;
    return this;
};