/**
 *
 * @param {Function} fn
 * @param {number} delay
 * @param {{leading:Boolean, trailing:Boolean, debounce:Boolean}}options
 * @returns {(function(...[*]): void)|*}
 */
export const throttle = function(fn, delay, options = {}) {
    let timer = null;
    let lastExecTime = 0;
    const { leading = true, trailing = true, debounce = false } = options;

    return  function(...args) {
        const now = Date.now();
        if (debounce) {
            // debounce mode: reset the timer for each call
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
            return;
        }
        if (leading && now - lastExecTime >= delay) {
            fn.apply(this, args);
            lastExecTime = now;
        }
        if (trailing && !timer) {
            timer = setTimeout(() => {
                fn.apply(this, args);
                lastExecTime = Date.now();
                timer = null;
            }, delay - (now - lastExecTime));
        }
    }
};

export const trim = function(str, char) {
    return str.replace(new RegExp(`^[${char}]+|[${char}]+$`, 'g'), '');
}