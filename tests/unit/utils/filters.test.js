import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../src/core/utils/debug-manager', () => ({
    default: { log: vi.fn(), warn: vi.fn(), error: vi.fn(), disable: vi.fn() },
}));
import { Observable } from '../../../src/core/data/Observable';
import {
    equals, notEquals,
    greaterThan, greaterThanOrEqual,
    lessThan, lessThanOrEqual,
    between,
    inArray, notIn,
    isEmpty, isNotEmpty,
    match,
    and, or, not,
    custom,
    gt, gte, lt, lte, eq, neq,
} from '../../../src/core/utils/filters/standard';
import {
    includes, contains, startsWith, endsWith,
} from '../../../src/core/utils/filters/strings';
import {
    dateEquals, dateBefore, dateAfter, dateBetween,
    timeEquals, timeAfter, timeBefore, timeBetween,
    dateTimeEquals, dateTimeAfter, dateTimeBefore, dateTimeBetween,
} from '../../../src/core/utils/filters/date';
import { createFilter, createMultiSourceFilter } from '../../../src/core/utils/filters/utils';

const run = (filter, value) => filter.callback(value);

describe('Filters', () => {

    // -- equals / notEquals ---------------------------------------------------

    describe('equals() / notEquals()', () => {
        it('equals passes when values match', () => {
            expect(run(equals('active'), 'active')).toBe(true);
        });

        it('equals fails when values differ', () => {
            expect(run(equals('active'), 'inactive')).toBe(false);
        });

        it('notEquals passes when values differ', () => {
            expect(run(notEquals('deleted'), 'active')).toBe(true);
        });

        it('notEquals fails when values match', () => {
            expect(run(notEquals('deleted'), 'deleted')).toBe(false);
        });

        it('eq is an alias for equals', () => {
            expect(run(eq(1), 1)).toBe(true);
        });

        it('neq is an alias for notEquals', () => {
            expect(run(neq(1), 2)).toBe(true);
        });

        it('equals with Observable target', () => {
            const status = Observable('active');
            const filter = equals(status);
            expect(run(filter, 'active')).toBe(true);
            status.set('inactive');
            expect(run(filter, 'active')).toBe(false);
        });
    });

    // -- greaterThan / lessThan -----------------------------------------------

    describe('greaterThan / lessThan / between', () => {
        it('greaterThan passes when value > target', () => {
            expect(run(greaterThan(5), 6)).toBe(true);
            expect(run(greaterThan(5), 5)).toBe(false);
        });

        it('greaterThanOrEqual passes when value >= target', () => {
            expect(run(greaterThanOrEqual(5), 5)).toBe(true);
            expect(run(greaterThanOrEqual(5), 4)).toBe(false);
        });

        it('lessThan passes when value < target', () => {
            expect(run(lessThan(5), 4)).toBe(true);
            expect(run(lessThan(5), 5)).toBe(false);
        });

        it('lessThanOrEqual passes when value <= target', () => {
            expect(run(lessThanOrEqual(5), 5)).toBe(true);
            expect(run(lessThanOrEqual(5), 6)).toBe(false);
        });

        it('between passes when value is within range (inclusive)', () => {
            expect(run(between(1, 10), 5)).toBe(true);
            expect(run(between(1, 10), 1)).toBe(true);
            expect(run(between(1, 10), 10)).toBe(true);
            expect(run(between(1, 10), 11)).toBe(false);
        });

        it('gt, gte, lt, lte are aliases', () => {
            expect(run(gt(5), 6)).toBe(true);
            expect(run(gte(5), 5)).toBe(true);
            expect(run(lt(5), 4)).toBe(true);
            expect(run(lte(5), 5)).toBe(true);
        });
    });

    // -- inArray / notIn ------------------------------------------------------

    describe('inArray() / notIn()', () => {
        it('inArray passes when value is in the array', () => {
            expect(run(inArray(['a', 'b', 'c']), 'b')).toBe(true);
            expect(run(inArray(['a', 'b', 'c']), 'd')).toBe(false);
        });

        it('notIn passes when value is not in the array', () => {
            expect(run(notIn(['a', 'b']), 'c')).toBe(true);
            expect(run(notIn(['a', 'b']), 'a')).toBe(false);
        });

        it('inArray with Observable array', () => {
            const allowed = Observable(['admin', 'editor']);
            const filter  = inArray(allowed);
            expect(run(filter, 'admin')).toBe(true);
            allowed.set(['viewer']);
            expect(run(filter, 'admin')).toBe(false);
        });
    });

    // -- isEmpty / isNotEmpty -------------------------------------------------

    describe('isEmpty() / isNotEmpty()', () => {
        it('isEmpty passes for null', () => {
            expect(run(isEmpty(), null)).toBe(true);
        });

        it('isEmpty passes for empty string', () => {
            expect(run(isEmpty(), '')).toBe(true);
        });

        it('isEmpty passes for empty array', () => {
            expect(run(isEmpty(), [])).toBe(true);
        });

        it('isEmpty fails for non-empty value', () => {
            expect(run(isEmpty(), 'hello')).toBe(false);
        });

        it('isEmpty(false) passes for non-empty value', () => {
            expect(run(isEmpty(false), 'hello')).toBe(true);
        });

        it('isNotEmpty passes for non-empty string', () => {
            expect(run(isNotEmpty(), 'hello')).toBe(true);
        });

        it('isNotEmpty fails for null', () => {
            expect(run(isNotEmpty(), null)).toBe(false);
        });
    });

    // -- match() --------------------------------------------------------------

    describe('match()', () => {
        it('matches with regex pattern', () => {
            expect(run(match('^hello'), 'hello world')).toBe(true);
            expect(run(match('^world'), 'hello world')).toBe(false);
        });

        it('passes when pattern is empty', () => {
            expect(run(match(''), 'anything')).toBe(true);
        });

        it('substring match when asRegex=false', () => {
            expect(run(match('john', false), 'John Doe')).toBe(true);
            expect(run(match('jane', false), 'John Doe')).toBe(false);
        });

        it('supports regex flags', () => {
            expect(run(match('HELLO', true, 'i'), 'hello world')).toBe(true);
        });

        it('returns false for invalid regex (does not throw)', () => {
            expect(run(match('[invalid'), 'test')).toBe(false);
        });
    });

    // -- and() / or() / not() -------------------------------------------------

    describe('and() / or() / not()', () => {
        it('and passes when all filters pass', () => {
            const f = and(greaterThan(0), lessThan(10));
            expect(run(f, 5)).toBe(true);
            expect(run(f, 10)).toBe(false);
        });

        it('and fails when any filter fails', () => {
            const f = and(greaterThan(0), lessThan(10));
            expect(run(f, -1)).toBe(false);
        });

        it('or passes when at least one filter passes', () => {
            const f = or(equals('admin'), equals('editor'));
            expect(run(f, 'editor')).toBe(true);
            expect(run(f, 'viewer')).toBe(false);
        });

        it('not negates a filter', () => {
            const f = not(equals('deleted'));
            expect(run(f, 'active')).toBe(true);
            expect(run(f, 'deleted')).toBe(false);
        });

        it('and merges dependencies from child filters', () => {
            const obs = Observable(5);
            const f   = and(greaterThan(obs), lessThan(100));
            expect(f.dependencies).not.toBeNull();
        });

        it('or merges dependencies from child filters', () => {
            const obs = Observable('admin');
            const f   = or(equals(obs), equals('editor'));
            expect(f.dependencies).not.toBeNull();
        });
    });

    // -- custom() -------------------------------------------------------------

    describe('custom()', () => {
        it('passes custom callback result', () => {
            const f = custom((value) => value > 10);
            expect(run(f, 15)).toBe(true);
            expect(run(f, 5)).toBe(false);
        });

        it('receives observable values as extra args', () => {
            const min = Observable(5);
            const f   = custom((value, minVal) => value >= minVal, min);
            expect(run(f, 5)).toBe(true);
            min.set(10);
            expect(run(f, 5)).toBe(false);
        });

        it('has dependencies when observables are passed', () => {
            const obs = Observable(1);
            const f   = custom((v) => v > 0, obs);
            expect(f.dependencies).toContain(obs);
        });
    });

    // -- strings: includes / startsWith / endsWith ----------------------------

    describe('String filters', () => {
        it('includes passes for substring (case-insensitive)', () => {
            expect(run(includes('john'), 'John Doe')).toBe(true);
            expect(run(includes('jane'), 'John Doe')).toBe(false);
        });

        it('includes case-sensitive mode', () => {
            expect(run(includes('John', true), 'John Doe')).toBe(true);
            expect(run(includes('john', true), 'John Doe')).toBe(false);
        });

        it('contains is an alias for includes', () => {
            expect(run(contains('john'), 'John Doe')).toBe(true);
        });

        it('startsWith passes for matching prefix', () => {
            expect(run(startsWith('Jo'), 'John Doe')).toBe(true);
            expect(run(startsWith('Do'), 'John Doe')).toBe(false);
        });

        it('endsWith passes for matching suffix', () => {
            expect(run(endsWith('.js'), 'index.js')).toBe(true);
            expect(run(endsWith('.ts'), 'index.js')).toBe(false);
        });

        it('startsWith passes when query is empty', () => {
            expect(run(startsWith(''), 'anything')).toBe(true);
        });

        it('endsWith passes when query is empty', () => {
            expect(run(endsWith(''), 'anything')).toBe(true);
        });
    });

    // -- date filters ---------------------------------------------------------

    describe('Date filters', () => {
        const d1 = new Date('2024-01-15');
        const d2 = new Date('2024-01-20');
        const d3 = new Date('2024-01-25');

        it('dateEquals passes on same day', () => {
            expect(run(dateEquals(d2), new Date('2024-01-20'))).toBe(true);
        });

        it('dateEquals fails on different day', () => {
            expect(run(dateEquals(d2), d1)).toBe(false);
        });

        it('dateBefore passes when value is before target', () => {
            expect(run(dateBefore(d2), d1)).toBe(true);
            expect(run(dateBefore(d2), d3)).toBe(false);
        });

        it('dateAfter passes when value is after target', () => {
            expect(run(dateAfter(d2), d3)).toBe(true);
            expect(run(dateAfter(d2), d1)).toBe(false);
        });

        it('dateBetween passes when value is within range', () => {
            expect(run(dateBetween(d1, d3), d2)).toBe(true);
            expect(run(dateBetween(d1, d2), d3)).toBe(false);
        });

        it('dateEquals fails for null value', () => {
            expect(run(dateEquals(d1), null)).toBe(false);
        });
    });

    // -- time filters ---------------------------------------------------------

    describe('Time filters', () => {
        const t1 = new Date('2024-01-01T08:00:00');
        const t2 = new Date('2024-01-01T12:00:00');
        const t3 = new Date('2024-01-01T18:00:00');

        it('timeEquals passes for same time', () => {
            expect(run(timeEquals(t2), new Date('2024-01-01T12:00:00'))).toBe(true);
        });

        it('timeBefore passes when value is before target', () => {
            expect(run(timeBefore(t2), t1)).toBe(true);
            expect(run(timeBefore(t2), t3)).toBe(false);
        });

        it('timeAfter passes when value is after target', () => {
            expect(run(timeAfter(t2), t3)).toBe(true);
            expect(run(timeAfter(t2), t1)).toBe(false);
        });

        it('timeBetween passes when value is within range', () => {
            expect(run(timeBetween(t1, t3), t2)).toBe(true);
            expect(run(timeBetween(t1, t2), t3)).toBe(false);
        });
    });

    // -- createFilter / createMultiSourceFilter utils -------------------------

    describe('createFilter()', () => {
        it('creates a filter with null dependencies for static value', () => {
            const f = createFilter('active', (v, t) => v === t);
            expect(f.dependencies).toBeNull();
        });

        it('creates a filter with observable dependency', () => {
            const obs = Observable('active');
            const f   = createFilter(obs, (v, t) => v === t);
            expect(f.dependencies).toBe(obs);
        });

        it('callback uses the current observable value', () => {
            const obs = Observable('active');
            const f   = createFilter(obs, (v, t) => v === t);
            expect(f.callback('active')).toBe(true);
            obs.set('inactive');
            expect(f.callback('active')).toBe(false);
        });
    });

    describe('createMultiSourceFilter()', () => {
        it('creates a filter with multiple observable dependencies', () => {
            const min = Observable(0);
            const max = Observable(10);
            const f   = createMultiSourceFilter([min, max], (v, [a, b]) => v >= a && v <= b);
            expect(f.dependencies).toContain(min);
            expect(f.dependencies).toContain(max);
        });

        it('returns null dependencies when all sources are static', () => {
            const f = createMultiSourceFilter([0, 10], (v, [a, b]) => v >= a && v <= b);
            expect(f.dependencies).toBeNull();
        });

        it('callback receives resolved values', () => {
            const min = Observable(5);
            const f   = createMultiSourceFilter([min, 10], (v, [a, b]) => v >= a && v <= b);
            expect(f.callback(7)).toBe(true);
            min.set(8);
            expect(f.callback(7)).toBe(false);
        });
    });

});