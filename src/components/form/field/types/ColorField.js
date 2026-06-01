// ColorField.js
import Field from "../../types/Field";
import {Validation} from "../../validation/Validation";

/**
 * Color picker field supporting hex, RGB, and HSL formats.
 * Optionally displays a preset color palette.
 * @example
 * const field = new ColorField('brandColor')
 *     .label(Span('Brand color'))
 *     .format('hex')
 *     .presets(['#FF0000', '#00FF00', '#0000FF'])
 *     .hex('Must be a valid hex color')
 *     .required();
 *
 * ColorField.use((description, instance) => {
 *     // description.format, description.presets
 *     return Input({ type: 'color' });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props]
 */
export default function ColorField(name, props) {
    if(!(this instanceof ColorField)) {
        return new ColorField(name, props);
    }

    Field.call(this, name, 'color', props);

    Object.assign(this.$description, {
        format: 'hex',
        presets: null
    });
}

ColorField.defaultTemplate = null;

/**
 * Registers the render template for ColorField.
 * @param {(description: {
 *     name: string,
 *     type: 'color',
 *     label: NdChild|null,
 *     value: Observable<string>|null,
 *     format: 'hex'|'rgb'|'hsl',
 *     presets: string[]|null,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: ColorField) => NdChild} template
 */
ColorField.use = function(template) {
    ColorField.defaultTemplate = template;
};

ColorField.prototype = Object.create(Field.prototype);
ColorField.prototype.constructor = ColorField;

/**
 * @param {'hex'|'rgb'|'hsl'} formatType
 * @returns {this}
 */
ColorField.prototype.format = function(formatType) {
    const allowedFormats = ['hex', 'rgb', 'hsl'];

    if (!allowedFormats.includes(formatType)) {
        throw new Error(`Invalid format "${formatType}". Must be one of: ${allowedFormats.join(', ')}`);
    }

    this.$description.format = formatType;
    return this;
};

/**
 * @param {string[]} colors
 * @returns {this}
 */
ColorField.prototype.presets = function(colors) {
    this.$description.presets = colors;
    return this;
};

/**
 * @param {string} [message]
 * @returns {this}
 */
ColorField.prototype.hex = function(message) {
    return this.addRule(Validation.hexColor, [], message);
};

/**
 * @param {string} [message]
 * @returns {this}
 */
ColorField.prototype.rgb = function(message) {
    return this.addRule(Validation.rgbColor, [], message);
};