import FileField from "./FileField";
import {Validation} from "../../validation/Validation";

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

ImageField.use = function(template) {
    ImageField.defaultTemplate = template;
};

ImageField.prototype = Object.create(FileField.prototype);
ImageField.prototype.constructor = ImageField;

ImageField.prototype.maxWidth = function(width) {
    this.$description.maxWidth = width;
    return this;
};

ImageField.prototype.maxHeight = function(height) {
    this.$description.maxHeight = height;
    return this;
};

ImageField.prototype.crop = function(enabled = true) {
    this.$description.crop = enabled;
    return this;
};

ImageField.prototype.dimensions = function(width, height, message) {
    return this.addRule(Validation.dimensions, [width, height], message);
};

ImageField.prototype.maxDimensions = function(width, height, message) {
    return this.addRule(Validation.maxDimensions, [width, height], message);
};

ImageField.prototype.minDimensions = function(width, height, message) {
    return this.addRule(Validation.minDimensions, [width, height], message);
};

ImageField.prototype.aspectRatio = function(ratio, message) {
    return this.addRule(Validation.aspectRatio, [ratio], message);
};