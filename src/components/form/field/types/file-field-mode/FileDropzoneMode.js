import BaseComponent from "../../../../BaseComponent";
import HasEventEmitter from "../../../../../core/utils/HasEventEmitter";

/**
 * Drag-and-drop zone mode for FileField.
 * Renders a clickable dropzone with configurable icon, text, hint, and height.
 * @example
 * new FileField('documents')
 *     .mode('dropzone');
 *
 * FileDropzoneMode.use((description, instance) => {
 *     // description.icon, description.text, description.hint,
 *     // description.height, description.removeIcon
 *     return Div({ class: 'dropzone', style: { height: description.height } },
 *         description.icon,
 *         Span(description.text),
 *         ShowIf(description.hint, () => Span({ class: 'hint' }, description.hint)),
 *     );
 * });
 */

/**
 * @constructor
 * @param {GlobalAttributes} [props={}]
 */
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

/**
 * Registers the render template for FileDropzoneMode.
 * @param {(description: {
 *     icon: NdChild|null,
 *     text: NdChild,
 *     hint: NdChild|null,
 *     height: string|number|null,
 *     renderZone: ((desc: *, instance: FileDropzoneMode) => NdChild)|null,
 *     removeIcon: NdChild|null,
 *     props: GlobalAttributes
 * }, instance: FileDropzoneMode) => NdChild} template
 */
FileDropzoneMode.use = function(template) {
    FileDropzoneMode.defaultTemplate = template;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
FileDropzoneMode.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * @param {NdChild} text
 * @returns {this}
 */
FileDropzoneMode.prototype.text = function(text) {
    this.$description.text = text;
    return this;
};

/**
 * @param {NdChild} hint
 * @returns {this}
 */
FileDropzoneMode.prototype.hint = function(hint) {
    this.$description.hint = hint;
    return this;
};

/**
 * @param {string|number} value
 * @returns {this}
 */
FileDropzoneMode.prototype.height = function(value) {
    this.$description.height = value;
    return this;
};

/**
 * @param {(desc: *, instance: FileDropzoneMode) => NdChild} fn
 * @returns {this}
 */
FileDropzoneMode.prototype.renderZone = function(fn) {
    this.$description.renderZone = fn;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
FileDropzoneMode.prototype.removeIcon = function(icon) {
    this.$description.removeIcon = icon;
    return this;
};