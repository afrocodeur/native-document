import Field from "../Field";
import {Validation} from "@components/form/validation/Validation";

export default function DateField(name, defaultConfig) {
    if(!(this instanceof DateField)) {
        return new DateField(name, defaultConfig);
    }

    Field.call(this, name, 'date', defaultConfig);

    Object.assign(this.$description, {
        format: 'YYYY-MM-DD',
        minDate: null,
        maxDate: null,
        disabledDates: [],
        picker: true
    });
}

DateField.defaultTemplate = null;

DateField.use = function(template) {
    DateField.defaultTemplate = template.dateField;
};

DateField.prototype = Object.create(Field.prototype);
DateField.prototype.constructor = DateField;

DateField.prototype.format = function(formatString) {
    this.$description.format = formatString;
    return this;
};

DateField.prototype.minDate = function(date) {
    this.$description.minDate = date;
    return this;
};

DateField.prototype.maxDate = function(date) {
    this.$description.maxDate = date;
    return this;
};

DateField.prototype.disabledDates = function(dates) {
    this.$description.disabledDates = dates;
    return this;
};

DateField.prototype.picker = function(enabled = true) {
    this.$description.picker = enabled;
    return this;
};

DateField.prototype.min = function(date, message) {
    return this.addRule(Validation.afterDate, [date], message);
};

DateField.prototype.max = function(date, message) {
    return this.addRule(Validation.beforeDate, [date], message);
};

DateField.prototype.between = function(startDate, endDate, message) {
    return this.addRule(Validation.betweenDates, [startDate, endDate], message);
};

DateField.prototype.after = function(date, message) {
    return this.addRule(Validation.afterDate, [date], message);
};

DateField.prototype.before = function(date, message) {
    return this.addRule(Validation.beforeDate, [date], message);
};