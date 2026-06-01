import Validator from "../../utils/validator";

/**
 * Converts a value to a Date object. Returns the value as-is if it's already a Date.
 *
 * @param {Date|number|string} value - Value to convert
 * @returns {Date}
 */
export function toDate(value) {
    if (value instanceof Date) return value;
    return new Date(value);
}

/**
 * Returns true if two date values fall on the same calendar day (year, month, day).
 *
 * @param {Date|number|string} date1 - First date
 * @param {Date|number|string} date2 - Second date
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
    const d1 = toDate(date1);
    const d2 = toDate(date2);
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

/**
 * Returns the total number of seconds elapsed since midnight for the given date's time component.
 * Used internally for time range comparisons.
 *
 * @param {Date|number|string} date - Date value to extract time from
 * @returns {number} Seconds since midnight (0–86399)
 */
export function getSecondsOfDay(date) {
    const d = toDate(date);
    return (d.getHours() * 3600) + (d.getMinutes() * 60) + d.getSeconds();
}

/**
 * Creates a FilterResult from a single observable or static value and a comparison callback.
 * If the value is an observable, it is registered as a dependency so the filter reacts to changes.
 *
 * @param {*|ObservableItem} observableOrValue - Observable or static value used as the comparison target
 * @param {(value: *, target: *) => boolean} callbackFn - Filter function receiving (item value, target value)
 * @returns {{ dependencies: ObservableItem|null, callback: (value: *) => boolean }} FilterResult
 */
export function createFilter(observableOrValue, callbackFn){
    const isObservable = Validator.isObservable(observableOrValue);

    return {
        dependencies: isObservable ? observableOrValue : null,
        callback: (value) => callbackFn(value, isObservable ? observableOrValue.val() : observableOrValue)
    };
}

/**
 * Creates a FilterResult from multiple observable or static sources and a multi-value comparison callback.
 * All observable sources are registered as dependencies.
 *
 * @param {Array<*|ObservableItem>} sources - Array of observables or static values
 * @param {(value: *, targets: any[]) => boolean} callbackFn - Filter function receiving (item value, array of resolved source values)
 * @returns {{ dependencies: ObservableItem[]|null, callback: (value: *) => boolean }} FilterResult
 */
export function createMultiSourceFilter(sources, callbackFn){
    const observables = sources.filter(Validator.isObservable);

    const getValues = () => sources.map(src =>
        Validator.isObservable(src) ? src.val() : src
    );

    return {
        dependencies: observables.length > 0 ? observables : null,
        callback: (value) => callbackFn(value, getValues())
    };
}