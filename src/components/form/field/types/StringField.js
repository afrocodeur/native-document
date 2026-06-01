import Field from "../../types/Field";
import {Validation} from "../../validation/Validation";

/**
 * Text input field. Base for all string-based field types (email, password, search, tel, url).
 * Inherits all Field methods (label, placeholder, required, model, clearable, etc.).
 * @example
 * const field = new StringField('username')
 *     .label(Span('Username'))
 *     .placeholder('Enter your username')
 *     .minLength(3, 'Too short')
 *     .maxLength(32)
 *     .alphaNumeric('Letters and numbers only')
 *     .required();
 *
 * StringField.use((description, instance) => {
 *     // description.name, description.type, description.label,
 *     // description.placeholder, description.value, description.errors...
 *     return Input({ type: description.type, placeholder: description.placeholder });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {string} [type='text']
 * @param {GlobalAttributes} [props={}]
 */
export default function StringField(name, type = 'text', props = {}) {
    if(!(this instanceof StringField)) {
        return new StringField(name, props);
    }

    Field.call(this, name, type, props);
}

StringField.defaultTemplate = null;

/**
 * Registers the render template for StringField.
 * @param {(description: {
 *     name: string,
 *     type: string,
 *     label: NdChild|null,
 *     placeholder: NdChild|null,
 *     help: NdChild|null,
 *     defaultValue: *,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     value: Observable<string>|null,
 *     clearable: boolean|Observable<boolean>|null,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     clearButtonIcon: NdChild|null,
 *     focus: Observable<boolean>,
 *     isDirty: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: StringField) => NdChild} template
 */
StringField.use = function(template) {
    StringField.defaultTemplate = template;
};

StringField.prototype = Object.create(Field.prototype);
StringField.prototype.constructor = StringField;

/**
 * @param {number} min
 * @param {string} [message]
 * @returns {this}
 */
StringField.prototype.minLength = function(min, message) {
    return this.addRule(Validation.minLength, [min], message);
};

/**
 * @param {number} max
 * @param {string} [message]
 * @returns {this}
 */
StringField.prototype.maxLength = function(max, message) {
    return this.addRule(Validation.maxLength, [max], message);
};

/**
 * @param {number} length
 * @param {string} [message]
 * @returns {this}
 */
StringField.prototype.length = function(length, message) {
    return this.addRule(Validation.length, [length], message);
};

/**
 * @param {RegExp} regex
 * @param {string} [message]
 * @returns {this}
 */
StringField.prototype.pattern = function(regex, message) {
    return this.addRule(Validation.pattern, [regex], message);
};

/**
 * @param {string} [message]
 * @returns {this}
 */
StringField.prototype.alphaOnly = function(message) {
    return this.addRule(Validation.alphaOnly, [], message);
};

/**
 * @param {string} [message]
 * @returns {this}
 */
StringField.prototype.numericOnly = function(message) {
    return this.addRule(Validation.numericOnly, [], message);
};

/**
 * @param {string} [message]
 * @returns {this}
 */
StringField.prototype.alphaNumeric = function(message) {
    return this.addRule(Validation.alphaNumeric, [], message);
};

/**
 * @param {string} [message]
 * @returns {this}
 */
StringField.prototype.noSpaces = function(message) {
    return this.addRule(Validation.noSpaces, [], message);
};

/**
 * @param {string} [message]
 * @returns {this}
 */
StringField.prototype.lowercase = function(message) {
    return this.addRule(Validation.lowercase, [], message);
};

/**
 * @param {string} [message]
 * @returns {this}
 */
StringField.prototype.uppercase = function(message) {
    return this.addRule(Validation.uppercase, [], message);
};
