import {Validation} from '../../validation/Validation';
import Field from '../../field/Field';

/**
 * Numeric input field. Supports min/max/between validation, integer, positive/negative,
 * multipleOf, decimal precision, step, and prefix/suffix display.
 * @example
 * const field = new NumberField('price')
 *     .label(Span('Price'))
 *     .min(0, 'Must be positive')
 *     .max(9999)
 *     .decimals(2)
 *     .prefix(Span('€'))
 *     .required();
 *
 * NumberField.use((description, instance) => {
 *     // description.name, description.step, description.decimals,
 *     // description.prefix, description.suffix, description.value...
 *     return Input({ type: 'number', step: description.step ?? 1 });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {string} [type='number']
 * @param {GlobalAttributes} [props={}]
 */
export default function NumberField(name, type = 'number', props = {}) {
    if(!(this instanceof NumberField)) {
        return new NumberField(name, type, props);
    }

    Field.call(this, name, type, props);

    Object.assign(this.$description, {
        ...this.$description,
        step: null,
        decimals: null,
        prefix: null,
        suffix: null,
    });
}

NumberField.defaultTemplate = null;

/**
 * Registers the render template for NumberField.
 * @param {(description: {
 *     name: string,
 *     type: string,
 *     label: NdChild|null,
 *     placeholder: NdChild|null,
 *     value: Observable<number>|null,
 *     step: number|null,
 *     decimals: number|null,
 *     prefix: NdChild|null,
 *     suffix: NdChild|null,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: NumberField) => NdChild} template
 */
NumberField.use = function(template) {
    NumberField.defaultTemplate = template;
};

NumberField.prototype = Object.create(Field.prototype);
NumberField.prototype.constructor = NumberField;

/**
 * @param {number} min
 * @param {string} [message]
 * @returns {this}
 */
NumberField.prototype.min = function(min, message) {
    return this.addRule(Validation.min, [min], message);
};

/**
 * @param {number} max
 * @param {string} [message]
 * @returns {this}
 */
NumberField.prototype.max = function(max, message) {
    return this.addRule(Validation.max, [max], message);
};

/**
 * @param {number} min
 * @param {number} max
 * @param {string} [message]
 * @returns {this}
 */
NumberField.prototype.between = function(min, max, message) {
    return this.addRule(Validation.between, [min, max], message);
};

/**
 * @param {string} [message]
 * @returns {this}
 */
NumberField.prototype.integer = function(message) {
    return this.addRule(Validation.integer, [], message);
};

/**
 * @param {string} [message]
 * @returns {this}
 */
NumberField.prototype.positive = function(message) {
    return this.addRule(Validation.positive, [], message);
};

/** Alias for positive() */
NumberField.prototype.unsigned = NumberField.prototype.positive;

/**
 * @param {string} [message]
 * @returns {this}
 */
NumberField.prototype.negative = function(message) {
    return this.addRule(Validation.negative, [], message);
};

/**
 * @param {number} n
 * @param {string} [message]
 * @returns {this}
 */
NumberField.prototype.multipleOf = function(n, message) {
    this.$description.rules.push({
        validate: (value) => {
            if (!value && value !== 0) return true;
            return Number(value) % n === 0;
        },
        message: message || `Must be a multiple of ${n}`,
    });
    return this;
};

/**
 * @param {number} value
 * @returns {this}
 */
NumberField.prototype.step = function(value) {
    this.$description.step = value;
    return this;
};

/**
 * @param {number} [value=2]
 * @returns {this}
 */
NumberField.prototype.decimals = function(value = 2) {
    this.$description.decimals = value;
    return this;
};

/**
 * @param {NdChild} text
 * @returns {this}
 */
NumberField.prototype.prefix = function(text) {
    this.$description.prefix = text;
    return this;
};

/**
 * @param {NdChild} text
 * @returns {this}
 */
NumberField.prototype.suffix = function(text) {
    this.$description.suffix = text;
    return this;
};