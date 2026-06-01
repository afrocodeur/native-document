import Field from "../../types/Field";
import {Validation} from "../../validation/Validation";
import BaseComponent from "../../../BaseComponent";

/**
 * Time picker field with format, step, range mode, and time validation.
 * @example
 * const field = new TimeField('meetingTime')
 *     .label(Span('Meeting time'))
 *     .format('HH:mm')
 *     .step(900) // 15 minute steps
 *     .between('08:00', '18:00', 'Business hours only')
 *     .required();
 *
 * // Time range
 * const range = new TimeField('workingHours')
 *     .range(true)
 *     .modelStart(startObs)
 *     .modelEnd(endObs)
 *     .rangeSeparator(' - ');
 *
 * TimeField.use((description, instance) => {
 *     // description.format, description.step, description.range,
 *     // description.clearable, description.valueStart, description.valueEnd,
 *     // description.rangeSeparator...
 *     return Input({ type: 'time', step: description.step ?? undefined });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props={}]
 */
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


/**
 * Registers the render template for TimeField.
 * @param {(description: {
 *     name: string,
 *     type: 'time',
 *     label: NdChild|null,
 *     format: string,
 *     step: number|null,
 *     clearable: Observable<boolean>,
 *     range: Observable<boolean>,
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
 * }, instance: TimeField) => NdChild} template
 */
TimeField.use = function(template) {
    TimeField.defaultTemplate = template;
};

TimeField.prototype = Object.create(Field.prototype);
TimeField.prototype.constructor = TimeField;

/**
 * @param {string} formatString - e.g. 'HH:mm', 'HH:mm:ss'
 * @returns {this}
 */
TimeField.prototype.format = function(formatString) {
    this.$description.format = formatString;
    return this;
};

/**
 * @param {number} seconds - Step in seconds (e.g. 900 = 15 min)
 * @returns {this}
 */
TimeField.prototype.step = function(seconds) {
    this.$description.step = seconds;
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
TimeField.prototype.clearable = function(enabled = true) {
    this.$description.clearable = BaseComponent.obs(enabled);
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
TimeField.prototype.range = function(enabled = true) {
    this.$description.range = BaseComponent.obs(enabled);
    return this;
};

/**
 * Binds the start time in range mode to an observable.
 * @param {Observable<*>} observable
 * @returns {this}
 */
TimeField.prototype.modelStart = function(observable) {
    if(!this.$description.range) {
        console.warn('TimeField: modelStart is only available in range mode');
    }
    this.$description.valueStart = observable;
    return this;
};

/**
 * Binds the end time in range mode to an observable.
 * @param {Observable<*>} observable
 * @returns {this}
 */
TimeField.prototype.modelEnd = function(observable) {
    this.$description.valueEnd = observable;
    return this;
};

/**
 * @param {string} sep
 * @returns {this}
 */
TimeField.prototype.rangeSeparator = function(sep) {
    this.$description.rangeSeparator = sep;
    return this;
};

/**
 * @param {(value: *) => void} handler
 * @returns {this}
 */
TimeField.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};

/**
 * @param {() => void} handler
 * @returns {this}
 */
TimeField.prototype.onClear = function(handler) {
    this.on('clear', handler);
    return this;
};

// Validation
/**
 * @param {string} time - e.g. '08:00'
 * @param {string} [message]
 * @returns {this}
 */
TimeField.prototype.min = function(time, message) {
    return this.addRule(Validation.afterTime, [time], message);
};

/**
 * @param {string} time
 * @param {string} [message]
 * @returns {this}
 */
TimeField.prototype.max = function(time, message) {
    return this.addRule(Validation.beforeTime, [time], message);
};

/**
 * @param {string} startTime
 * @param {string} endTime
 * @param {string} [message]
 * @returns {this}
 */
TimeField.prototype.between = function(startTime, endTime, message) {
    return this.addRule(Validation.betweenTimes, [startTime, endTime], message);
};

/**
 * @param {string} time
 * @param {string} [message]
 * @returns {this}
 */
TimeField.prototype.after = function(time, message) {
    return this.addRule(Validation.afterTime, [time], message);
};

/**
 * @param {string} time
 * @param {string} [message]
 * @returns {this}
 */
TimeField.prototype.before = function(time, message) {
    return this.addRule(Validation.beforeTime, [time], message);
};