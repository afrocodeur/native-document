import Field from '../../types/Field';
import {Validation} from '../../validation/Validation';
import BaseComponent from '../../../BaseComponent';

/**
 * Date picker field with format, min/max, disabled dates, range mode, timezone,
 * and locale support. Use modelStart/modelEnd for range mode.
 * @example
 * const field = new DateField('birthdate')
 *     .label(Span('Date of birth'))
 *     .format('DD/MM/YYYY')
 *     .untilToday()
 *     .required();
 *
 * // Date range
 * const range = new DateField('period')
 *     .range(true)
 *     .modelStart(startObs)
 *     .modelEnd(endObs)
 *     .rangeSeparator(' to ');
 *
 * DateField.use((description, instance) => {
 *     // description.format, description.minDate, description.maxDate,
 *     // description.disabledDates, description.range, description.withTime,
 *     // description.firstDayOfWeek, description.locale, description.timezone,
 *     // description.valueStart, description.valueEnd, description.rangeSeparator...
 *     return Input({ type: 'text', placeholder: description.format });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props={}]
 */
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
        props,
    });
}

DateField.defaultTemplate = null;

/**
 * Registers the render template for DateField.
 * @param {(description: {
 *     name: string,
 *     type: 'date',
 *     label: NdChild|null,
 *     format: string,
 *     minDate: Observable<string|Date>|null,
 *     maxDate: Observable<string|Date>|null,
 *     disabledDates: Observable<(string|Date)[]>|null,
 *     clearable: boolean,
 *     withTime: Observable<boolean>,
 *     range: Observable<boolean>,
 *     firstDayOfWeek: 'monday'|'sunday',
 *     locale: string|null,
 *     timeStep: number|null,
 *     timezone: string|null,
 *     valueStart: Observable<*>|null,
 *     valueEnd: Observable<*>|null,
 *     rangeSeparator: string|null,
 *     value: Observable<*>|null,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: DateField) => NdChild} template
 */
DateField.use = function(template) {
    DateField.defaultTemplate = template;
};

DateField.prototype = Object.create(Field.prototype);
DateField.prototype.constructor = DateField;

/**
 * @param {string} rangeSeparator
 * @returns {this}
 */
DateField.prototype.rangeSeparator = function(rangeSeparator) {
    this.$description.rangeSeparator = rangeSeparator;
    return this;
};

/**
 * @param {string} formatString - e.g. 'YYYY-MM-DD', 'DD/MM/YYYY'
 * @returns {this}
 */
DateField.prototype.format = function(formatString) {
    this.$description.format = formatString;
    return this;
};

/**
 * @param {Date|string} date
 * @returns {this}
 */
DateField.prototype.minDate = function(date) {
    this.$description.minDate = BaseComponent.obs(date);
    return this;
};

/**
 * @param {Date|string} date
 * @returns {this}
 */
DateField.prototype.maxDate = function(date) {
    this.$description.maxDate = BaseComponent.obs(date);
    return this;
};

/**
 * @param {(Date|string)[]} dates
 * @returns {this}
 */
DateField.prototype.disabledDates = function(dates) {
    this.$description.disabledDates = BaseComponent.obs(dates);
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
DateField.prototype.withTime = function(enabled = true) {
    this.$description.withTime = BaseComponent.obs(enabled);
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
DateField.prototype.range = function(enabled = true) {
    this.$description.range = BaseComponent.obs(enabled);
    return this;
};

/** @returns {this} */
DateField.prototype.mondayAsFirstDay = function() {
    this.$description.firstDayOfWeek = 'monday';
    return this;
};

/** @returns {this} */
DateField.prototype.sundayAsFirstDay = function() {
    this.$description.firstDayOfWeek = 'sunday';
    return this;
};

/**
 * @param {string} locale - BCP 47 locale tag (e.g. 'fr-FR', 'en-US')
 * @returns {this}
 */
DateField.prototype.locale = function(locale) {
    this.$description.locale = locale;
    return this;
};

/**
 * @param {number} secondes - Step in seconds for time picker
 * @returns {this}
 */
DateField.prototype.timeStep = function(secondes) {
    this.$description.timeStep = secondes;
    return this;
};

/** Sets minDate to today. @returns {this} */
DateField.prototype.fromToday = function() {
    this.$description.minDate = BaseComponent.obs(new Date().toISOString().split('T')[0]);
    return this;
};

/** Sets maxDate to today. @returns {this} */
DateField.prototype.untilToday = function() {
    this.$description.maxDate = BaseComponent.obs(new Date().toISOString().split('T')[0]);
    return this;
};

/**
 * @param {string} tz - IANA timezone (e.g. 'Europe/Paris')
 * @returns {this}
 */
DateField.prototype.timezone = function(tz) {
    this.$description.timezone = tz;
    return this;
};

/** Uses the browser's local timezone. @returns {this} */
DateField.prototype.useLocalTimezone = function() {
    this.$description.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return this;
};

/**
 * Binds the start date in range mode to an observable.
 * @param {Observable<*>} observable
 * @returns {this}
 */
DateField.prototype.modelStart = function(observable) {
    if(!this.$description.range) {
        console.warn('DateField: modelStart is only available in range mode');
    }
    this.$description.valueStart = observable;
    return this;
};

/**
 * Binds the end date in range mode to an observable.
 * @param {Observable<*>} observable
 * @returns {this}
 */
DateField.prototype.modelEnd = function(observable) {
    if(!this.$description.range) {
        console.warn('DateField: modelEnd is only available in range mode');
    }
    this.$description.valueEnd = observable;
    return this;
};

/**
 * @param {(date: *) => void} handler
 * @returns {this}
 */
DateField.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};

/**
 * @param {() => void} handler
 * @returns {this}
 */
DateField.prototype.onClear = function(handler) {
    this.on('clear', handler);
    return this;
};

// Validation
/**
 * @param {Date|string} date
 * @param {string} [message]
 * @returns {this}
 */
DateField.prototype.min = function(date, message) {
    return this.addRule(Validation.afterDate, [date], message);
};

/**
 * @param {Date|string} date
 * @param {string} [message]
 * @returns {this}
 */
DateField.prototype.max = function(date, message) {
    return this.addRule(Validation.beforeDate, [date], message);
};

/**
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 * @param {string} [message]
 * @returns {this}
 */
DateField.prototype.between = function(startDate, endDate, message) {
    return this.addRule(Validation.betweenDates, [startDate, endDate], message);
};

/**
 * @param {Date|string} date
 * @param {string} [message]
 * @returns {this}
 */
DateField.prototype.before = function(date, message) {
    return this.addRule(Validation.beforeDate, [date], message);
};

/**
 * @param {string} [message]
 * @returns {this}
 */
DateField.prototype.weekday = function(message) {
    return this.addRule(Validation.weekday, [], message);
};

/**
 * @param {Date|string} date
 * @param {string} [message]
 * @returns {this}
 */
DateField.prototype.after = function(date, message) {
    return this.addRule(Validation.afterDate, [date], message);
};