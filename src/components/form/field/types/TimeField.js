import Field from "../Field";
import {Validation} from "../../validation/Validation";
import BaseComponent from "../../../BaseComponent";

export default function TimeField(name, props = {}) {
    if(!(this instanceof TimeField)) {
        return new TimeField(name, props);
    }

    Field.call(this, name, 'time', props);

    Object.assign(this.$description, {
        format:         'HH:mm',
        step:           null,
        clearable:      false,
        range:          false,
        valueStart:     null,
        valueEnd:       null,
        rangeSeparator: null,
        props
    });
}

TimeField.defaultTemplate = null;

TimeField.use = function(template) {
    TimeField.defaultTemplate = template;
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

TimeField.prototype.clearable = function(enabled = true) {
    this.$description.clearable = BaseComponent.obs(enabled);
    return this;
};

TimeField.prototype.range = function(enabled = true) {
    this.$description.range = BaseComponent.obs(enabled);
    return this;
};

TimeField.prototype.modelStart = function(observable) {
    if(!this.$description.range) {
        console.warn('TimeField: modelStart is only available in range mode');
    }
    this.$description.valueStart = observable;
    return this;
};

TimeField.prototype.modelEnd = function(observable) {
    this.$description.valueEnd = observable;
    return this;
};

TimeField.prototype.rangeSeparator = function(sep) {
    this.$description.rangeSeparator = sep;
    return this;
};

TimeField.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};

TimeField.prototype.onClear = function(handler) {
    this.on('clear', handler);
    return this;
};

// Validation
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