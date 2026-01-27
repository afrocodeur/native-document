import Field from "../Field";
import {Validation} from "@components/form/validation/Validation";

export default function StringField(name, type = 'text', defaultConfig = {}) {
    if(!(this instanceof StringField)) {
        return new StringField(name, defaultConfig);
    }

    Field.call(this, name, type, defaultConfig);
}

StringField.defaultTemplate = null;

StringField.use = function(template) {
    StringField.defaultTemplate = template.stringField;
};

StringField.prototype = Object.create(Field.prototype);
StringField.prototype.constructor = StringField;

StringField.prototype.minLength = function(min, message) {
    return this.addRule(Validation.minLength, [min], message);
};

StringField.prototype.maxLength = function(max, message) {
    return this.addRule(Validation.maxLength, [max], message);
};

StringField.prototype.length = function(length, message) {
    return this.addRule(Validation.length, [length], message);
};

StringField.prototype.pattern = function(regex, message) {
    return this.addRule(Validation.pattern, [regex], message);
};

StringField.prototype.alphaOnly = function(message) {
    return this.addRule(Validation.alphaOnly, [], message);
};

StringField.prototype.numericOnly = function(message) {
    return this.addRule(Validation.numericOnly, [], message);
};

StringField.prototype.alphaNumeric = function(message) {
    return this.addRule(Validation.alphaNumeric, [], message);
};

StringField.prototype.noSpaces = function(message) {
    return this.addRule(Validation.noSpaces, [], message);
};

StringField.prototype.lowercase = function(message) {
    return this.addRule(Validation.lowercase, [], message);
};

StringField.prototype.uppercase = function(message) {
    return this.addRule(Validation.uppercase, [], message);
};
