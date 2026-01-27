import Field from "../Field";

export default function HiddenField(name, defaultConfig) {
    if(!(this instanceof HiddenField)) {
        return new HiddenField(name, defaultConfig);
    }

    Field.call(this, name, 'hidden', defaultConfig);
}

HiddenField.defaultTemplate = null;

HiddenField.use = function(template) {
    HiddenField.defaultTemplate = template.hiddenField;
};

HiddenField.prototype = Object.create(Field.prototype);
HiddenField.prototype.constructor = HiddenField;