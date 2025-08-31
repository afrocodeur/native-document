import Validator from "./validator";

export const cssPropertyAccumulator = function(initialValue = {}) {
    let data = Validator.isString(initialValue) ? initialValue.split(';').filter(Boolean) : initialValue;
    const isArray = Validator.isArray(data);

    return {
        add(key, value) {
            if(isArray) {
                data.push(key+' :  '+value);
                return;
            }
            data[key] = value;
        },
        value() {
            if(isArray) {
                return data.join(';').concat(';');
            }
            return { ...data };
        },
    };
}

export const classPropertyAccumulator = function(initialValue = []) {
    let data = Validator.isString(initialValue) ? initialValue.split(" ").filter(Boolean) : initialValue;
    const isArray = Validator.isArray(data);

    return {
        add(key, value = true) {
            if(isArray) {
                data.push(key);
                return;
            }
            data[key] = value;
        },
        value() {
            if(isArray) {
                return data.join(' ');
            }
            return { ...data };
        },
    };
}