import Field from "../Field";
import {Validation} from "@components/form/validation/Validation";

export default function TimeField(name, defaultConfig) {
    if(!(this instanceof TimeField)) {
        return new TimeField(name, defaultConfig);
    }

    Field.call(this, name, 'time', defaultConfig);

    Object.assign(this.$description, {
        format: 'HH:mm',
        step: null
    });
}

TimeField.defaultTemplate = null;

TimeField.use = function(template) {
    TimeField.defaultTemplate = template.timeField;
};

TimeField.prototype = Object.create(Field.prototype);
TimeField.prototype.constructor = TimeField;

TimeField.prototype.format = function(formatString) {
    this.$description.format = formatString;
    return this;
};

TimeField.prototype.step = function(seconds) {
    this.$description.step = seconds;
    return this;
};

TimeField.prototype.min = function(time, message) {
    return this.addRule(Validation.afterTime, [time], message);
};

TimeField.prototype.max = function(time, message) {
    return this.addRule(Validation.beforeTime, [time], message);
};

TimeField.prototype.between = function(startTime, endTime, message) {
    return this.addRule(Validation.betweenTimes, [startTime, endTime], message);
};

TimeField.prototype.after = function(time, message) {
    return this.addRule(Validation.afterTime, [time], message);
};

TimeField.prototype.before = function(time, message) {
    return this.addRule(Validation.beforeTime, [time], message);
};