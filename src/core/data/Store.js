import { Observable } from "./Observable";
import NativeDocumentError from "../errors/NativeDocumentError";
import DebugManager from "../utils/debug-manager";

export const StoreFactory = function() {

    const $stores = new Map();
    const $followersCache = new Map();

    /**
     * Internal helper — retrieves a store entry or throws if not found.
     */
    const $getStoreOrThrow = (method, name) => {
        const item = $stores.get(name);
        if (!item) {
            DebugManager.error('Store', `Store.${method}('${name}') : store not found. Did you call Store.create('${name}') first?`);
            throw new NativeDocumentError(
                `Store.${method}('${name}') : store not found.`
            );
        }
        return item;
    };

    /**
     * Internal helper — blocks write operations on a read-only observer.
     */
    const $applyReadOnly = (observer, name, context) => {
        const readOnlyError = (method) => () => {
            DebugManager.error('Store', `Store.${context}('${name}') is read-only. '${method}()' is not allowed.`);
            throw new NativeDocumentError(
                `Store.${context}('${name}') is read-only.`
            );
        };
        observer.set    = readOnlyError('set');
        observer.toggle = readOnlyError('toggle');
        observer.reset  = readOnlyError('reset');
    };

    const $createObservable = (value, options = {}) => {
        if(Array.isArray(value)) {
            return Observable.array(value, options);
        }
        if(typeof value === 'object') {
            return Observable.object(value, options);
        }
        return Observable(value, options);
    }

    const $api = {
        /**
         * Create a new state and return the observer.
         * Throws if a store with the same name already exists.
         *
         * @param {string} name
         * @param {*} value
         * @returns {ObservableItem}
         */
        create(name, value) {
            if ($stores.has(name)) {
                DebugManager.warn('Store', `Store.create('${name}') : a store with this name already exists. Use Store.get('${name}') to retrieve it.`);
                throw new NativeDocumentError(
                    `Store.create('${name}') : a store with this name already exists.`
                );
            }
            const observer = $createObservable(value)
            $stores.set(name, { observer, subscribers: new Set(), resettable: false, composed: false });
            return observer;
        },

        /**
         * Create a new resettable state and return the observer.
         * The store can be reset to its initial value via Store.reset(name).
         * Throws if a store with the same name already exists.
         *
         * @param {string} name
         * @param {*} value
         * @returns {ObservableItem}
         */
        createResettable(name, value) {
            if ($stores.has(name)) {
                DebugManager.warn('Store', `Store.createResettable('${name}') : a store with this name already exists.`);
                throw new NativeDocumentError(
                    `Store.createResettable('${name}') : a store with this name already exists.`
                );
            }
            const observer = $createObservable(value, { reset: true });
            $stores.set(name, { observer, subscribers: new Set(), resettable: true, composed: false });
            return observer;
        },

        /**
         * Create a computed store derived from other stores.
         * The value is automatically recalculated when any dependency changes.
         * This store is read-only — Store.use() and Store.set() will throw.
         * Throws if a store with the same name already exists.
         *
         * @param {string} name
         * @param {() => *} computation - Function that returns the computed value
         * @param {string[]} dependencies - Names of the stores to watch
         * @returns {ObservableItem}
         *
         * @example
         * Store.create('products', [{ id: 1, price: 10 }]);
         * Store.create('cart', [{ productId: 1, quantity: 2 }]);
         *
         * Store.createComposed('total', () => {
         *     const products = Store.get('products').val();
         *     const cart     = Store.get('cart').val();
         *     return cart.reduce((sum, item) => {
         *         const product = products.find(p => p.id === item.productId);
         *         return sum + (product.price * item.quantity);
         *     }, 0);
         * }, ['products', 'cart']);
         */
        createComposed(name, computation, dependencies) {
            if ($stores.has(name)) {
                DebugManager.warn('Store', `Store.createComposed('${name}') : a store with this name already exists.`);
                throw new NativeDocumentError(
                    `Store.createComposed('${name}') : a store with this name already exists.`
                );
            }
            if (typeof computation !== 'function') {
                throw new NativeDocumentError(
                    `Store.createComposed('${name}') : computation must be a function.`
                );
            }
            if (!Array.isArray(dependencies) || dependencies.length === 0) {
                throw new NativeDocumentError(
                    `Store.createComposed('${name}') : dependencies must be a non-empty array of store names.`
                );
            }

            // Resolve dependency observers
            const depObservers = dependencies.map(depName => {
                if(typeof depName !== 'string') {
                    return depName;
                }
                const depItem = $stores.get(depName);
                if (!depItem) {
                    DebugManager.error('Store', `Store.createComposed('${name}') : dependency '${depName}' not found. Create it first.`);
                    throw new NativeDocumentError(
                        `Store.createComposed('${name}') : dependency store '${depName}' not found.`
                    );
                }
                return depItem.observer;
            });

            // Create computed observable from dependency observers
            const observer = Observable.computed(computation, depObservers);

            $stores.set(name, { observer, subscribers: new Set(), resettable: false, composed: true });
            return observer;
        },

        /**
         * Returns true if a store with the given name exists.
         *
         * @param {string} name
         * @returns {boolean}
         */
        has(name) {
            return $stores.has(name);
        },

        /**
         * Resets a resettable store to its initial value and notifies all subscribers.
         * Throws if the store was not created with createResettable().
         *
         * @param {string} name
         */
        reset(name) {
            const item = $getStoreOrThrow('reset', name);
            if (item.composed) {
                DebugManager.error('Store', `Store.reset('${name}') : composed stores cannot be reset. Their value is derived from dependencies.`);
                throw new NativeDocumentError(
                    `Store.reset('${name}') : composed stores cannot be reset.`
                );
            }
            if (!item.resettable) {
                DebugManager.error('Store', `Store.reset('${name}') : this store is not resettable. Use Store.createResettable('${name}', value) instead of Store.create().`);
                throw new NativeDocumentError(
                    `Store.reset('${name}') : this store is not resettable. Use Store.createResettable('${name}', value) instead of Store.create().`
                );
            }
            item.observer.reset();
        },

        /**
         * Returns a two-way synchronized follower of the store.
         * Writing to the follower propagates the value back to the store and all its subscribers.
         * Throws if called on a composed store — use Store.follow() instead.
         * Call follower.destroy() or follower.dispose() to unsubscribe.
         *
         * @param {string} name
         * @returns {ObservableItem}
         */
        use(name) {
            const item = $getStoreOrThrow('use', name);

            if (item.composed) {
                DebugManager.error('Store', `Store.use('${name}') : composed stores are read-only. Use Store.follow('${name}') instead.`);
                throw new NativeDocumentError(
                    `Store.use('${name}') : composed stores are read-only. Use Store.follow('${name}') instead.`
                );
            }

            const { observer: originalObserver, subscribers } = item;
            const observerFollower = $createObservable(originalObserver.val());

            const onStoreChange    = value => observerFollower.set(value);
            const onFollowerChange = value => originalObserver.set(value);

            originalObserver.subscribe(onStoreChange);
            observerFollower.subscribe(onFollowerChange);

            observerFollower.destroy = () => {
                originalObserver.unsubscribe(onStoreChange);
                observerFollower.unsubscribe(onFollowerChange);
                subscribers.delete(observerFollower);
                observerFollower.cleanup();
            };
            observerFollower.dispose = observerFollower.destroy;

            subscribers.add(observerFollower);
            return observerFollower;
        },

        /**
         * Returns a read-only follower of the store.
         * The follower reflects store changes but cannot write back to the store.
         * Any attempt to call .set(), .toggle() or .reset() will throw.
         * Call follower.destroy() or follower.dispose() to unsubscribe.
         *
         * @param {string} name
         * @returns {ObservableItem}
         */
        follow(name) {
            const { observer: originalObserver, subscribers } = $getStoreOrThrow('follow', name);
            const observerFollower = $createObservable(originalObserver.val());

            const onStoreChange = value => observerFollower.set(value);
            originalObserver.subscribe(onStoreChange);

            $applyReadOnly(observerFollower, name, 'follow');

            observerFollower.destroy = () => {
                originalObserver.unsubscribe(onStoreChange);
                subscribers.delete(observerFollower);
                observerFollower.cleanup();
            };
            observerFollower.dispose = observerFollower.destroy;

            subscribers.add(observerFollower);
            return observerFollower;
        },

        /**
         * Returns the raw store observer directly (no follower, no cleanup contract).
         * Use this for direct read access when you don't need to unsubscribe.
         * WARNING : mutations on this observer impact all subscribers immediately.
         *
         * @param {string} name
         * @returns {ObservableItem|null}
         */
        get(name) {
            const item = $stores.get(name);
            if (!item) {
                DebugManager.warn('Store', `Store.get('${name}') : store not found.`);
                return null;
            }
            return item.observer;
        },

        /**
         * @param {string} name
         * @returns {{ observer: ObservableItem, subscribers: Set } | null}
         */
        getWithSubscribers(name) {
            return $stores.get(name) ?? null;
        },

        /**
         * Destroys a store : cleans up the observer, destroys all followers, and removes the entry.
         *
         * @param {string} name
         */
        delete(name) {
            const item = $stores.get(name);
            if (!item) {
                DebugManager.warn('Store', `Store.delete('${name}') : store not found, nothing to delete.`);
                return;
            }
            item.subscribers.forEach(follower => follower.destroy());
            item.subscribers.clear();
            item.observer.cleanup();
            $stores.delete(name);
        },
        /**
         * Creates an isolated store group with its own state namespace.
         * Each group is a fully independent StoreFactory instance —
         * no key conflicts, no shared state with the parent store.
         *
         * @param {string | ((group: ReturnType<typeof StoreFactory>) => void)} name - Group name for debugging, or setup callback if no name is provided
         * @param {((group: ReturnType<typeof StoreFactory>) => void)} [callback] - Setup function receiving the isolated store instance
         * @returns {ReturnType<typeof StoreFactory>}
         *
         * @example
         * // With name (recommended)
         * const EventStore = Store.group('events', (group) => {
         *     group.create('catalog', []);
         *     group.create('filters', { category: null, date: null });
         *     group.createResettable('selected', null);
         *     group.createComposed('filtered', () => {
         *         const catalog = EventStore.get('catalog').val();
         *         const filters = EventStore.get('filters').val();
         *         return catalog.filter(event => {
         *             if (filters.category && event.category !== filters.category) return false;
         *             return true;
         *         });
         *     }, ['catalog', 'filters']);
         * });
         *
         * // Without name
         * const CartStore = Store.group((group) => {
         *     group.create('items', []);
         * });
         *
         * // Usage
         * EventStore.use('catalog'); // two-way follower
         * EventStore.follow('filtered'); // read-only follower
         * EventStore.get('filters'); // raw observable
         *
         * // Cross-group composed
         * const OrderStore = Store.group('orders', (group) => {
         *     group.createComposed('summary', () => {
         *         const items = CartStore.get('items').val();
         *         const events = EventStore.get('catalog').val();
         *         return { items, events };
         *     }, [CartStore.get('items'), EventStore.get('catalog')]);
         * });
         */
        group(name, callback) {
            if (typeof name === 'function') {
                callback = name;
                name = 'anonymous';
            }
            const store = StoreFactory();
            callback && callback(store);
            return store;
        }
    };


    return new Proxy($api, {
        get(target, prop) {
            if (typeof prop === 'symbol' || prop.startsWith('$') || prop in target) {
                return target[prop];
            }
            if (target.has(prop)) {
                if ($followersCache.has(prop)) {
                    return $followersCache.get(prop);
                }
                const follower = target.follow(prop);
                $followersCache.set(prop, follower);
                return follower;
            }
            return undefined;
        },
        set(target, prop, value) {
            DebugManager.error('Store', `Forbidden: You cannot overwrite the store key '${String(prop)}'. Use .use('${String(prop)}').set(value) instead.`);
            throw new NativeDocumentError(`Store structure is immutable. Use .set() on the observable.`);
        },
        deleteProperty(target, prop) {
            throw new NativeDocumentError(`Store keys cannot be deleted.`);
        }
    });
};

export const Store = StoreFactory();