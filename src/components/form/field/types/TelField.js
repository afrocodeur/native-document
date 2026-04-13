import StringField from "./StringField";
import {Validation} from "../../validation/Validation";

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

TelField.use = function(template) {
    TelField.defaultTemplate = template;
};

TelField.prototype = Object.create(StringField.prototype);
TelField.prototype.constructor = TelField;

TelField.prototype.phone = function(message) {
    return this.addRule(Validation.phone, [], message);
};

TelField.prototype.countryCode = function(enabled = true) {
    this.$description.countryCode = enabled;
    return this;
};

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