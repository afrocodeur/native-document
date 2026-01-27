import Validator from "@src/core/utils/validator";

export function toDate(value) {
    if (value instanceof Date) return value;
    return new Date(value);
}

export function isSameDay(date1, date2) {
    const d1 = toDate(date1);
    const d2 = toDate(date2);
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

export function getSecondsOfDay(date) {
    const d = toDate(date);
    return (d.getHours() * 3600) + (d.getMinutes() * 60) + d.getSeconds();
}

export function createFilter(observableOrValue, callbackFn){
    const isObservable = Validator.isObservable(observableOrValue);

    return {
        dependencies: isObservable ? observableOrValue : null,
        callback: (value) => callbackFn(value, isObservable ? observableOrValue.val() : observableOrValue)
    };
}

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