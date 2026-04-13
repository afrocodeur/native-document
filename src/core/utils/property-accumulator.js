import Validator from "./validator";

export const cssPropertyAccumulator = function(initialValue = {}) {
    let data = Validator.isString(initialValue) ? initialValue.split(';').filter(Boolean) : initialValue;

    return {
        add(key, value) {
            if(Array.isArray(data)) {
                data.push(key+':  '+value);
                return;
            }
            if(Validator.isObject(key)) {
                value = key;
                for(const property in value) {
                    data[property] = value[property];
                }
                return;
            }
            data[key] = value;
        },
        value() {
            if(Array.isArray(data)) {
                return data.join(';').concat(';');
            }
            return { ...data };
        },
    };
}

export const classPropertyAccumulator = function(initialValue = []) {
    let data = Validator.isString(initialValue) ? initialValue.split(" ").filter(Boolean) : initialValue;

    return {
        add(key, value = true) {
            if(Validator.isJson(key)) {
                for(const property in key) {
                    if(key[property]) {
                        data[property] = key[property];
                    }
                }
                return;
            }
            if(value != null || key.__$Observable) {
                if(Array.isArray(data)) {
                    data = data.reduce((acc, item) => {
                        acc[item] = true;
                        return acc;
                    }, {});
                }
                if(key.__$Observable) {
                    const uniqueId = `obs-${Math.random().toString(36).substr(2, 9)}`
                    data[uniqueId] = key;
                }
                else {
                    data[key] = value;
                }
                return;
            }
            if(Array.isArray(data)) {
                data.push(key);
                return;
            }
            data[key] = value;
        },
        value() {
            if(Array.isArray(data)) {
                return data.join(' ');
            }
            return { ...data };
        },
    };
}