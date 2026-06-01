import Validator from '../../utils/validator';
import { createFilter, createMultiSourceFilter } from './utils';
import DebugManager from '../debug-manager';

/**
 * Creates a filter that passes values strictly equal to the target.
 *
 * @param {*|ObservableItem} observableOrValue - Static value or observable to compare against
 * @returns {FilterResult}
 * @example
 * const statusFilter = equals('active');
 * users.where({ status: statusFilter });
 */
export function equals(observableOrValue){
    return createFilter(observableOrValue, (value, target) => value === target);
}

/**
 * Creates a filter that passes values not strictly equal to the target.
 *
 * @param {*|ObservableItem} observableOrValue - Static value or observable
 * @returns {FilterResult}
 */
export function notEquals(observableOrValue){
    return createFilter(observableOrValue, (value, target) => value !== target);
}

/**
 * Creates a filter that passes values greater than the target.
 *
 * @param {number|ObservableItem<number>} observableOrValue - Threshold value or observable
 * @returns {FilterResult}
 */
export function greaterThan(observableOrValue){
    return createFilter(observableOrValue, (value, target) => value > target);
}

/**
 * Creates a filter that passes values greater than or equal to the target.
 *
 * @param {number|ObservableItem<number>} observableOrValue - Threshold value or observable
 * @returns {FilterResult}
 */
export function greaterThanOrEqual(observableOrValue){
    return createFilter(observableOrValue, (value, target) => value >= target);
}

/**
 * Creates a filter that passes values less than the target.
 *
 * @param {number|ObservableItem<number>} observableOrValue - Threshold value or observable
 * @returns {FilterResult}
 */
export function lessThan(observableOrValue){
    return createFilter(observableOrValue, (value, target) => value < target);
}

/**
 * Creates a filter that passes values less than or equal to the target.
 *
 * @param {number|ObservableItem<number>} observableOrValue - Threshold value or observable
 * @returns {FilterResult}
 */
export function lessThanOrEqual(observableOrValue){
    return createFilter(observableOrValue, (value, target) => value <= target);
}

/**
 * Creates a filter that passes values between min and max (inclusive).
 * Both min and max can be static values or observables.
 *
 * @param {number|ObservableItem<number>} minObservableOrValue - Lower bound
 * @param {number|ObservableItem<number>} maxObservableOrValue - Upper bound
 * @returns {FilterResult}
 * @example
 * items.where({ age: between(18, 65) });
 */
export function between(minObservableOrValue, maxObservableOrValue){
    return createMultiSourceFilter(
        [minObservableOrValue, maxObservableOrValue],
        (value, [min, max]) => value >= min && value <= max,
    );
}

/**
 * Creates a filter that passes values included in the given array.
 *
 * @param {Array|ObservableItem<Array>} observableOrArray - Array to check membership in
 * @returns {FilterResult}
 * @example
 * items.where({ role: inArray(['admin', 'editor']) });
 */
export function inArray(observableOrArray){
    return createFilter(observableOrArray, (value, arr) => arr.includes(value));
}

/**
 * Creates a filter that passes values not included in the given array.
 *
 * @param {Array|ObservableItem<Array>} observableOrArray - Array to check exclusion from
 * @returns {FilterResult}
 */
export function notIn(observableOrArray){
    return createFilter(observableOrArray, (value, arr) => !arr.includes(value));
}

/**
 * Creates a filter that passes when the value is empty (null, undefined, empty string, or empty array).
 * Pass false as the argument to filter for non-empty values instead.
 *
 * @param {boolean|ObservableItem<boolean>} [observableOrValue=true] - If true, filters empty values; if false, filters non-empty
 * @returns {FilterResult}
 */
export function isEmpty(observableOrValue = true){
    return createFilter(observableOrValue, (value, shouldBeEmpty) => {
        const isActuallyEmpty = !value || value === '' ||
            (Array.isArray(value) && value.length === 0);

        return shouldBeEmpty ? isActuallyEmpty : !isActuallyEmpty;
    });
}

/**
 * Creates a filter that passes when the value is not empty.
 * Pass false as the argument to filter for empty values instead.
 *
 * @param {boolean|ObservableItem<boolean>} [observableOrValue=true] - If true, filters non-empty values
 * @returns {FilterResult}
 */
export function isNotEmpty(observableOrValue = true){
    return createFilter(observableOrValue, (value, shouldBeNotEmpty) => {
        const isActuallyNotEmpty = !!value && value !== '' &&
            (!Array.isArray(value) || value.length > 0);

        return shouldBeNotEmpty ? isActuallyNotEmpty : !isActuallyNotEmpty;
    });
}

/**
 * Creates a filter that tests the value against a pattern (string or regex).
 *
 * @param {string|RegExp|ObservableItem} patternObservableOrValue - Pattern to match against
 * @param {boolean|ObservableItem<boolean>} [asRegexObservableOrValue=true] - If true, treat pattern as a regex; if false, use case-insensitive substring match
 * @param {string|ObservableItem<string>} [flagsObservableOrValue=''] - Regex flags (e.g. 'i', 'g')
 * @returns {FilterResult}
 * @example
 * const search = Observable('john');
 * users.where({ name: match(search) }); // regex match, reactive
 * users.where({ name: match('john', false) }); // case-insensitive substring
 */
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
        },
    );
}

/**
 * Combines multiple filters with AND logic — all filters must pass.
 * Merges dependencies from all child filters automatically.
 *
 * @param {...FilterResult} filters - Filters to combine
 * @returns {FilterResult}
 * @example
 * items.where({ _: and(greaterThan(18), lessThan(65)) });
 */
export function and(...filters){
    const dependencies = filters
        .flatMap(f => f.dependencies ? (Array.isArray(f.dependencies) ? f.dependencies : [f.dependencies]) : [])
        .filter(Validator.isObservable);

    return {
        dependencies: dependencies.length > 0 ? dependencies : null,
        callback: (value) => filters.every(f => f.callback(value)),
    };
}

/**
 * Combines multiple filters with OR logic — at least one filter must pass.
 * Merges dependencies from all child filters automatically.
 *
 * @param {...FilterResult} filters - Filters to combine
 * @returns {FilterResult}
 * @example
 * items.where({ _: or(equals('admin'), equals('editor')) });
 */
export function or(...filters){
    const dependencies = filters
        .flatMap(f => f.dependencies ? (Array.isArray(f.dependencies) ? f.dependencies : [f.dependencies]) : [])
        .filter(Validator.isObservable);

    return {
        dependencies: dependencies.length > 0 ? dependencies : null,
        callback: (value) => filters.some(f => f.callback(value)),
    };
}

/**
 * Negates a filter — passes when the given filter does not pass.
 *
 * @param {FilterResult} filter - Filter to negate
 * @returns {FilterResult}
 * @example
 * items.where({ status: not(equals('deleted')) });
 */
export function not(filter){
    return {
        dependencies: filter.dependencies,
        callback: (value) => !filter.callback(value),
    };
}

/**
 * Creates a custom filter from a callback and a list of observable dependencies.
 * The callback receives the item value followed by the current values of all observables.
 *
 * @param {(value: *, ...depValues: any[]) => boolean} callbackFn - Filter function
 * @param {...ObservableItem} observables - Observable dependencies passed as extra arguments to callback
 * @returns {FilterResult}
 * @example
 * const minAge = Observable(18);
 * items.where({ age: custom((age, min) => age >= min, minAge) });
 */
export function custom(callbackFn, ...observables){
    const dependencies = observables.filter(Validator.isObservable);

    return {
        dependencies: dependencies.length > 0 ? dependencies : null,
        callback: (value) => {
            const values = observables.map(o =>
                Validator.isObservable(o) ? o.val() : o,
            );
            return callbackFn(value, ...values);
        },
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

