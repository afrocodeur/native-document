import { describe, it, expect, vi } from 'vitest';
import { once, singleton, memoize } from '../../../src/core/utils/cache';

describe('Cache utilities', () => {

    // -- singleton() ----------------------------------------------------------

    describe('singleton() — once(fn)', () => {
        it('calls the function on first access', () => {
            const fn = vi.fn(() => ({ value: 42 }));
            const get = singleton(fn);
            get();
            expect(fn).toHaveBeenCalledOnce();
        });

        it('returns the same result on subsequent calls', () => {
            const fn = vi.fn(() => ({ value: 42 }));
            const get = singleton(fn);
            const r1 = get();
            const r2 = get();
            expect(r1).toBe(r2);
            expect(fn).toHaveBeenCalledOnce();
        });

        it('passes arguments to the function on first call', () => {
            const fn = vi.fn((x) => x * 2);
            const get = singleton(fn);
            expect(get(5)).toBe(10);
            expect(get(99)).toBe(10); // cached result from first call
        });
    });

    // -- once() — autoOnce proxy ---------------------------------------------

    describe('once() — autoOnce(fn)', () => {
        it('calls the factory on first property access', () => {
            const factory = vi.fn(() => ({ name: 'store', count: 0 }));
            const proxy = once(factory);
            const _ = proxy.name;
            expect(factory).toHaveBeenCalledOnce();
        });

        it('does not call the factory again on subsequent access', () => {
            const factory = vi.fn(() => ({ name: 'store' }));
            const proxy = once(factory);
            const _a = proxy.name;
            const _b = proxy.name;
            expect(factory).toHaveBeenCalledOnce();
        });

        it('returns the correct property value', () => {
            const proxy = once(() => ({ x: 10, y: 20 }));
            expect(proxy.x).toBe(10);
            expect(proxy.y).toBe(20);
        });

        it('returns undefined for unknown properties', () => {
            const proxy = once(() => ({ x: 1 }));
            expect(proxy.unknown).toBeUndefined();
        });
    });

    // -- memoize() — autoMemoize proxy ----------------------------------------

    describe('memoize() — autoMemoize(fn)', () => {
        // autoMemoize behaviour:
        // - fn.length === 0 -> calls fn(key), caches and returns the value
        // - fn.length  >  0 -> returns a memoized (...args) => fn(...args, key)

        it('fn.length === 0 — returns the value directly', () => {
            // fn ignores key, autoMemoize calls fn(key) and caches the result
            let callCount = 0;
            const fn = function() { callCount++; return 'fixed'; };
            const proxy = memoize(fn);
            expect(proxy.any).toBe('fixed');
            expect(callCount).toBe(1);
        });

        it('fn.length === 0 — caches per key', () => {
            const calls = [];
            const fn = function() { return calls.push(fn) && `r${calls.length}`; };
            const proxy = memoize(fn);
            const r1 = proxy.home;
            const r2 = proxy.home;
            expect(r1).toBe(r2);
            expect(calls.length).toBe(1);
        });

        it('fn.length === 0 — independent keys call fn separately', () => {
            const calls = [];
            const fn = function() { calls.push(1); return `r${calls.length}`; };
            const proxy = memoize(fn);
            const r1 = proxy.home;
            const r2 = proxy.search;
            expect(r1).not.toBe(r2);
            expect(calls.length).toBe(2);
        });

        it('fn.length > 0 — returns a function per key', () => {
            // fn(value, key): value is passed by caller, key is appended by autoMemoize
            const fn = function(value, key) { return `${key}:${value}`; };
            const proxy = memoize(fn);
            expect(typeof proxy.fr).toBe('function');
            expect(proxy.fr('hello')).toBe('fr:hello');
        });

        it('fn.length > 0 — caches the function per key', () => {
            let callCount = 0;
            // fn must have length > 0 — declare at least one param
            const fn = function(_value, _key) { callCount++; };
            const proxy = memoize(fn);
            proxy.fr('hello');
            // second access to proxy.fr returns the cached wrapper, fn not called again
            const cached = proxy.fr;
            expect(typeof cached).toBe('function');
            expect(callCount).toBe(1);
        });
    });

});