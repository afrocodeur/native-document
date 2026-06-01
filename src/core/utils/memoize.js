

/**
 * Wraps a function so it executes at most once.
 * Later calls return the cached result without re-executing the function.
 *
 * @template T
 * @param {(...args: any[]) => T} fn - Function to wrap
 * @returns {(...args: any[]) => T} Memoized function
 * @example
 * const init = once(() => expensiveSetup());
 * init(); // runs setup
 * init(); // returns cached result
 */
export const once = (fn) => {
    let result = null;
    return (...args) => {
        if(result != null) {
            return result;
        }
        result = fn(...args);
        return result;
    };
};

/**
 * Creates a lazy proxy that calls fn() once on first property access,
 * then returns properties from the cached result for all later accesses.
 *
 * @template T
 * @param {() => T} fn - Factory function to call once
 * @returns {T} Proxy to the lazily created object
 * @example
 * const store = autoOnce(() => createExpensiveStore());
 * store.count; // triggers createExpensiveStore() on first access
 * store.name; // uses a cached result
 */
export const autoOnce = (fn) => {
    let target = null;
    return new Proxy({}, {
        get: (_, key) => {
            if(target) {
                return target[key];
            }
            target = fn();
            return target[key];
        }
    });
};

/**
 * Wraps a function with key-based memoization.
 * The first argument is used as the cache key; later arguments are passed to fn.
 *
 * @template T
 * @param {(...args: any[]) => T} fn - Function to memoize
 * @returns {(key: any, ...args: any[]) => T} Memoized function
 * @example
 * const getUser = memoize((id) => fetchUser(id));
 * getUser('user-1', 1); // fetches
 * getUser('user-1', 1); // returns cached
 */
export const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const [key, ...rest] = args;
        const cached = cache.get(key);
        if(cached) {
            return cached;
        }
        const result = fn(...rest);
        cache.set(key, result);
        return result;
    };
};

/**
 * Creates a proxy where each property access memorizes the result of calling fn with the property key.
 * If fn accepts arguments (fn.length > 0), the proxy returns a memoized function instead.
 *
 * @template T
 * @param {((key: string|symbol, ...args?: any[]) => T)} fn - Factory function
 * @returns {Record<string|symbol, T>} Proxy with per-key memoized results
 * @example
 * // fn with no args — result memoized by key
 * const icons = autoMemoize((name) => loadIcon(name));
 * icons.home; // calls loadIcon('home'), caches result
 * icons.home; // returns cached
 *
 * // fn with args — returns a memoized function per key
 * const formatters = autoMemoize((locale, value) => format(value, locale));
 * formatters.fr('hello'); // calls format('hello', 'fr'), caches under 'fr'
 */
export const autoMemoize = (fn) => {
    const cache = new Map();
    return new Proxy({}, {
        get: (_, key) => {
            const cached = cache.get(key);
            if(cached) {
                return cached;
            }

            if(fn.length > 0) {
                return (...args) => {
                    const result = fn(...args, key);
                    cache.set(key, result);
                    return result;
                }
            }
            const result = fn(key);
            cache.set(key, result);
            return result;
        }
    });
};