

export const once = (fn) => {
    let result = null;
    return (...args) => {
        if(result) {
            return result;
        }
        result = fn(...args);
        return result;
    };
};

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