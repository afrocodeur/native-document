import { ObservableOrValue, FilterResult } from './types';


export function equals<T>(
    observableOrValue: ObservableOrValue<T>
): FilterResult<T>;

export function notEquals<T>(
    observableOrValue: ObservableOrValue<T>
): FilterResult<T>;

export function greaterThan<T extends number | Date>(
    observableOrValue: ObservableOrValue<T>
): FilterResult<T>;

export function greaterThanOrEqual<T extends number | Date>(
    observableOrValue: ObservableOrValue<T>
): FilterResult<T>;

export function lessThan<T extends number | Date>(
    observableOrValue: ObservableOrValue<T>
): FilterResult<T>;

export function lessThanOrEqual<T extends number | Date>(
    observableOrValue: ObservableOrValue<T>
): FilterResult<T>;

export function between<T extends number | Date>(
    minObservableOrValue: ObservableOrValue<T>,
    maxObservableOrValue: ObservableOrValue<T>
): FilterResult<T>;

export function inArray<T>(
    observableOrArray: ObservableOrValue<T[]>
): FilterResult<T>;

export function notIn<T>(
    observableOrArray: ObservableOrValue<T[]>
): FilterResult<T>;

export function isEmpty(
    observableOrValue?: ObservableOrValue<boolean>
): FilterResult<ObservableOrValue<boolean>>;

export function isNotEmpty(
    observableOrValue?: ObservableOrValue<boolean>
): FilterResult<ObservableOrValue<boolean>>;

export function match(
    patternObservableOrValue: ObservableOrValue<string | RegExp>,
    asRegexObservableOrValue?: ObservableOrValue<boolean>,
    flagsObservableOrValue?: ObservableOrValue<string>
): FilterResult<string | RegExp>;

export function and<T>(...filters: FilterResult<T>[]): FilterResult<T>;

export function or<T>(...filters: FilterResult<T>[]): FilterResult<T>;

export function not<T>(filter: FilterResult<T>): FilterResult<T>;



export const gt: typeof greaterThan;
export const gte: typeof greaterThanOrEqual;
export const lt: typeof lessThan;
export const lte: typeof lessThanOrEqual;
export const eq: typeof equals;
export const neq: typeof notEquals;
export const all: typeof and;
export const any: typeof or;