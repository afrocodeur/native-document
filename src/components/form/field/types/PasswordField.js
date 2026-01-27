import {Validation} from "@components/form/validation/Validation";
import StringField from "./StringField";

export default function PasswordField(name, defaultConfig) {
    if(!(this instanceof PasswordField)) {
        return new PasswordField(name, defaultConfig);
    }

    StringField.call(this, name, 'password', defaultConfig);
    Object.assign(this.$description, {
        visibilityToggle: false,
        showStrengthMeter: false
    });
}

PasswordField.defaultTemplate = null;

PasswordField.use = function(template) {
    PasswordField.defaultTemplate = template.passwordField;
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

PasswordField.prototype.visibilityToggle = function(enabled = true) {
    this.$description.visibilityToggle = enabled;
    return this;
};

PasswordField.prototype.showStrengthMeter = function(enabled = true) {
    this.$description.showStrengthMeter = enabled;
    return this;
};

PasswordField.prototype.same = function(fieldName, message) {
    return this.addRule(Validation.same, [fieldName], message || 'Passwords must match');
};

PasswordField.prototype.different = function(fieldName, message) {
    return this.addRule(Validation.different, [fieldName], message);
};