import { describe, it, expect, vi } from 'vitest';
import { ObservableObject } from '../../../src/core/data/ObservableObject';
import ObservableItem from '../../../src/core/data/ObservableItem';
import ObservableArray from '../../../src/core/data/ObservableArray';

const obj = (target, configs) => new ObservableObject(target, configs);

describe('ObservableObject', () => {

    // -- constructor ----------------------------------------------------------

    describe('constructor', () => {
        it('initializes with given properties', () => {
            const obs = obj({ name: 'John', age: 25 });
            expect(obs.get('name')).toBe('John');
            expect(obs.get('age')).toBe(25);
        });

        it('wraps scalar values in ObservableItem', () => {
            const obs = obj({ name: 'John' });
            expect(obs.$observables['name'].__$Observable).toBe(true);
        });

        it('wraps nested objects in ObservableObject', () => {
            const obs = obj({ address: { city: 'Paris' } });
            expect(obs.$observables['address'].__$isObservableObject).toBe(true);
        });

        it('wraps array values in ObservableArray', () => {
            const obs = obj({ tags: ['a', 'b'] });
            expect(obs.$observables['tags'].__$isObservableArray).toBe(true);
        });

        it('does not wrap nested array items when deep=false', () => {
            const obs = obj({ tags: [{ name: 'a' }] }, { deep: false });
            // With deep=false, array items are not wrapped in ObservableObject
            expect(obs.$observables['tags'].__$isObservableArray).toBe(true);
            expect(obs.$observables['tags'].at(0).__$isObservableObject).toBeUndefined();
        });
    });

    // -- val() ----------------------------------------------------------------

    describe('val()', () => {
        it('returns a plain object snapshot', () => {
            const obs = obj({ name: 'John', age: 25 });
            expect(obs.val()).toEqual({ name: 'John', age: 25 });
        });

        it('unwraps nested observables', () => {
            const obs = obj({ address: { city: 'Paris' } });
            expect(obs.val()).toEqual({ address: { city: 'Paris' } });
        });

        it('unwraps array values', () => {
            const obs = obj({ tags: ['a', 'b'] });
            expect(obs.val()).toEqual({ tags: ['a', 'b'] });
        });
    });

    // -- get() ----------------------------------------------------------------

    describe('get()', () => {
        it('returns value for a property key', () => {
            const obs = obj({ name: 'John' });
            expect(obs.get('name')).toBe('John');
        });

        it('$get() is an alias for get()', () => {
            const obs = obj({ name: 'John' });
            expect(obs.$get('name')).toBe('John');
        });
    });

    // -- set() ----------------------------------------------------------------

    describe('set()', () => {
        it('updates a single property', () => {
            const obs = obj({ name: 'John', age: 25 });
            obs.set({ name: 'Jane' });
            expect(obs.get('name')).toBe('Jane');
            expect(obs.get('age')).toBe(25);
        });

        it('supports partial updates', () => {
            const obs = obj({ a: 1, b: 2, c: 3 });
            obs.set({ b: 99 });
            expect(obs.val()).toEqual({ a: 1, b: 99, c: 3 });
        });

        it('updates nested object properties', () => {
            const obs = obj({ address: { city: 'Paris', zip: '75000' } });
            obs.set({ address: { city: 'Lyon' } });
            expect(obs.get('address').city).toBe('Lyon');
        });

        it('$set() is an alias for set()', () => {
            const obs = obj({ name: 'John' });
            obs.$set({ name: 'Jane' });
            expect(obs.get('name')).toBe('Jane');
        });

        it('update() is an alias for set()', () => {
            const obs = obj({ name: 'John' });
            obs.update({ name: 'Jane' });
            expect(obs.get('name')).toBe('Jane');
        });
    });

    // -- direct property assignment -------------------------------------------

    describe('direct property assignment', () => {
        it('obs.name = value updates via setter', () => {
            const obs = obj({ name: 'John' });
            obs.name = 'Jane';
            expect(obs.get('name')).toBe('Jane');
        });

        it('obs.name returns the ObservableItem', () => {
            const obs = obj({ name: 'John' });
            expect(obs.name.__$Observable).toBe(true);
        });
    });

    // -- subscribe() ----------------------------------------------------------

    describe('subscribe()', () => {
        it('fires when any property changes', async () => {
            const obs = obj({ name: 'John', age: 25 });
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.set({ name: 'Jane' });
            await new Promise((r) => setTimeout(r, 0));
            expect(cb).toHaveBeenCalled();
        });

        it('fires when nested observable changes', async () => {
            const obs = obj({ name: 'John' });
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.name.set('Jane');
            await new Promise((r) => setTimeout(r, 0));
            expect(cb).toHaveBeenCalled();
        });

        it('batches multiple simultaneous changes into one notification', async () => {
            const obs = obj({ a: 1, b: 2 });
            const cb  = vi.fn();
            obs.subscribe(cb);
            obs.set({ a: 10, b: 20 });
            await new Promise((r) => setTimeout(r, 0));
            expect(cb).toHaveBeenCalledOnce();
        });
    });

    // -- keys() ---------------------------------------------------------------

    describe('keys()', () => {
        it('returns all property names', () => {
            const obs = obj({ name: 'John', age: 25 });
            expect(obs.keys()).toEqual(['name', 'age']);
        });

        it('$keys() is an alias for keys()', () => {
            const obs = obj({ name: 'John' });
            expect(obs.$keys()).toEqual(['name']);
        });
    });

    // -- observables() --------------------------------------------------------

    describe('observables()', () => {
        it('returns all internal observable instances', () => {
            const obs  = obj({ name: 'John', age: 25 });
            const list = obs.observables();
            expect(list).toHaveLength(2);
            expect(list.every((o) => o.__$Observable)).toBe(true);
        });
    });

    // -- reset() --------------------------------------------------------------

    describe('reset()', () => {
        it('restores all scalar properties to initial values', () => {
            const obs = obj({ name: 'John', age: 25 }, { reset: true });
            obs.set({ name: 'Jane', age: 99 });
            obs.reset();
            expect(obs.get('name')).toBe('John');
            expect(obs.get('age')).toBe(25);
        });

        it('restores nested object properties to initial values', () => {
            const obs = obj({ address: { city: 'Paris' } }, { reset: true });
            obs.set({ address: { city: 'Lyon' } });
            obs.reset();
            expect(obs.get('address').city).toBe('Paris');
        });

        it('restores array properties to initial values', () => {
            const obs = obj({ tags: ['a', 'b'] }, { reset: true });
            const tagsObs = obs.$observables['tags'];
            tagsObs.push('c');
            expect(tagsObs.length).toBe(3);
            obs.reset();
            expect(tagsObs.length).toBe(2);
        });

        it('does nothing without { reset: true }', () => {
            const obs = obj({ name: 'John' });
            obs.set({ name: 'Jane' });
            obs.reset();
            expect(obs.get('name')).toBe('Jane');
        });
    });

    // -- clone() --------------------------------------------------------------

    describe('clone()', () => {
        it('returns a new independent ObservableObject', () => {
            const obs   = obj({ name: 'John' });
            const clone = obs.clone();
            expect(clone.val()).toEqual({ name: 'John' });
            expect(clone).not.toBe(obs);
        });

        it('mutations on clone do not affect source', () => {
            const obs   = obj({ name: 'John' });
            const clone = obs.clone();
            clone.set({ name: 'Jane' });
            expect(obs.get('name')).toBe('John');
        });

        it('$clone() is an alias for clone()', () => {
            const obs = obj({ name: 'John' });
            expect(obs.$clone()).not.toBe(obs);
        });
    });

});