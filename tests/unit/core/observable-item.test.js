import { describe, it, expect, vi, beforeEach } from 'vitest';
import ObservableItem from '../../../src/core/data/ObservableItem';
import { Observable } from '../../../src/core/data/Observable';

describe('ObservableItem', () => {

    // -- constructor -----------------------------------------------------------

    describe('constructor', () => {
        it('initializes with the given value', () => {
            const obs = new ObservableItem(42);
            expect(obs.val()).toBe(42);
        });

        it('initializes with null', () => {
            const obs = new ObservableItem(null);
            expect(obs.val()).toBeNull();
        });

        it('unwraps an observable passed as initial value', () => {
            const inner = new ObservableItem(10);
            const obs   = new ObservableItem(inner);
            expect(obs.val()).toBe(10);
        });

        it('stores initial value for reset when { reset: true }', ()=> {
            const obs = new ObservableItem(5, { reset: true });
            obs.set(99);
            obs.reset();
            expect(obs.val()).toBe(5);
        });

        it('does not store initial value without { reset: true }', () => {
            const obs = new ObservableItem(5);
            obs.set(99);
            obs.reset();
            expect(obs.val()).toBe(99); // reset() is a no-op
        });
    });

    // -- val() -----------------------------------------------------------------

    describe('val()', () => {
        it('returns the current value', () => {
            const obs = new ObservableItem('hello');
            expect(obs.val()).toBe('hello');
        });

        it('returns the updated value after set()', () => {
            const obs = new ObservableItem(0);
            obs.set(7);
            expect(obs.val()).toBe(7);
        });
    });

    // -- set() -----------------------------------------------------------------

    describe('set()', () => {
        it('updates the current value', () => {
            const obs = new ObservableItem(1);
            obs.set(2);
            expect(obs.val()).toBe(2);
        });

        it('does not notify if value is unchanged', () => {
            const obs = new ObservableItem('same');
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.set('same');
            expect(cb).not.toHaveBeenCalled();
        });

        it('notifies subscribers when value changes', () => {
            const obs  = new ObservableItem(0);
            let received = null;
            obs.subscribe((current, previous, ops) => { received = { current, previous, ops }; });
            obs.set(1);
            expect(received.current).toBe(1);
            expect(received.previous).toBe(0);
            expect(received.ops).toMatchObject({ action: 'set' });
        });

        it('accepts a function and passes current value', () => {
            const obs = new ObservableItem(5);
            obs.set((current) => current * 2);
            expect(obs.val()).toBe(10);
        });

        it('unwraps an observable value passed to set()', () => {
            const obs   = new ObservableItem(0);
            const other = new ObservableItem(99);
            obs.set(other);
            expect(obs.val()).toBe(99);
        });
    });

    // -- subscribe() / unsubscribe() -------------------------------------------

    describe('subscribe() / unsubscribe()', () => {
        it('subscribe() registers a callback called on change', () => {
            const obs = new ObservableItem(0);
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.set(1);
            expect(cb).toHaveBeenCalledOnce();
        });

        it('subscribe() receives current and previous value', () => {
            const obs = new ObservableItem(10);
            let received = null;
            obs.subscribe((current, previous, ops) => { received = { current, previous }; });
            obs.set(20);
            expect(received.current).toBe(20);
            expect(received.previous).toBe(10);
        });

        it('multiple subscribers are all notified', () => {
            const obs = new ObservableItem(0);
            const cb1 = vi.fn();
            const cb2 = vi.fn();
            const cb3 = vi.fn();
            obs.subscribe(cb1);
            obs.subscribe(cb2);
            obs.subscribe(cb3);
            obs.set(1);
            expect(cb1).toHaveBeenCalledOnce();
            expect(cb2).toHaveBeenCalledOnce();
            expect(cb3).toHaveBeenCalledOnce();
        });

        it('unsubscribe() stops receiving updates', () => {
            const obs = new ObservableItem(0);
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.unsubscribe(cb);
            obs.set(1);
            expect(cb).not.toHaveBeenCalled();
        });

        it('unsubscribe() with unknown callback does nothing', () => {
            const obs = new ObservableItem(0);
            expect(() => obs.unsubscribe(() => {})).not.toThrow();
        });
    });

    // -- on() / off() ----------------------------------------------------------

    describe('on() / off()', () => {
        it('on() fires callback when value matches', () => {
            const obs = new ObservableItem('idle');
            const cb  = vi.fn();
            obs.on('loading', cb);
            obs.set('loading');
            expect(cb).toHaveBeenCalledOnce();
        });

        it('on() does not fire for other values', () => {
            const obs = new ObservableItem('idle');
            const cb  = vi.fn();
            obs.on('loading', cb);
            obs.set('error');
            expect(cb).not.toHaveBeenCalled();
        });

        it('on() supports multiple callbacks for same value', () => {
            const obs = new ObservableItem('idle');
            const cb1 = vi.fn();
            const cb2 = vi.fn();
            obs.on('loading', cb1);
            obs.on('loading', cb2);
            obs.set('loading');
            expect(cb1).toHaveBeenCalledOnce();
            expect(cb2).toHaveBeenCalledOnce();
        });

        it('off() removes all handlers for a value', () => {
            const obs = new ObservableItem('idle');
            const cb  = vi.fn();
            obs.on('loading', cb);
            obs.off('loading');
            obs.set('loading');
            expect(cb).not.toHaveBeenCalled();
        });
    });

    // -- once() ----------------------------------------------------------------

    describe('once()', () => {
        it('fires callback exactly once when value matches', () => {
            const obs = new ObservableItem('idle');
            const cb  = vi.fn();
            obs.once('ready', cb);
            obs.set('ready');
            obs.set('idle');
            obs.set('ready');
            expect(cb).toHaveBeenCalledOnce();
        });

        it('fires callback when function predicate returns true', () => {
            const obs = new ObservableItem(0);
            const cb  = vi.fn();
            obs.once((v) => v > 5, cb);
            obs.set(3);
            obs.set(10);
            obs.set(20);
            expect(cb).toHaveBeenCalledOnce();
            expect(cb).toHaveBeenCalledWith(10);
        });
    });

    // -- toggle() --------------------------------------------------------------

    describe('toggle()', () => {
        it('flips false to true', () => {
            const obs = new ObservableItem(false);
            obs.toggle();
            expect(obs.val()).toBe(true);
        });

        it('flips true to false', () => {
            const obs = new ObservableItem(true);
            obs.toggle();
            expect(obs.val()).toBe(false);
        });

        it('notifies subscribers', () => {
            const obs = new ObservableItem(false);
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.toggle();
            expect(cb).toHaveBeenCalledOnce();
        });
    });

    // -- reset() ---------------------------------------------------------------

    describe('reset()', () => {
        it('restores initial value when { reset: true }', () => {
            const obs = new ObservableItem(0, { reset: true });
            obs.set(42);
            obs.reset();
            expect(obs.val()).toBe(0);
        });

        it('does nothing without { reset: true }', () => {
            const obs = new ObservableItem(0);
            obs.set(42);
            obs.reset();
            expect(obs.val()).toBe(42);
        });

        it('notifies subscribers after reset', () => {
            const obs = new ObservableItem(0, { reset: true });
            obs.set(99);
            const cb = vi.fn();
            obs.subscribe(cb);
            obs.reset();
            expect(cb).toHaveBeenCalledOnce();
            // With a single subscriber, callback receives (current, previous, ops)
            // only if callback.length > 0 (assocTrigger optimization)
            expect(obs.val()).toBe(0);
        });

        it('deep clones object initial value on reset', () => {
            const initial = { x: 1 };
            const obs = new ObservableItem(initial, { reset: true });
            obs.set({ x: 99 });
            obs.reset();
            expect(obs.val()).toEqual({ x: 1 });
            expect(obs.val()).not.toBe(initial); // deep clone, not same ref
        });
    });

    // -- transform() -----------------------------------------------------------

    describe('transform()', () => {
        it('returns a derived observable', () => {
            const obs     = new ObservableItem(2);
            const doubled = obs.transform((v) => v * 2);
            expect(doubled.val()).toBe(4);
        });

        it('derived observable updates when source changes', () => {
            const obs     = new ObservableItem(2);
            const doubled = obs.transform((v) => v * 2);
            obs.set(5);
            expect(doubled.val()).toBe(10);
        });

        it('notifies derived subscribers on source change', () => {
            const obs     = new ObservableItem(1);
            const doubled = obs.transform((v) => v * 2);
            const cb      = vi.fn();
            doubled.subscribe(cb);
            obs.set(3);
            expect(doubled.val()).toBe(6); // derived value updated
            expect(cb).toHaveBeenCalledOnce();
        });
    });

    // -- equals() --------------------------------------------------------------

    describe('equals()', () => {
        it('returns true when values are equal', () => {
            const obs = new ObservableItem(5);
            expect(obs.equals(5)).toBe(true);
        });

        it('returns false when values differ', () => {
            const obs = new ObservableItem(5);
            expect(obs.equals(10)).toBe(false);
        });

        it('compares with another observable', () => {
            const a = new ObservableItem(5);
            const b = new ObservableItem(5);
            const c = new ObservableItem(9);
            expect(a.equals(b)).toBe(true);
            expect(a.equals(c)).toBe(false);
        });
    });

    // -- clone() ---------------------------------------------------------------

    describe('clone()', () => {
        it('returns a new independent observable', () => {
            const obs   = new ObservableItem(42);
            const clone = obs.clone();
            expect(clone.val()).toBe(42);
            expect(clone).not.toBe(obs);
        });

        it('mutations on clone do not affect source', () => {
            const obs   = new ObservableItem(1);
            const clone = obs.clone();
            clone.set(99);
            expect(obs.val()).toBe(1);
        });

        it('deep clones object values', () => {
            const obs   = new ObservableItem({ x: 1 });
            const clone = obs.clone();
            expect(clone.val()).toEqual({ x: 1 });
            expect(clone.val()).not.toBe(obs.val());
        });
    });

    // -- cleanup() -------------------------------------------------------------

    describe('cleanup()', () => {
        it('runs onCleanup callbacks', () => {
            const obs = new ObservableItem(0);
            const cb  = vi.fn();
            obs.onCleanup(cb);
            obs.cleanup();
            expect(cb).toHaveBeenCalledOnce();
        });

        it('disconnects all listeners after cleanup', () => {
            const obs = new ObservableItem(0);
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.cleanup();
            expect(obs.$listeners).toBeNull();
        });
    });

    // -- intercept() -----------------------------------------------------------

    describe('intercept()', () => {
        it('transforms value via interceptor before set()', () => {
            const obs = new ObservableItem(0);
            obs.intercept((newVal) => Math.max(0, newVal));
            obs.set(-5);
            expect(obs.val()).toBe(0);
        });

        it('uses interceptor return value', () => {
            const obs = new ObservableItem(0);
            obs.intercept(() => 42);
            obs.set(1);
            expect(obs.val()).toBe(42);
        });

        it('falls back to original value if interceptor returns undefined', () => {
            const obs = new ObservableItem(0);
            obs.intercept(() => undefined);
            obs.set(7);
            expect(obs.val()).toBe(7);
        });
    });

    // -- assocTrigger() — internal optimisation --------------------------------

    describe('assocTrigger() — internal optimisation', () => {
        it('uses noneTrigger with no subscribers', () => {
            const obs = new ObservableItem(0);
            // trigger should be the noneTrigger (no-op) — no error on set
            expect(() => obs.set(1)).not.toThrow();
        });

        it('uses triggerFirstListener with a single subscriber', () => {
            const obs = new ObservableItem(0);
            const cb  = vi.fn();
            obs.subscribe(cb);
            expect(obs.$firstListener).toBe(cb);
        });

        it('uses triggerListeners with multiple subscribers', () => {
            const obs = new ObservableItem(0);
            obs.subscribe(vi.fn());
            obs.subscribe(vi.fn());
            // With 2+ listeners, $firstListener is set to first listener
            // and trigger delegates to triggerListeners
            expect(obs.$listeners.length).toBe(2);
        });

        it('reverts to noneTrigger after unsubscribing all', () => {
            const obs = new ObservableItem(0);
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.unsubscribe(cb);
            expect(obs.$listeners.length).toBe(0);
            expect(obs.$firstListener).toBeNull();
        });
    });

});