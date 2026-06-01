import FileField from "../../types/fields/FileField";
import {Validation} from "../../validation/Validation";

/**
 * Image upload field. Extends FileField with image-specific validation:
 * dimensions, aspect ratio, max dimensions, min dimensions, and crop mode.
 * Automatically restricts accepted MIME types to jpeg, png, gif, webp.
 * @example
 * const field = new ImageField('avatar')
 *     .label(Span('Profile picture'))
 *     .maxSize(2 * 1024 * 1024, 'Max 2MB')
 *     .maxDimensions(1200, 1200, 'Max 1200x1200px')
 *     .aspectRatio(1, 'Must be square')
 *     .crop(true)
 *     .required();
 *
 * ImageField.use((description, instance) => {
 *     // description.maxWidth, description.maxHeight, description.crop,
 *     // description.files, description.multiple, description.accept...
 *     return Input({ type: 'file', accept: 'image/*' });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props]
 */
export default function ImageField(name, props) {
    if(!(this instanceof ImageField)) {
        return new ImageField(name, props);
    }

    FileField.call(this, name, 'image', props);

    Object.assign(this.$description, {
        maxWidth: null,
        maxHeight: null,
        crop: false
    });

    // Auto-apply image mime types
    this.accept(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
}

ImageField.defaultTemplate = null;

/**
 * Registers the render template for ImageField.
 * @param {(description: {
 *     name: string,
 *     type: 'image',
 *     label: NdChild|null,
 *     accept: string,
 *     multiple: boolean,
 *     mode: string|null,
 *     files: Observable<FileItemPreview[]>,
 *     maxWidth: number|null,
 *     maxHeight: number|null,
 *     crop: boolean,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: ImageField) => NdChild} template
 */
ImageField.use = function(template) {
    ImageField.defaultTemplate = template;
};

ImageField.prototype = Object.create(FileField.prototype);
ImageField.prototype.constructor = ImageField;

/**
 * @param {number} width - Max width in pixels
 * @returns {this}
 */
ImageField.prototype.maxWidth = function(width) {
    this.$description.maxWidth = width;
    return this;
};

/**
 * @param {number} height - Max height in pixels
 * @returns {this}
 */
ImageField.prototype.maxHeight = function(height) {
    this.$description.maxHeight = height;
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
ImageField.prototype.crop = function(enabled = true) {
    this.$description.crop = enabled;
    return this;
};

/**
 * @param {number} width
 * @param {number} height
 * @param {string} [message]
 * @returns {this}
 */
ImageField.prototype.dimensions = function(width, height, message) {
    return this.addRule(Validation.dimensions, [width, height], message);
};

/**
 * @param {number} width
 * @param {number} height
 * @param {string} [message]
 * @returns {this}
 */
ImageField.prototype.maxDimensions = function(width, height, message) {
    return this.addRule(Validation.maxDimensions, [width, height], message);
};

/**
 * @param {number} width
 * @param {number} height
 * @param {string} [message]
 * @returns {this}
 */
ImageField.prototype.minDimensions = function(width, height, message) {
    return this.addRule(Validation.minDimensions, [width, height], message);
};

/**
 * @param {number} ratio - e.g. 1 for square, 16/9 for widescreen
 * @param {string} [message]
 * @returns {this}
 */
ImageField.prototype.aspectRatio = function(ratio, message) {
    return this.addRule(Validation.aspectRatio, [ratio], message);
};