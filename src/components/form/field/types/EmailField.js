import Field from "../Field";
import {Validation} from "../../validation/Validation";

export default function EmailField(name, defaultConfig) {
    if(!(this instanceof EmailField)) {
        return new EmailField(name, defaultConfig);
    }

    Field.call(this, name, 'email', defaultConfig);

    // Auto-apply email validation
    this.addRule(Validation.email, []);
}

EmailField.defaultTemplate = null;

EmailField.use = function(template) {
    EmailField.defaultTemplate = template;
};

EmailField.prototype = Object.create(Field.prototype);
EmailField.prototype.constructor = EmailField;

EmailField.prototype.email = function(message) {
    const existingRule = this.$description.rules.find(r => r.fn === Validation.email);
    if (existingRule && message) {
        existingRule.message = message;
    }
    return this;
};

EmailField.prototype.allowedDomain = function(allowedDomains, message) {
    this.$description.rules.push({
        validate: (value) => {
            if (!value) return true;
            const domain = value.split('@')[1];
            return allowedDomains.includes(domain);
        },
        message: message || `Allowed domains: ${allowedDomains.join(', ')}`
    });
    return this;
};

EmailField.prototype.notAllowedDomain = function(blockedDomains, message) {
    this.$description.rules.push({
        validate: (value) => {
            if (!value) return true;
            const domain = value.split('@')[1];
            return !blockedDomains.includes(domain);
        },
        message: message || `Domain not allowed`
    });
    return this;
};