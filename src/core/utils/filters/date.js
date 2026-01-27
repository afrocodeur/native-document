import {createFilter, createMultiSourceFilter, getSecondsOfDay, isSameDay, toDate} from "./utils";

export const dateEquals = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return isSameDay(value, target);
    });
};

export const dateBefore = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return toDate(value) < toDate(target);
    });
};

export const dateAfter = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return toDate(value) > toDate(target);
    });
};

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

export const timeAfter = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return getSecondsOfDay(value) > getSecondsOfDay(target);
    });
};

export const timeBefore = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return getSecondsOfDay(value) < getSecondsOfDay(target);
    });
};

export const timeBetween = (startObservableOrValue, endObservableOrValue) => {
    return createMultiSourceFilter([startObservableOrValue, endObservableOrValue],
        (value, [start, end]) => {
            if (!value || !start || !end) return false;
            const date = getSecondsOfDay(value);
            return date >= getSecondsOfDay(start) && date <= getSecondsOfDay(end);
        }
    );
};

export const dateTimeEquals = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return toDate(value).getTime() === toDate(target).getTime();
    });
};

export const dateTimeAfter = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return toDate(value) > toDate(target);
    });
};

export const dateTimeBefore = (observableOrValue) => {
    return createFilter(observableOrValue, (value, target) => {
        if (!value || !target) return false;
        return toDate(value) < toDate(target);
    });
};

export const dateTimeBetween = (startObservableOrValue, endObservableOrValue) => {
    return createMultiSourceFilter([startObservableOrValue, endObservableOrValue], (value, [start, end]) => {
        if (!value || !start || !end) return false;
        const date = toDate(value);
        return date >= toDate(start) && date <= toDate(end);
    });
};