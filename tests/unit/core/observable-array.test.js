import { describe, it, expect, vi } from 'vitest';
import { Observable } from '../../../src/core/data/Observable';
import ObservableArray from '../../../src/core/data/ObservableArray';

const arr = (items = []) => new ObservableArray(items);

describe('ObservableArray', () => {

    // -- constructor ----------------------------------------------------------

    describe('constructor', () => {
        it('initializes with an empty array by default', () => {
            const obs = arr([]);
            expect(obs.val()).toEqual([]);
        });

        it('initializes with provided items', () => {
            const obs = arr([1, 2, 3]);
            expect(obs.val()).toEqual([1, 2, 3]);
        });

        it('throws if target is not an array', () => {
            expect(() => new ObservableArray('not-an-array')).toThrow();
        });
    });

    // -- val() ----------------------------------------------------------------

    describe('val()', () => {
        it('returns the current array', () => {
            const obs = arr([1, 2, 3]);
            expect(obs.val()).toEqual([1, 2, 3]);
        });

        it('returns updated array after mutation', () => {
            const obs = arr([1, 2]);
            obs.push(3);
            expect(obs.val()).toEqual([1, 2, 3]);
        });
    });

    // -- push() ---------------------------------------------------------------

    describe('push()', () => {
        it('adds an item to the end', () => {
            const obs = arr([1, 2]);
            obs.push(3);
            expect(obs.val()).toEqual([1, 2, 3]);
        });

        it('notifies subscribers', () => {
            const obs = arr([]);
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.push(1);
            expect(cb).toHaveBeenCalledOnce();
        });

        it('increases length by 1', () => {
            const obs = arr([1, 2]);
            obs.push(3);
            expect(obs.length).toBe(3);
        });
    });

    // -- remove() -------------------------------------------------------------

    describe('remove()', () => {
        it('removes item at given index', () => {
            const obs = arr(['a', 'b', 'c']);
            obs.remove(1);
            expect(obs.val()).toEqual(['a', 'c']);
        });

        it('notifies subscribers', () => {
            const obs = arr([1, 2, 3]);
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.remove(0);
            expect(cb).toHaveBeenCalledOnce();
        });

        it('returns the removed item', () => {
            const obs    = arr(['a', 'b', 'c']);
            const result = obs.remove(1);
            expect(result).toEqual(['b']);
        });
    });

    // -- removeItem() ---------------------------------------------------------

    describe('removeItem()', () => {
        it('removes a specific item by reference', () => {
            const obs = arr([1, 2, 3]);
            obs.removeItem(2);
            expect(obs.val()).toEqual([1, 3]);
        });

        it('does nothing if item not found', () => {
            const obs = arr([1, 2, 3]);
            obs.removeItem(99);
            expect(obs.val()).toEqual([1, 2, 3]);
        });

        it('notifies subscribers', () => {
            const obs = arr([1, 2, 3]);
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.removeItem(2);
            expect(cb).toHaveBeenCalledOnce();
        });
    });

    // -- clear() --------------------------------------------------------------

    describe('clear()', () => {
        it('empties the array', () => {
            const obs = arr([1, 2, 3]);
            obs.clear();
            expect(obs.val()).toEqual([]);
        });

        it('notifies subscribers', () => {
            const obs = arr([1, 2, 3]);
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.clear();
            expect(cb).toHaveBeenCalledOnce();
        });

        it('does nothing and does not notify if already empty', () => {
            const obs = arr([]);
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.clear();
            expect(cb).not.toHaveBeenCalled();
        });
    });

    // -- merge() --------------------------------------------------------------

    describe('merge()', () => {
        it('appends multiple items', () => {
            const obs = arr([1, 2]);
            obs.merge([3, 4]);
            expect(obs.val()).toEqual([1, 2, 3, 4]);
        });

        it('notifies subscribers', () => {
            const obs = arr([]);
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.merge([1, 2]);
            expect(cb).toHaveBeenCalledOnce();
        });
    });

    // -- set() ----------------------------------------------------------------

    describe('set()', () => {
        it('replaces the entire array', () => {
            const obs = arr([1, 2, 3]);
            obs.set([4, 5]);
            expect(obs.val()).toEqual([4, 5]);
        });

        it('notifies subscribers', () => {
            const obs = arr([1]);
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.set([2, 3]);
            expect(cb).toHaveBeenCalledOnce();
        });
    });

    // -- at() -----------------------------------------------------------------

    describe('at()', () => {
        it('returns item at given index', () => {
            const obs = arr(['a', 'b', 'c']);
            expect(obs.at(1)).toBe('b');
        });

        it('returns undefined for out-of-bounds index', () => {
            const obs = arr(['a']);
            expect(obs.at(99)).toBeUndefined();
        });
    });

    // -- swap() ---------------------------------------------------------------

    describe('swap()', () => {
        it('swaps items at two indices', () => {
            const obs = arr(['a', 'b', 'c']);
            obs.swap(0, 2);
            expect(obs.val()).toEqual(['c', 'b', 'a']);
        });

        it('notifies subscribers', () => {
            const obs = arr([1, 2, 3]);
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.swap(0, 1);
            expect(cb).toHaveBeenCalledOnce();
        });
    });

    // -- swapItems() ----------------------------------------------------------

    describe('swapItems()', () => {
        it('swaps two items by reference', () => {
            const obs = arr(['a', 'b', 'c']);
            obs.swapItems('a', 'c');
            expect(obs.val()).toEqual(['c', 'b', 'a']);
        });
    });

    // -- insertAfter() --------------------------------------------------------

    describe('insertAfter()', () => {
        it('inserts item after target', () => {
            const obs = arr(['a', 'c']);
            obs.insertAfter('b', 'a');
            expect(obs.val()).toEqual(['a', 'b', 'c']);
        });

        it('notifies subscribers', () => {
            const obs = arr(['a', 'c']);
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.insertAfter('b', 'a');
            expect(cb).toHaveBeenCalledOnce();
        });
    });

    // -- count() --------------------------------------------------------------

    describe('count()', () => {
        it('counts items matching condition', () => {
            const obs = arr([1, 2, 3, 4, 5]);
            expect(obs.count((n) => n > 3)).toBe(2);
        });
    });

    // -- isNotEmpty() ---------------------------------------------------------

    describe('isNotEmpty()', () => {
        it('returns false for empty array', () => {
            const obs = arr([]);
            expect(obs.isNotEmpty().val()).toBe(false);
        });

        it('returns true for non-empty array', () => {
            const obs = arr([1]);
            expect(obs.isNotEmpty().val()).toBe(true);
        });

        it('updates reactively when items are added', () => {
            const obs     = arr([]);
            const isEmpty = obs.isNotEmpty();
            expect(isEmpty.val()).toBe(false);
            obs.push(1);
            expect(isEmpty.val()).toBe(true);
        });
    });

    // -- empty() --------------------------------------------------------------

    describe('empty()', () => {
        it('returns true for empty array', () => {
            expect(arr([]).empty()).toBe(true);
        });

        it('returns false for non-empty array', () => {
            expect(arr([1]).empty()).toBe(false);
        });
    });

    // -- where() --------------------------------------------------------------

    describe('where()', () => {
        it('returns a filtered observable array', () => {
            const obs      = arr([1, 2, 3, 4, 5]);
            const filtered = obs.where({ _: (n) => n > 3 });
            expect(filtered.val()).toEqual([4, 5]);
        });

        it('updates when source changes', () => {
            const obs      = arr([1, 2, 3]);
            const filtered = obs.where({ _: (n) => n > 2 });
            obs.push(4);
            expect(filtered.val()).toEqual([3, 4]);
        });
    });

    // -- sync() ---------------------------------------------------------------

    describe('sync()', () => {
        it('mirrors initial content to target', () => {
            const source = arr([1, 2, 3]);
            const target = arr([]);
            source.sync(target);
            expect(target.val()).toEqual([1, 2, 3]);
        });

        it('mirrors push to target', () => {
            const source = arr([1]);
            const target = arr([]);
            source.sync(target);
            source.push(2);
            expect(target.val()).toEqual([1, 2]);
        });

        it('stops syncing after unsync()', () => {
            const source = arr([1]);
            const target = arr([]);
            const unsync = source.sync(target);
            unsync();
            source.push(2);
            expect(target.val()).toEqual([1]);
        });

        it('throws if target is not an ObservableArray', () => {
            const source = arr([1]);
            expect(() => source.sync({})).toThrow();
        });
    });


    // -- reset() --------------------------------------------------------------

    describe('reset()', () => {
        it('restores initial array when { reset: true }', () => {
            const obs = new ObservableArray([1, 2, 3], { reset: true });
            obs.push(4);
            obs.reset();
            expect(obs.val()).toEqual([1, 2, 3]);
        });

        it('does nothing without { reset: true }', () => {
            const obs = new ObservableArray([1, 2, 3]);
            obs.push(4);
            obs.reset();
            expect(obs.val()).toEqual([1, 2, 3, 4]);
        });

        it('deep clones the initial array — mutations do not affect reset value', () => {
            const obs = new ObservableArray([{ x: 1 }], { reset: true });
            obs.at(0).x = 99;
            obs.reset();
            expect(obs.val()[0].x).toBe(1);
        });

        it('notifies subscribers after reset', () => {
            const obs = new ObservableArray([1, 2], { reset: true });
            obs.push(3);
            const cb = vi.fn();
            obs.subscribe(cb);
            obs.reset();
            expect(cb).toHaveBeenCalledOnce();
            expect(obs.val()).toEqual([1, 2]);
        });
    });

    // -- clone() --------------------------------------------------------------

    describe('clone()', () => {
        it('returns a new independent ObservableArray', () => {
            const obs   = arr([1, 2, 3]);
            const clone = obs.clone();
            expect(clone.val()).toEqual([1, 2, 3]);
            expect(clone).not.toBe(obs);
        });

        it('mutations on clone do not affect source', () => {
            const obs   = arr([1, 2]);
            const clone = obs.clone();
            clone.push(3);
            expect(obs.val()).toEqual([1, 2]);
        });
    });

    // -- deepSubscribe() ------------------------------------------------------

    describe('deepSubscribe()', () => {
        it('fires callback when a nested observable changes', async () => {
            const inner = Observable(1);
            const obs   = arr([inner]);
            const cb    = vi.fn();
            obs.deepSubscribe(cb);
            inner.set(2);
            // nextTick is used internally - wait for microtask queue
            await new Promise((r) => setTimeout(r, 0));
            expect(cb).toHaveBeenCalled();
        });

        it('returns an unsubscribe function', () => {
            const obs   = arr([Observable(1)]);
            const unsub = obs.deepSubscribe(() => {});
            expect(typeof unsub).toBe('function');
        });
    });

});