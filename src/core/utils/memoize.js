

export const once = (fn) => {
    let result = null;
    return (...args) => {
        if(result === null) {
            result = fn(...args);
        }
        return result;
    };
};

export const autoOnce = (fn) => {
    let target = null;
    return new Proxy({}, {
        get: (_, key) => {
            if(target === null) {
                target = fn();
            }
            return target[key];
        }
    });
};

export const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const [key, ...rest] = args;
        if(!cache.has(key)) {
            cache.set(key, fn(...rest));
        }
        return cache.get(key);
    };
};

export const autoMemoize = (fn) => {
    const cache = new Map();
    return new Proxy({}, {
        get: (_, key) => {
            if(!cache.has(key)) {
                if(fn.length > 0) {
                    return (...args) => {
                        const result = fn(...args);
                        cache.set(key, result);
                        return result;
                    }
                }
                cache.set(key, fn());
            }
            return cache.get(key);
        }
    });
};