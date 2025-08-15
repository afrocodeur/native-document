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


/**
 *
 * @param {*} item
 * @param {string|null} defaultKey
 * @param {?Function} key
 * @returns {*}
 */
export const getKey = (item, defaultKey, key) => {
    if(Validator.isFunction(key)) return key(item, defaultKey);
    if(Validator.isObservable(item)) {
        const val = item.val();
        return (val && key) ? val[key] : defaultKey;
    }
    if(!Validator.isObject(item)) {
        return item;
    }
    return item[key] ?? defaultKey;
};

export const trim = function(str, char) {
    return str.replace(new RegExp(`^[${char}]+|[${char}]+$`, 'g'), '');
}