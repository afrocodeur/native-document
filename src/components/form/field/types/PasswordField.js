import {Validation} from "../../validation/Validation";
import StringField from "./StringField";

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

PasswordField.use = function(template) {
    PasswordField.defaultTemplate = template;
};

PasswordField.prototype = Object.create(StringField.prototype);
PasswordField.prototype.constructor = PasswordField;

PasswordField.prototype.strong = function(message) {
    const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return this.addRule(
        Validation.pattern,
        [strongPattern],
        message || 'Password must contain uppercase, lowercase, and number'
    );
};

PasswordField.prototype.containsNumber = function(message) {
    return this.addRule(
        Validation.pattern,
        [/\d/],
        message || 'Must contain at least one number'
    );
};

PasswordField.prototype.containsUppercase = function(message) {
    return this.addRule(
        Validation.pattern,
        [/[A-Z]/],
        message || 'Must contain at least one uppercase letter'
    );
};

PasswordField.prototype.containsLowercase = function(message) {
    return this.addRule(
        Validation.pattern,
        [/[a-z]/],
        message || 'Must contain at least one lowercase letter'
    );
};

PasswordField.prototype.containsSpecialChar = function(message) {
    return this.addRule(
        Validation.pattern,
        [/[!@#$%^&*(),.?":{}|<>]/],
        message || 'Must contain at least one special character'
    );
};

PasswordField.prototype.visibilityToggle = function(enabled = true, icons = {}) {
    this.$description.visibilityToggle = enabled;
    this.$description.visibilityIcons = {
        show: icons.show || '👁',
        hide: icons.hide || '🙈',
    };
    return this;
};
PasswordField.prototype.visibilityIcons = function(show, hide) {
    this.$description.visibilityIcons = {show, hide};
    return this;
};

PasswordField.prototype.showStrengthMeter = function(enabled = true) {
    this.$description.showStrengthMeter = enabled;
    return this;
};

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

PasswordField.prototype.same = function(fieldName, message) {
    return this.addRule(Validation.same, [fieldName], message || 'Passwords must match');
};

PasswordField.prototype.different = function(fieldName, message) {
    return this.addRule(Validation.different, [fieldName], message);
};