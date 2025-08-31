import Validator from "./validator";

export const CssPropertyAccumulator = function(initialValue) {
    let data = Validator.isString(initialValue) ? initialValue.split(';') : initialValue;
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
                return data.join(';');
            }
            return { ...data };
        },
    };
}

export const ClassPropertyAccumulator = function(initialValue = []) {
    let data = Validator.isString(initialValue) ? initialValue.split(" ") : initialValue;
    const isArray = Validator.isArray(data);

    return {
        push(key, value = true) {
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