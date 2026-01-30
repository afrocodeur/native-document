import Validator from "./validator";

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
    }
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
 *
 * @param {*} item
 * @param {string|null} defaultKey
 * @param {?Function} key
 * @returns {*}
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

export const trim = function(str, char) {
    return str.replace(new RegExp(`^[${char}]+|[${char}]+$`, 'g'), '');
}

export const deepClone = (value, onObservableFound) => {
    // Primitives
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
        if (value.hasOwnProperty(key)) {
            cloned[key] = deepClone(value[key]);
        }
    }
    return cloned;
};