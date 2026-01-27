import { ObservableItem } from '@src/core/data/observable';
import { FilterResult } from './types';

export type DateValue = Date | string | number | ObservableItem<Date | string | number>;

export function toDate(value: Date | string | number): Date;

export function isSameDay(date1: Date | string | number, date2: Date | string | number): boolean;

export function getSecondsOfDay(date: Date | string | number): number;

export function dateEquals(observableOrValue: DateValue): FilterResult<DateValue>;

export function dateBefore(observableOrValue: DateValue): FilterResult<DateValue>;

export function dateAfter(observableOrValue: DateValue): FilterResult<DateValue>;

export function dateBetween(
    startObservableOrValue: DateValue,
    endObservableOrValue: DateValue
): FilterResult<DateValue>;

export function timeEquals(observableOrValue: DateValue): FilterResult<DateValue>;

export function timeAfter(observableOrValue: DateValue): FilterResult<DateValue>;

export function timeBefore(observableOrValue: DateValue): FilterResult<DateValue>;

export function timeBetween(
    startObservableOrValue: DateValue,
    endObservableOrValue: DateValue
): FilterResult<DateValue>;

export function dateTimeEquals(observableOrValue: DateValue): FilterResult<DateValue>;

export function dateTimeAfter(observableOrValue: DateValue): FilterResult<DateValue>;

export function dateTimeBefore(observableOrValue: DateValue): FilterResult<DateValue>;

export function dateTimeBetween(
    startObservableOrValue: DateValue,
    endObservableOrValue: DateValue
): FilterResult<DateValue>;