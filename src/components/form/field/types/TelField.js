import StringField from "../../types/fields/StringField";
import {Validation} from "../../validation/Validation";

/**
 * Telephone input field. Supports phone format validation, country code prefix,
 * and mask patterns using # as digit placeholder.
 * @example
 * const field = new TelField('phone')
 *     .label(Span('Phone'))
 *     .countryCode(true)
 *     .mask('+33 ## ## ## ## ##')
 *     .required();
 *
 * TelField.use((description, instance) => {
 *     // description.countryCode, description.mask, description.value...
 *     return Input({ type: 'tel', placeholder: description.mask ?? undefined });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props]
 */
export default function TelField(name, props) {
    if(!(this instanceof TelField)) {
        return new TelField(name, props);
    }

    StringField.call(this, name, 'tel', props);

    Object.assign(this.$description, {
        countryCode: false,
        mask: null
    });
}

TelField.defaultTemplate = null;

/**
 * Registers the render template for TelField.
 * @param {(description: {
 *     name: string,
 *     type: 'tel',
 *     label: NdChild|null,
 *     placeholder: NdChild|null,
 *     value: Observable<string>|null,
 *     countryCode: boolean,
 *     mask: string|null,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: TelField) => NdChild} template
 */
TelField.use = function(template) {
    TelField.defaultTemplate = template;
};

TelField.prototype = Object.create(StringField.prototype);
TelField.prototype.constructor = TelField;

/**
 * @param {string} [message]
 * @returns {this}
 */
TelField.prototype.phone = function(message) {
    return this.addRule(Validation.phone, [], message);
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
TelField.prototype.countryCode = function(enabled = true) {
    this.$description.countryCode = enabled;
    return this;
};

/**
 * Applies a mask pattern using # as digit placeholder (e.g. '+33 ## ## ## ## ##').
 * Also registers a validation rule matching the pattern.
 * @param {string} pattern
 * @returns {this}
 */
TelField.prototype.mask = function(pattern) {
    this.$description.mask = pattern;

    const regex = pattern
        .replace(/[().\-\s+]/g, '\\$&')
        .replace(/#/g, '\\d');

    this.addRule(Validation.pattern, [new RegExp(`^${regex}$`)],
        `Invalid phone format. Expected: ${pattern}`
    );

    return this;
};