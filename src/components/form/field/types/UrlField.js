import StringField from "./StringField";
import {Validation} from "../../validation/Validation";

export default function UrlField(name, props) {
    if(!(this instanceof UrlField)) {
        return new UrlField(name, props);
    }
    StringField.call(this, name, 'url', props);

    this.addRule(Validation.url, []);
}

UrlField.defaultTemplate = null;

UrlField.use = function(template) {
    UrlField.defaultTemplate = template;
};

UrlField.prototype = Object.create(StringField.prototype);
UrlField.prototype.constructor = UrlField;

UrlField.prototype.url = function(message) {
    const existingRule = this.$description.rules.find(r => r.fn === Validation.url);
    if (existingRule && message) {
        existingRule.message = message;
    }
    return this;
};

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