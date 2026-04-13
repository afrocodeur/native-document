// ColorField.js
import Field from "../Field";
import {Validation} from "../../validation/Validation";

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

ColorField.use = function(template) {
    ColorField.defaultTemplate = template;
};

ColorField.prototype = Object.create(Field.prototype);
ColorField.prototype.constructor = ColorField;

ColorField.prototype.format = function(formatType) {
    const allowedFormats = ['hex', 'rgb', 'hsl'];

    if (!allowedFormats.includes(formatType)) {
        throw new Error(`Invalid format "${formatType}". Must be one of: ${allowedFormats.join(', ')}`);
    }

    this.$description.format = formatType;
    return this;
};

ColorField.prototype.presets = function(colors) {
    this.$description.presets = colors;
    return this;
};

ColorField.prototype.hex = function(message) {
    return this.addRule(Validation.hexColor, [], message);
};

ColorField.prototype.rgb = function(message) {
    return this.addRule(Validation.rgbColor, [], message);
};