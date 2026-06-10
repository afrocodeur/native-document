import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Observable } from '../../../src/core/data/Observable';
import ObservableResource from '../../../src/core/data/ObservableResource';
import ObservableItem from '../../../src/core/data/ObservableItem';

const resource = (fn, deps = [], config = {}) =>
    new ObservableResource(fn, deps, config);

const resolved = (value) => () => Promise.resolve(value);
const rejected = (err)   => () => Promise.reject(err);

describe('ObservableResource', () => {

    // -- initial state --------------------------------------------------------

    describe('initial state', () => {
        it('state is unresolved before any fetch', () => {
            const r = resource(resolved('data'), []);
            expect(r.state.val()).toBe('unresolved');
        });

        it('data is null before any fetch', () => {
            const r = resource(resolved('data'), []);
            expect(r.data.val()).toBeNull();
        });

        it('isUnresolved() returns true before first fetch', () => {
            const r = resource(resolved('data'), []);
            expect(r.isUnresolved().val()).toBe(true);
        });

        it('loading is false before any fetch', () => {
            const r = resource(resolved('data'), []);
            expect(r.loading.val()).toBe(false);
        });
    });

    // -- fetch() --------------------------------------------------------------

    describe('fetch()', () => {
        it('transitions to pending then ready', async () => {
            const r = resource(resolved('hello'), []);
            r.fetch();
            expect(r.state.val()).toBe('pending');
            await new Promise((res) => setTimeout(res, 0));
            expect(r.state.val()).toBe('ready');
        });

        it('sets data on success', async () => {
            const r = resource(resolved({ id: 1 }), []);
            r.fetch();
            await new Promise((res) => setTimeout(res, 0));
            expect(r.data.val()).toEqual({ id: 1 });
        });

        it('sets error on failure', async () => {
            const err = new Error('Network error');
            const r   = resource(rejected(err), []);
            r.fetch();
            await new Promise((res) => setTimeout(res, 0));
            expect(r.state.val()).toBe('errored');
            expect(r.error.val()).toBe(err);
        });

        it('clears error on successful re-fetch', async () => {
            const r = resource(rejected(new Error('fail')), []);
            r.fetch();
            await new Promise((res) => setTimeout(res, 0));
            r.$fn = resolved('ok');
            r.fetch();
            await new Promise((res) => setTimeout(res, 0));
            expect(r.error.val()).toBeNull();
        });

        it('state is pending while fetching', async () => {
            let resolve;
            // fn must declare signal param so $run uses AbortController path (async)
            const fn = (_signal) => new Promise((r) => { resolve = r; });
            const r  = resource(fn, []);
            r.fetch();
            expect(r.state.val()).toBe('pending');
            resolve('done');
            await new Promise((res) => setTimeout(res, 0));
            expect(r.state.val()).toBe('ready');
        });

        it('isReady() returns true after success', async () => {
            const r = resource(resolved('ok'), []);
            r.fetch();
            await new Promise((res) => setTimeout(res, 0));
            expect(r.isReady().val()).toBe(true);
        });

        it('isErrored() returns true after failure', async () => {
            const r = resource(rejected(new Error('fail')), []);
            r.fetch();
            await new Promise((res) => setTimeout(res, 0));
            expect(r.isErrored().val()).toBe(true);
        });
    });

    // -- refetch() ------------------------------------------------------------

    describe('refetch()', () => {
        it('transitions to refreshing when data already exists', async () => {
            const r = resource(resolved('first'), []);
            r.fetch();
            await new Promise((res) => setTimeout(res, 0));

            let capturedState = null;
            r.state.subscribe((state) => { capturedState = state; });
            r.refetch();
            expect(capturedState).toBe('refreshing');
        });

        it('updates data on success', async () => {
            const r = resource(resolved('first'), []);
            r.fetch();
            await new Promise((res) => setTimeout(res, 0));

            r.$fn = resolved('second');
            r.refetch();
            await new Promise((res) => setTimeout(res, 0));
            expect(r.data.val()).toBe('second');
        });
    });

    // -- mutate() -------------------------------------------------------------

    describe('mutate()', () => {
        it('updates data without triggering a fetch', () => {
            const fn = vi.fn(resolved('original'));
            const r  = resource(fn, []);
            r.mutate('overridden');
            expect(r.data.val()).toBe('overridden');
            expect(fn).not.toHaveBeenCalled();
        });

        it('sets state to ready', () => {
            const r = resource(resolved('data'), []);
            r.mutate('value');
            expect(r.state.val()).toBe('ready');
        });

        it('notifies data subscribers', () => {
            const r  = resource(resolved('data'), []);
            const cb = vi.fn();
            r.data.subscribe(cb);
            r.mutate('new');
            expect(cb).toHaveBeenCalledOnce();
        });
    });

    // -- abort() --------------------------------------------------------------

    describe('abort via AbortController', () => {
        it('does not update data after abort', async () => {
            let externalResolve;
            const fn = (_signal) => new Promise((res) => { externalResolve = res; });
            const r  = resource(fn, []);
            r.fetch();
            r.$abort();
            externalResolve('late data');
            await new Promise((res) => setTimeout(res, 0));
            expect(r.data.val()).toBeNull();
        });
    });

    // -- auto fetch with deps -------------------------------------------------

    describe('auto fetch with deps', () => {
        it('fetches automatically when { auto: true } and no deps', async () => {
            const r = resource(resolved('auto'), [], { auto: true });
            await new Promise((res) => setTimeout(res, 0));
            expect(r.data.val()).toBe('auto');
        });

        it('re-fetches when a dependency changes', async () => {
            const dep = Observable(1);
            const fn  = vi.fn((val) => Promise.resolve(val * 10));
            const r   = resource(fn, [dep], { auto: true });
            await new Promise((res) => setTimeout(res, 0));
            expect(r.data.val()).toBe(10);

            dep.set(2);
            await new Promise((res) => setTimeout(res, 0));
            expect(r.data.val()).toBe(20);
        });

        it('does not fetch immediately when { lazy: true }', async () => {
            const dep = Observable(1);
            const fn  = vi.fn(resolved('data'));
            resource(fn, [dep], { auto: true, lazy: true });
            await new Promise((res) => setTimeout(res, 0));
            expect(fn).not.toHaveBeenCalled();
        });

        it('fetches after dep change when { lazy: true }', async () => {
            const dep = Observable(1);
            const fn  = vi.fn(resolved('data'));
            resource(fn, [dep], { auto: true, lazy: true });
            dep.set(2);
            await new Promise((res) => setTimeout(res, 0));
            expect(fn).toHaveBeenCalledOnce();
        });
    });

    // -- onSuccess() / onError() ----------------------------------------------

    describe('onSuccess() / onError()', () => {
        it('onSuccess fires after successful fetch', async () => {
            // fn must declare _signal to use async path
            const r = resource((_signal) => Promise.resolve('ok'), []);
            r.fetch();
            await new Promise((res) => setTimeout(res, 0));
            expect(r.state.val()).toBe('ready');
            expect(r.data.val()).toBe('ok');
        });

        it('onError fires after failed fetch', async () => {
            const err = new Error('fail');
            const cb  = vi.fn();
            const r   = resource(rejected(err), []);
            r.onError(cb);
            r.fetch();
            await new Promise((res) => setTimeout(res, 0));
            expect(cb).toHaveBeenCalledWith(err);
        });
    });

    // -- into() ---------------------------------------------------------------

    describe('into()', () => {
        it('writes result into provided observable', async () => {
            const target = Observable(null);
            const r      = resource(resolved('result'), []);
            r.into(target);
            r.fetch();
            await new Promise((res) => setTimeout(res, 0));
            expect(target.val()).toBe('result');
        });

        it('this.data points to the target observable', () => {
            const target = Observable(null);
            const r      = resource(resolved('data'), []);
            r.into(target);
            expect(r.data).toBe(target);
        });
    });

    // -- apply() --------------------------------------------------------------

    describe('apply()', () => {
        it('transforms data with provided function', async () => {
            const r = resource(resolved({ items: [1, 2, 3] }), []);
            r.apply((result, data) => data.set(result.items));
            r.fetch();
            await new Promise((res) => setTimeout(res, 0));
            expect(r.data.val()).toEqual([1, 2, 3]);
        });
    });

    // -- destroy() ------------------------------------------------------------

    describe('destroy()', () => {
        it('aborts in-flight request', () => {
            let resolve;
            const fn = (_signal) => new Promise((r) => { resolve = r; });
            const r  = resource(fn, []);
            r.fetch();
            const controller = r.$controller;
            r.destroy();
            expect(controller.signal.aborted).toBe(true);
        });

        it('unsubscribes from all dependencies', () => {
            const dep = Observable(1);
            const fn  = vi.fn(resolved('data'));
            const r   = resource(fn, [dep], { auto: true });
            r.destroy();
            const callCount = fn.mock.calls.length;
            dep.set(2);
            expect(fn.mock.calls.length).toBe(callCount);
        });
    });

    // -- race condition -------------------------------------------------------

    describe('race condition', () => {
        it('last fetch call wins — stale response is ignored', async () => {
            let resolveFirst;
            let resolveSecond;

            // Wrapper with explicit signal param — forces AbortController path
            const makePromise = () => {
                let res;
                const p = new Promise((r) => { res = r; });
                return { promise: p, resolve: res };
            };

            const p1 = makePromise();
            const p2 = makePromise();
            let call = 0;

            // fn.length must be > 0 to trigger AbortController path
            const fn = function(_signal) {
                call++;
                return call === 1 ? p1.promise : p2.promise;
            };

            const r = resource(fn, []);
            r.fetch(); // first — will be aborted by second fetch
            r.fetch(); // second — wins

            p2.resolve('second');
            p1.resolve('first'); // aborted, ignored

            await new Promise((res) => setTimeout(res, 0));
            expect(r.data.val()).toBe('second');
        });
    });

});