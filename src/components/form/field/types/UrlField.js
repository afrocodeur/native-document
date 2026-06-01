import StringField from "../../types/fields/StringField";
import {Validation} from "../../validation/Validation";

/**
 * URL input field. Automatically validates URL format on creation.
 * Supports protocol and domain allowlist rules.
 * @example
 * const field = new UrlField('website')
 *     .label(Span('Website'))
 *     .protocol(['https'], 'HTTPS only')
 *     .domain(['example.com', 'example.org'])
 *     .required();
 *
 * UrlField.use((description, instance) => {
 *     // description.value, description.errors, description.label...
 *     return Input({ type: 'url', placeholder: 'https://' });
 * });
 */

/**
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props]
 */
export default function UrlField(name, props) {
    if(!(this instanceof UrlField)) {
        return new UrlField(name, props);
    }
    StringField.call(this, name, 'url', props);

    this.addRule(Validation.url, []);
}

UrlField.defaultTemplate = null;


/**
 * Registers the render template for UrlField.
 * @param {(description: {
 *     name: string,
 *     type: 'url',
 *     label: NdChild|null,
 *     placeholder: NdChild|null,
 *     value: Observable<string>|null,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: UrlField) => NdChild} template
 */
UrlField.use = function(template) {
    UrlField.defaultTemplate = template;
};

UrlField.prototype = Object.create(StringField.prototype);
UrlField.prototype.constructor = UrlField;


/**
 * Customises the URL validation message.
 * @param {string} message
 * @returns {this}
 */
UrlField.prototype.url = function(message) {
    const existingRule = this.$description.rules.find(r => r.fn === Validation.url);
    if (existingRule && message) {
        existingRule.message = message;
    }
    return this;
};


/**
 * @param {string[]} allowedProtocols - e.g. ['https', 'http']
 * @param {string} message
 * @returns {this}
 */
UrlField.prototype.protocol = function(allowedProtocols, message) {
    this.$description.rules.push({
        validate: (value) => {
            if (!value) return true;
            try {
                const url = new URL(value);
                return allowedProtocols.includes(url.protocol.replace(':', ''));
            } catch {
                return false;
            }
        },
        message: message || `Allowed protocols: ${allowedProtocols.join(', ')}`
    });
    return this;
};

/**
 * @param {string[]} allowedDomains
 * @param {string} message
 * @returns {this}
 */
UrlField.prototype.domain = function(allowedDomains, message) {
    this.$description.rules.push({
        validate: (value) => {
            if (!value) return true;
            try {
                const url = new URL(value);
                return allowedDomains.includes(url.hostname);
            } catch {
                return false;
            }
        },
        message: message || `Allowed domains: ${allowedDomains.join(', ')}`
    });
    return this;
};