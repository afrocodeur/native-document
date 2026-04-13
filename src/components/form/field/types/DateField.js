import Field from "../Field";
import {Validation} from "../../validation/Validation";
import BaseComponent from "../../../BaseComponent";

export default function DateField(name, props = {}) {
    if(!(this instanceof DateField)) {
        return new DateField(name, props);
    }

    Field.call(this, name, 'date', props);

    Object.assign(this.$description, {
        format:         'YYYY-MM-DD',
        minDate:        null,
        maxDate:        null,
        disabledDates:  null,
        clearable:      false,
        withTime:       false,
        range:          false,
        firstDayOfWeek: 'monday',
        locale:         null,
        timeStep:       null,
        timezone:       null,
        valueStart:     null,
        valueEnd:       null,
        rangeSeparator:       null,
        props
    });
}

DateField.defaultTemplate = null;

DateField.use = function(template) {
    DateField.defaultTemplate = template;
};

DateField.prototype = Object.create(Field.prototype);
DateField.prototype.constructor = DateField;

DateField.prototype.rangeSeparator = function(rangeSeparator) {
    this.$description.rangeSeparator = rangeSeparator;
    return this;
};

DateField.prototype.format = function(formatString) {
    this.$description.format = formatString;
    return this;
};

DateField.prototype.minDate = function(date) {
    this.$description.minDate = BaseComponent.obs(date);
    return this;
};

DateField.prototype.maxDate = function(date) {
    this.$description.maxDate = BaseComponent.obs(date);
    return this;
};

DateField.prototype.disabledDates = function(dates) {
    this.$description.disabledDates = BaseComponent.obs(dates);
    return this;
};

DateField.prototype.withTime = function(enabled = true) {
    this.$description.withTime = BaseComponent.obs(enabled);
    return this;
};

DateField.prototype.range = function(enabled = true) {
    this.$description.range = BaseComponent.obs(enabled);
    return this;
};

DateField.prototype.mondayAsFirstDay = function() {
    this.$description.firstDayOfWeek = 'monday';
    return this;
};

DateField.prototype.sundayAsFirstDay = function() {
    this.$description.firstDayOfWeek = 'sunday';
    return this;
};

DateField.prototype.locale = function(locale) {
    this.$description.locale = locale;
    return this;
};

DateField.prototype.timeStep = function(secondes) {
    this.$description.timeStep = secondes;
    return this;
};

DateField.prototype.fromToday = function() {
    this.$description.minDate = BaseComponent.obs(new Date().toISOString().split('T')[0]);
    return this;
};

DateField.prototype.untilToday = function() {
    this.$description.maxDate = BaseComponent.obs(new Date().toISOString().split('T')[0]);
    return this;
};

DateField.prototype.timezone = function(tz) {
    this.$description.timezone = tz;
    return this;
};

DateField.prototype.useLocalTimezone = function() {
    this.$description.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return this;
};

DateField.prototype.modelStart = function(observable) {
    if(!this.$description.range) {
        console.warn('DateField: modelStart is only available in range mode');
    }
    this.$description.valueStart = observable;
    return this;
};

DateField.prototype.modelEnd = function(observable) {
    if(!this.$description.range) {
        console.warn('DateField: modelEnd is only available in range mode');
    }
    this.$description.valueEnd = observable;
    return this;
};

DateField.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};

DateField.prototype.onClear = function(handler) {
    this.on('clear', handler);
    return this;
};

// Validation
DateField.prototype.min = function(date, message) {
    return this.addRule(Validation.afterDate, [date], message);
};

DateField.prototype.max = function(date, message) {
    return this.addRule(Validation.beforeDate, [date], message);
};

DateField.prototype.between = function(startDate, endDate, message) {
    return this.addRule(Validation.betweenDates, [startDate, endDate], message);
};

DateField.prototype.before = function(date, message) {
    return this.addRule(Validation.beforeDate, [date], message);
};

DateField.prototype.weekday = function(message) {
    return this.addRule(Validation.weekday, [], message);
};

DateField.prototype.after = function(date, message) {
    return this.addRule(Validation.afterDate, [date], message);
};