import Field from '../../types/Field';
import {Validation} from '../../validation/Validation';

/**
 * Email input field. Automatically applies email format validation on creation.
 * Supports domain allowlist/blocklist rules.
 * @example
 * const field = new EmailField('email')
 *     .label(Span('Email'))
 *     .allowedDomain(['company.com'], 'Only company emails allowed')
 *     .required();
 *
 * EmailField.use((description, instance) => {
 *     // description.name, description.value, description.errors,
 *     // description.label, description.placeholder...
 *     return Input({ type: 'email', placeholder: description.placeholder });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [defaultConfig]
 */
export default function EmailField(name, defaultConfig) {
    if(!(this instanceof EmailField)) {
        return new EmailField(name, defaultConfig);
    }

    Field.call(this, name, 'email', defaultConfig);

    // Auto-apply email validation
    this.addRule(Validation.email, []);
}

EmailField.defaultTemplate = null;

/**
 * Registers the render template for EmailField.
 * @param {(description: {
 *     name: string,
 *     type: 'email',
 *     label: NdChild|null,
 *     placeholder: NdChild|null,
 *     value: Observable<string>|null,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: EmailField) => NdChild} template
 */
EmailField.use = function(template) {
    EmailField.defaultTemplate = template;
};

EmailField.prototype = Object.create(Field.prototype);
EmailField.prototype.constructor = EmailField;

/**
 * Customises the email format validation message.
 * @param {string} [message]
 * @returns {this}
 */
EmailField.prototype.email = function(message) {
    const existingRule = this.$description.rules.find(r => r.fn === Validation.email);
    if (existingRule && message) {
        existingRule.message = message;
    }
    return this;
};

/**
 * @param {string[]} allowedDomains
 * @param {string} [message]
 * @returns {this}
 */
EmailField.prototype.allowedDomain = function(allowedDomains, message) {
    this.$description.rules.push({
        validate: (value) => {
            if (!value) return true;
            const domain = value.split('@')[1];
            return allowedDomains.includes(domain);
        },
        message: message || `Allowed domains: ${allowedDomains.join(', ')}`,
    });
    return this;
};

/**
 * @param {string[]} blockedDomains
 * @param {string} [message]
 * @returns {this}
 */
EmailField.prototype.notAllowedDomain = function(blockedDomains, message) {
    this.$description.rules.push({
        validate: (value) => {
            if (!value) return true;
            const domain = value.split('@')[1];
            return !blockedDomains.includes(domain);
        },
        message: message || 'Domain not allowed',
    });
    return this;
};