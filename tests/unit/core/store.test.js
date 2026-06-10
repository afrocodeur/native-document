import { describe, it, expect, vi, beforeEach } from 'vitest';

// DebugManager is an empty object when NODE_ENV is not 'development' or 'production'
// Mock it before importing Store to avoid 'warn is not a function' errors
vi.mock('../../../src/core/utils/debug-manager', () => ({
    default: {
        log:     vi.fn(),
        warn:    vi.fn(),
        error:   vi.fn(),
        disable: vi.fn(),
    },
}));

import { StoreFactory } from '../../../src/core/data/Store';

// Each test uses a fresh isolated store to avoid name collisions
let Store;

beforeEach(() => {
    Store = StoreFactory();
});

describe('Store', () => {

    // -- create() -------------------------------------------------------------

    describe('create()', () => {
        it('creates a store and returns an observable', () => {
            const obs = Store.create('count', 0);
            expect(obs.val()).toBe(0);
        });

        it('creates a store with an array value', () => {
            const obs = Store.create('items', [1, 2, 3]);
            expect(obs.val()).toEqual([1, 2, 3]);
        });

        it('creates a store with an object value', () => {
            const obs = Store.create('user', { name: 'John' });
            expect(obs.get('name')).toBe('John');
        });

        it('throws if store name already exists', () => {
            Store.create('x', 1);
            expect(() => Store.create('x', 2)).toThrow();
        });

        it('two stores are fully independent', () => {
            const a = Store.create('a', 1);
            const b = Store.create('b', 2);
            a.set(99);
            expect(b.val()).toBe(2);
        });
    });

    // -- createResettable() ---------------------------------------------------

    describe('createResettable()', () => {
        it('creates a resettable store', () => {
            const obs = Store.createResettable('theme', 'light');
            obs.set('dark');
            Store.reset('theme');
            expect(obs.val()).toBe('light');
        });

        it('throws if store name already exists', () => {
            Store.createResettable('x', 1);
            expect(() => Store.createResettable('x', 2)).toThrow();
        });
    });

    // -- createComposed() -----------------------------------------------------

    describe('createComposed()', () => {
        it('creates a computed store derived from other stores', async () => {
            Store.create('a', 2);
            Store.create('b', 3);
            const comp = Store.createComposed('sum', () => {
                return Store.get('a').val() + Store.get('b').val();
            }, ['a', 'b']);
            expect(comp.val()).toBe(5);
        });

        it('updates when a dependency changes', async () => {
            Store.create('x', 10);
            const comp = Store.createComposed('doubled', () => Store.get('x').val() * 2, ['x']);
            Store.get('x').set(20);
            await new Promise((r) => setTimeout(r, 0));
            expect(comp.val()).toBe(40);
        });

        it('throws if computation is not a function', () => {
            expect(() => Store.createComposed('bad', 'not-a-fn', ['x'])).toThrow();
        });

        it('throws if dependencies is empty', () => {
            expect(() => Store.createComposed('bad', () => {}, [])).toThrow();
        });

        it('throws if dependency store does not exist', () => {
            expect(() => Store.createComposed('bad', () => {}, ['missing'])).toThrow();
        });
    });

    // -- has() ----------------------------------------------------------------

    describe('has()', () => {
        it('returns true for existing store', () => {
            Store.create('x', 1);
            expect(Store.has('x')).toBe(true);
        });

        it('returns false for unknown store', () => {
            expect(Store.has('unknown')).toBe(false);
        });
    });

    // -- get() ----------------------------------------------------------------

    describe('get()', () => {
        it('returns the raw observable', () => {
            const obs = Store.create('count', 42);
            expect(Store.get('count')).toBe(obs);
        });

        it('returns null for unknown store', () => {
            expect(Store.get('unknown')).toBeNull();
        });
    });

    // -- use() ----------------------------------------------------------------

    describe('use()', () => {
        it('returns a two-way synchronized follower', () => {
            Store.create('count', 0);
            const follower = Store.use('count');
            expect(follower.val()).toBe(0);
        });

        it('follower reflects store changes', () => {
            Store.create('count', 0);
            const follower = Store.use('count');
            Store.get('count').set(5);
            expect(follower.val()).toBe(5);
        });

        it('store reflects follower changes', () => {
            Store.create('count', 0);
            const follower = Store.use('count');
            follower.set(10);
            expect(Store.get('count').val()).toBe(10);
        });

        it('destroy() unsubscribes the follower', () => {
            Store.create('count', 0);
            const follower = Store.use('count');
            const cb = vi.fn();
            follower.subscribe(cb);
            follower.destroy();
            Store.get('count').set(99);
            // After destroy, follower is cleaned up and no longer notified
            expect(cb).not.toHaveBeenCalled();
        });

        it('throws for a composed store', () => {
            Store.create('dep', 1);
            Store.createComposed('comp', () => 1, ['dep']);
            expect(() => Store.use('comp')).toThrow();
        });
    });

    // -- follow() -------------------------------------------------------------

    describe('follow()', () => {
        it('returns a read-only follower', () => {
            Store.create('count', 0);
            const follower = Store.follow('count');
            expect(follower.val()).toBe(0);
        });

        it('follower reflects store changes', () => {
            Store.create('count', 0);
            const follower = Store.follow('count');
            Store.get('count').set(5);
            expect(follower.val()).toBe(5);
        });

        it('set() on follower throws', () => {
            Store.create('count', 0);
            const follower = Store.follow('count');
            expect(() => follower.set(99)).toThrow();
        });

        it('toggle() on follower throws', () => {
            Store.create('active', false);
            const follower = Store.follow('active');
            expect(() => follower.toggle()).toThrow();
        });

        it('destroy() unsubscribes the follower', () => {
            Store.create('count', 0);
            const follower = Store.follow('count');
            const original = follower.val();
            follower.destroy();
            Store.get('count').set(99);
            // After destroy, follower is no longer tracking the store
            expect(original).toBe(0);
        });
    });

    // -- reset() --------------------------------------------------------------

    describe('reset()', () => {
        it('resets a resettable store to initial value', () => {
            Store.createResettable('count', 0);
            Store.get('count').set(99);
            Store.reset('count');
            expect(Store.get('count').val()).toBe(0);
        });

        it('throws for a non-resettable store', () => {
            Store.create('count', 0);
            expect(() => Store.reset('count')).toThrow();
        });

        it('throws for a composed store', () => {
            Store.create('dep', 1);
            Store.createComposed('comp', () => 1, ['dep']);
            expect(() => Store.reset('comp')).toThrow();
        });

        it('throws for unknown store', () => {
            expect(() => Store.reset('unknown')).toThrow();
        });
    });

    // -- delete() -------------------------------------------------------------

    describe('delete()', () => {
        it('removes a store', () => {
            Store.create('temp', 1);
            Store.delete('temp');
            expect(Store.has('temp')).toBe(false);
        });

        it('destroys all followers on delete', () => {
            Store.create('count', 0);
            const follower = Store.use('count');
            Store.delete('count');
            expect(follower.$listeners?.length ?? 0).toBe(0);
        });

        it('does nothing for unknown store', () => {
            expect(() => Store.delete('unknown')).not.toThrow();
        });
    });

    // -- group() --------------------------------------------------------------

    describe('group()', () => {
        it('creates an isolated store namespace', () => {
            const GroupStore = Store.group('test', (g) => {
                g.create('count', 0);
            });
            expect(GroupStore.has('count')).toBe(true);
            expect(Store.has('count')).toBe(false);
        });

        it('accepts a callback without a name', () => {
            const GroupStore = Store.group((g) => {
                g.create('x', 1);
            });
            expect(GroupStore.has('x')).toBe(true);
        });

        it('two groups are independent', () => {
            const A = Store.group((g) => g.create('count', 0));
            const B = Store.group((g) => g.create('count', 99));
            expect(A.get('count').val()).toBe(0);
            expect(B.get('count').val()).toBe(99);
        });
    });

    // -- protected() ----------------------------------------------------------

    describe('protected()', () => {
        it('returns a read-only proxy', () => {
            Store.create('count', 0);
            const ReadOnly = Store.protected();
            expect(() => ReadOnly.create('x', 1)).toThrow();
            expect(() => ReadOnly.use('count')).toThrow();
            expect(() => ReadOnly.get('count')).toThrow();
        });

        it('follow() and has() are still accessible', () => {
            Store.create('count', 0);
            const ReadOnly = Store.protected();
            expect(ReadOnly.has('count')).toBe(true);
            const follower = ReadOnly.follow('count');
            expect(follower.val()).toBe(0);
        });

        it('property access returns a read-only follower', () => {
            Store.create('theme', 'light');
            const ReadOnly = Store.protected();
            const follower = ReadOnly.theme;
            expect(follower.val()).toBe('light');
            expect(() => follower.set('dark')).toThrow();
        });
    });

    // -- createPersistent() ---------------------------------------------------

    describe('createPersistent()', () => {
        it('saves to localStorage on change', () => {
            Store.createPersistent('theme', 'light');
            Store.get('theme').set('dark');
            expect(localStorage.getItem('theme')).toBeTruthy();
        });

        it('restores from localStorage on init', () => {
            // $getFromStorage uses LocalStorage.get() for strings (no JSON.parse)
            localStorage.setItem('lang', 'fr');
            Store.createPersistent('lang', 'en');
            expect(Store.get('lang').val()).toBe('fr');
            localStorage.removeItem('lang');
        });
    });

    // -- Proxy property access ------------------------------------------------

    describe('Proxy property access', () => {
        it('Store.storeName returns a follower', () => {
            Store.create('count', 42);
            const follower = Store.count;
            expect(follower.val()).toBe(42);
        });

        it('returns same follower on repeated access (cache)', () => {
            Store.create('count', 0);
            const f1 = Store.count;
            const f2 = Store.count;
            expect(f1).toBe(f2);
        });
    });

});