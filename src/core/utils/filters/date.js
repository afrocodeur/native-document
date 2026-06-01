import {createFilter, createMultiSourceFilter, getSecondsOfDay, isSameDay, toDate} from "./utils";

/**
 * Creates a filter that passes when the date value is on the same day as the target date.
 * Accepts Date objects, timestamps, or ISO strings.
 *
 * @param {Date|number|string|ObservableItem} observableOrValue - Target date to compare against
 * @returns {FilterResult}
 * @example
 * const today = new Date();
 * events.where({ date: dateEquals(today) });
 */
export const dateEquals = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return isSameDay(value, target);
    });
};

/**
 * Creates a filter that passes when the date value is strictly before the target date (day comparison).
 *
 * @param {Date|number|string|ObservableItem} observableOrValue - Target date
 * @returns {FilterResult}
 */
export const dateBefore = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return toDate(value) < toDate(target);
    });
};

/**
 * Creates a filter that passes when the date value is strictly after the target date (day comparison).
 *
 * @param {Date|number|string|ObservableItem} observableOrValue - Target date
 * @returns {FilterResult}
 */
export const dateAfter = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return toDate(value) > toDate(target);
    });
};

/**
 * Creates a filter that passes when the date value falls within the given date range (inclusive, day comparison).
 *
 * @param {Date|number|string|ObservableItem} startObservableOrValue - Start of the range
 * @param {Date|number|string|ObservableItem} endObservableOrValue - End of the range
 * @returns {FilterResult}
 * @example
 * events.where({ date: dateBetween(startDate, endDate) });
 */
export const dateBetween = (startObservableOrValue, endObservableOrValue) => {
    return createMultiSourceFilter(
        [startObservableOrValue, endObservableOrValue],
        (value, [start, end]) => {
            if (!value || !start || !end) return false;
            const date = toDate(value);
            return date >= toDate(start) && date <= toDate(end);
        }
    );
};

/**
 * Creates a filter that passes when the time component (HH:MM:SS) equals the target time.
 *
 * @param {Date|number|string|ObservableItem} observableOrValue - Target time
 * @returns {FilterResult}
 */
export const timeEquals = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        const d1 = toDate(value);
        const d2 = toDate(target);
        return d1.getHours() === d2.getHours() &&
            d1.getMinutes() === d2.getMinutes() &&
            d1.getSeconds() === d2.getSeconds();
    });
};

/**
 * Creates a filter that passes when the time component is strictly after the target time.
 *
 * @param {Date|number|string|ObservableItem} observableOrValue - Target time
 * @returns {FilterResult}
 */
export const timeAfter = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return getSecondsOfDay(value) > getSecondsOfDay(target);
    });
};

/**
 * Creates a filter that passes when the time component is strictly before the target time.
 *
 * @param {Date|number|string|ObservableItem} observableOrValue - Target time
 * @returns {FilterResult}
 */
export const timeBefore = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return getSecondsOfDay(value) < getSecondsOfDay(target);
    });
};

/**
 * Creates a filter that passes when the time component falls within the given time range (inclusive).
 *
 * @param {Date|number|string|ObservableItem} startObservableOrValue - Start time
 * @param {Date|number|string|ObservableItem} endObservableOrValue - End time
 * @returns {FilterResult}
 */
export const timeBetween = (startObservableOrValue, endObservableOrValue) => {
    return createMultiSourceFilter([startObservableOrValue, endObservableOrValue],
        (value, [start, end]) => {
            if (!value || !start || !end) return false;
            const date = getSecondsOfDay(value);
            return date >= getSecondsOfDay(start) && date <= getSecondsOfDay(end);
        }
    );
};

/**
 * Creates a filter that passes when the full datetime (date + time) equals the target exactly.
 *
 * @param {Date|number|string|ObservableItem} observableOrValue - Target datetime
 * @returns {FilterResult}
 */
export const dateTimeEquals = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return toDate(value).getTime() === toDate(target).getTime();
    });
};

/**
 * Creates a filter that passes when the full datetime is strictly after the target.
 *
 * @param {Date|number|string|ObservableItem} observableOrValue - Target datetime
 * @returns {FilterResult}
 */
export const dateTimeAfter = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return toDate(value) > toDate(target);
    });
};

/**
 * Creates a filter that passes when the full datetime is strictly before the target.
 *
 * @param {Date|number|string|ObservableItem} observableOrValue - Target datetime
 * @returns {FilterResult}
 */
export const dateTimeBefore = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return toDate(value) < toDate(target);
    });
};

/**
 * Creates a filter that passes when the full datetime falls within the given range (inclusive).
 *
 * @param {Date|number|string|ObservableItem} startObservableOrValue - Start of the range
 * @param {Date|number|string|ObservableItem} endObservableOrValue - End of the range
 * @returns {FilterResult}
 */
export const dateTimeBetween = (startObservableOrValue, endObservableOrValue) => {
    return createMultiSourceFilter([startObservableOrValue, endObservableOrValue], (value, [start, end]) => {
        if (!value || !start || !end) return false;
        const date = toDate(value);
        return date >= toDate(start) && date <= toDate(end);
    });
};