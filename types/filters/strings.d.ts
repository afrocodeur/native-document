import {FilterResult, ObservableOrValue} from './types';

export function contains(
    observableOrValue: ObservableOrValue<string>,
    caseSensitive?: boolean
): FilterResult<string>;

export function includes(
    observableOrValue: ObservableOrValue<string>,
    caseSensitive?: boolean
): FilterResult<string>;

export function startsWith(
    observableOrValue: ObservableOrValue<string>,
    caseSensitive?: boolean
): FilterResult<string>;

export function endsWith(
    observableOrValue: ObservableOrValue<string>,
    caseSensitive?: boolean
): FilterResult<string>;