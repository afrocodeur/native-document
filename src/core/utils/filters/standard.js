import Validator from "../../utils/validator";
import { createFilter, createMultiSourceFilter } from "./utils";
import DebugManager from "../debug-manager";


export function equals(observableOrValue){
    return createFilter(observableOrValue, (value, target) => value === target);
}

export function notEquals(observableOrValue){
    return createFilter(observableOrValue, (value, target) => value !== target);
}

export function greaterThan(observableOrValue){
    return createFilter(observableOrValue, (value, target) => value > target);
}

export function greaterThanOrEqual(observableOrValue){
    return createFilter(observableOrValue, (value, target) => value >= target);
}

export function lessThan(observableOrValue){
    return createFilter(observableOrValue, (value, target) => value < target);
}

export function lessThanOrEqual(observableOrValue){
    return createFilter(observableOrValue, (value, target) => value <= target);
}

export function between(minObservableOrValue, maxObservableOrValue){
    return createMultiSourceFilter(
        [minObservableOrValue, maxObservableOrValue],
        (value, [min, max]) => value >= min && value <= max
    );
}

export function inArray(observableOrArray){
    return createFilter(observableOrArray, (value, arr) => arr.includes(value));
}

export function notIn(observableOrArray){
    return createFilter(observableOrArray, (value, arr) => !arr.includes(value));
}

export function isEmpty(observableOrValue = true){
    return createFilter(observableOrValue, (value, shouldBeEmpty) => {
        const isActuallyEmpty = !value || value === '' ||
            (Array.isArray(value) && value.length === 0);

        return shouldBeEmpty ? isActuallyEmpty : !isActuallyEmpty;
    });
}

export function isNotEmpty(observableOrValue = true){
    return createFilter(observableOrValue, (value, shouldBeNotEmpty) => {
        const isActuallyNotEmpty = !!value && value !== '' &&
            (!Array.isArray(value) || value.length > 0);

        return shouldBeNotEmpty ? isActuallyNotEmpty : !isActuallyNotEmpty;
    });
}

export function match(patternObservableOrValue, asRegexObservableOrValue = true, flagsObservableOrValue = ''){
    return createMultiSourceFilter(
        [patternObservableOrValue, asRegexObservableOrValue, flagsObservableOrValue],
        (value, [pattern, asRegex, flags]) => {
            if (!pattern) return true;

            if (asRegex){
                try {
                    const regex = new RegExp(pattern, flags);
                    return regex.test(String(value));
                } catch (error){
                    DebugManager.warn('Invalid regex pattern:', pattern, error);
                    return false;
                }
            }

            if (!flags || flags === ''){
                return String(value).toLowerCase().includes(String(pattern).toLowerCase());
            }
            return String(value).includes(String(pattern));
        }
    );
}

export function and(...filters){
    const dependencies = filters
        .flatMap(f => f.dependencies ? (Array.isArray(f.dependencies) ? f.dependencies : [f.dependencies]) : [])
        .filter(Validator.isObservable);

    return {
        dependencies: dependencies.length > 0 ? dependencies : null,
        callback: (value) => filters.every(f => f.callback(value))
    };
}

export function or(...filters){
    const dependencies = filters
        .flatMap(f => f.dependencies ? (Array.isArray(f.dependencies) ? f.dependencies : [f.dependencies]) : [])
        .filter(Validator.isObservable);

    return {
        dependencies: dependencies.length > 0 ? dependencies : null,
        callback: (value) => filters.some(f => f.callback(value))
    };
}

export function not(filter){
    return {
        dependencies: filter.dependencies,
        callback: (value) => !filter.callback(value)
    };
}

export function custom(callbackFn, ...observables){
    const dependencies = observables.filter(Validator.isObservable);

    return {
        dependencies: dependencies.length > 0 ? dependencies : null,
        callback: (value) => {
            const values = observables.map(o =>
                Validator.isObservable(o) ? o.val() : o
            );
            return callbackFn(value, ...values);
        }
    };
}

export const gt = greaterThan;
export const gte = greaterThanOrEqual;
export const lt = lessThan;
export const lte = lessThanOrEqual;
export const eq = equals;
export const neq = notEquals;
export const all = and;
export const any = or;

