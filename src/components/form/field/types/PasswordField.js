import {Validation} from "../../validation/Validation";
import StringField from "../../types/fields/StringField";

/**
 * Password input field. Extends StringField with strength rules, strength meter,
 * visibility toggle, and cross-field same/different validation.
 * @example
 * const field = new PasswordField('password')
 *     .label(Span('Password'))
 *     .strong()
 *     .showStrengthMeter(true)
 *     .visibilityToggle(true, { show: EyeIcon(), hide: EyeOffIcon() })
 *     .required();
 *
 * const confirm = new PasswordField('confirm')
 *     .label(Span('Confirm password'))
 *     .same('password', 'Passwords do not match');
 *
 * PasswordField.use((description, instance) => {
 *     // description.visibilityToggle, description.visibilityIcons,
 *     // description.showStrengthMeter, description.strengthLabels...
 *     return Input({ type: description.visibilityToggle ? 'text' : 'password' });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props={}]
 */
export default function PasswordField(name, props = {}) {
    if(!(this instanceof PasswordField)) {
        return new PasswordField(name, props);
    }

    StringField.call(this, name, 'password', props);
    Object.assign(this.$description, {
        visibilityToggle: false,
        showStrengthMeter: false,
        visibilityIcons: {},
        strengthLabels: null,
    });
}

PasswordField.defaultTemplate = null;

/**
 * Registers the render template for PasswordField.
 * @param {(description: {
 *     name: string,
 *     type: 'password',
 *     label: NdChild|null,
 *     value: Observable<string>|null,
 *     visibilityToggle: boolean,
 *     visibilityIcons: { show: NdChild, hide: NdChild },
 *     showStrengthMeter: boolean,
 *     strengthLabels: Record<number, string>|null,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: PasswordField) => NdChild} template
 */
PasswordField.use = function(template) {
    PasswordField.defaultTemplate = template;
};

PasswordField.prototype = Object.create(StringField.prototype);
PasswordField.prototype.constructor = PasswordField;

/**
 * Validates uppercase + lowercase + number, min 8 chars.
 * @param {string} [message]
 * @returns {this}
 */
PasswordField.prototype.strong = function(message) {
    const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return this.addRule(
        Validation.pattern,
        [strongPattern],
        message || 'Password must contain uppercase, lowercase, and number'
    );
};

/**
 * @param {string} [message]
 * @returns {this}
 */
PasswordField.prototype.containsNumber = function(message) {
    return this.addRule(
        Validation.pattern,
        [/\d/],
        message || 'Must contain at least one number'
    );
};

/**
 * @param {string} [message]
 * @returns {this}
 */
PasswordField.prototype.containsUppercase = function(message) {
    return this.addRule(
        Validation.pattern,
        [/[A-Z]/],
        message || 'Must contain at least one uppercase letter'
    );
};

/**
 * @param {string} [message]
 * @returns {this}
 */
PasswordField.prototype.containsLowercase = function(message) {
    return this.addRule(
        Validation.pattern,
        [/[a-z]/],
        message || 'Must contain at least one lowercase letter'
    );
};

/**
 * @param {string} [message]
 * @returns {this}
 */
PasswordField.prototype.containsSpecialChar = function(message) {
    return this.addRule(
        Validation.pattern,
        [/[!@#$%^&*(),.?":{}|<>]/],
        message || 'Must contain at least one special character'
    );
};

/**
 * @param {boolean} [enabled=true]
 * @param {{ show?: NdChild, hide?: NdChild }} [icons={}]
 * @returns {this}
 */
PasswordField.prototype.visibilityToggle = function(enabled = true, icons = {}) {
    this.$description.visibilityToggle = enabled;
    this.$description.visibilityIcons = {
        show: icons.show || '👁',
        hide: icons.hide || '🙈',
    };
    return this;
};

/**
 * @param {NdChild} show
 * @param {NdChild} hide
 * @returns {this}
 */
PasswordField.prototype.visibilityIcons = function(show, hide) {
    this.$description.visibilityIcons = {show, hide};
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
PasswordField.prototype.showStrengthMeter = function(enabled = true) {
    this.$description.showStrengthMeter = enabled;
    return this;
};

/**
 * @param {{ weak?: string, fair?: string, good?: string, strong?: string, veryStrong?: string }} [labels={}]
 * @returns {this}
 */
PasswordField.prototype.strengthLabels = function(labels = {}) {
    this.$description.strengthLabels = {
        0: labels[0] || '',
        1: labels[1] || 'Very weak',
        2: labels[2] || 'Weak',
        3: labels[3] || 'Fair',
        4: labels[4] || 'Strong',
        5: labels[5] || 'Very strong',
    };
    return this;
};

/**
 * Validates that this field equals the value of another field by name.
 * @param {string} fieldName
 * @param {string} [message]
 * @returns {this}
 */
PasswordField.prototype.same = function(fieldName, message) {
    return this.addRule(Validation.same, [fieldName], message || 'Passwords must match');
};

/**
 * Validates that this field differs from another field by name.
 * @param {string} fieldName
 * @param {string} [message]
 * @returns {this}
 */
PasswordField.prototype.different = function(fieldName, message) {
    return this.addRule(Validation.different, [fieldName], message);
};