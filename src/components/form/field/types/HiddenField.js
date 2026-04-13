import Field from "../Field";

export default function HiddenField(name, props) {
    if(!(this instanceof HiddenField)) {
        return new HiddenField(name, props);
    }

    Field.call(this, name, 'hidden', props);
}

HiddenField.defaultTemplate = null;

HiddenField.use = function(template) {
    HiddenField.defaultTemplate = template;
};

HiddenField.prototype = Object.create(Field.prototype);
HiddenField.prototype.constructor = HiddenField;