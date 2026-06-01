import Validator from './validator';

/**
 * Calls a function with the given arguments and optional context.
 *
 * @internal
 * @param {Function} fn - Function to invoke
 * @param {Array} args - Arguments to pass
 * @param {Object|null} [context] - `this` context, or null to call without binding
 */
const invoke = function(fn, args, context) {
    if(context) {
        fn.apply(context, args);
    } else {
        fn(...args);
    }
};
/**
 *
 * @param {Function} fn
 * @param {number} delay
 * @param {{leading?:Boolean, trailing?:Boolean, debounce?:Boolean, check: Function}}options
 * @returns {(function(...[*]): void)|*}
 */
export const debounce = function(fn, delay, options = {}) {
    let timer = null;
    let lastArgs = null;

    return  function(...args) {
        const context = options.context === true ? this : null;
        let scopeDelay = delay;
        if(options.check) {
            const response = options.check(...args);
            if(typeof response === 'number') {
                scopeDelay = response;
            }
        }
        lastArgs = args;

        // debounce mode: reset the timer for each call
        clearTimeout(timer);
        timer = setTimeout(() => invoke(fn, lastArgs, context), delay);
    };
};

export const nextTick = function(fn) {
    let pending = false;
    return function(...args) {
        if (pending) return;
        pending = true;

        Promise.resolve().then(() => {
            fn.apply(this, args);
            pending = false;
        });
    };
};


/**
 * Returns the unique key for a given item, used by ForEach and ForEachArray for DOM diffing.
 * Resolution order:
 * 1. If key is a function: calls key(item, defaultKey)
 * 2. If key is a string: reads item[key] (unwrapping observables)
 * 3. Otherwise: returns item value or defaultKey
 *
 * @param {*} item - The item to extract a key from
 * @param {string|number} defaultKey - Fallback key (usually the array index)
 * @param {string|Function|null} key - Key property name or custom key function
 * @returns {string|number} The resolved unique key
 */
export const getKey = (item, defaultKey, key) => {
    if (Validator.isString(key)) {
        const val = Validator.isObservable(item) ? item.val() : item;
        const result = val?.[key];
        return Validator.isObservable(result) ? result.val() : (result ?? defaultKey);
    }

    if (Validator.isFunction(key)) {
        return key(item, defaultKey);
    }

    const val = Validator.isObservable(item) ? item.val() : item;
    return val ?? defaultKey;
};

/**
 * Trims all leading and trailing occurrences of char from str.
 *
 * @param {string} str - String to trim
 * @param {string} char - Character to remove from both ends
 * @returns {string} Trimmed string
 * @example
 * trim('/foo/bar/', '/'); // 'foo/bar'
 */
export const trim = function(str, char) {
    return str.replace(new RegExp(`^[${char}]+|[${char}]+$`, 'g'), '');
};

/**
 * Deep clones a value. Uses structuredClone when available.
 * Handles: primitives, Dates, Arrays, plain Objects.
 * Observables are kept by reference (not cloned); onObservableFound is called for each.
 *
 * @param {*} value - Value to clone
 * @param {((observable: ObservableItem) => void)?} [onObservableFound] - Called for each observable encountered
 * @returns {*} Deep clone of the value
 */
export const deepClone = (value, onObservableFound) => {
    try {
        if(window.structuredClone !== undefined) {
            return window.structuredClone(value);
        }
    } catch (e){}

    if (value === null || typeof value !== 'object') {
        return value;
    }

    // Dates
    if (value instanceof Date) {
        return new Date(value.getTime());
    }

    // Arrays
    if (Array.isArray(value)) {
        return value.map(item => deepClone(item));
    }

    // Observables - keep the référence
    if (Validator.isObservable(value)) {
        onObservableFound && onObservableFound(value);
        return value;
    }

    // Objects
    const cloned = {};
    for (const key in value) {
        if (Object.hasOwn(value, key)) {
            cloned[key] = deepClone(value[key]);
        }
    }
    return cloned;
};