import Field from "../Field";
import {Validator} from "@core";

export default function CheckboxField(name, defaultConfig) {
    if(!(this instanceof CheckboxField)) {
        return new CheckboxField(name, defaultConfig);
    }

    Field.call(this, name, 'checkbox', defaultConfig);

    Object.assign(this.$description, {
        checked: false,
    });
}

CheckboxField.defaultTemplate = null;

CheckboxField.use = function(template) {
    CheckboxField.defaultTemplate = template.checkboxField;
};

CheckboxField.prototype = Object.create(Field.prototype);
CheckboxField.prototype.constructor = CheckboxField;

CheckboxField.prototype.model = function(observable) {
    this.$description.checked = observable;
    return this;
};

CheckboxField.prototype.checked = function() {
    const checked = this.$description.checked;
    if(Validator.isObservable(checked)) {
        return checked.val();
    }
    return checked;
};