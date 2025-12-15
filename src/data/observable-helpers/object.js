import Validator from "../../utils/validator";
import {Observable} from "../Observable";

const ObservableObjectValue = function(data) {
    const result = {};
    for(const key in data) {
        const dataItem = data[key];
        if(Validator.isObservable(dataItem)) {
            let value = dataItem.val();
            if(Array.isArray(value)) {
                value = value.map(item => {
                    if(Validator.isObservable(item)) {
                        return item.val();
                    }
                    if(Validator.isProxy(item)) {
                        return item.$value;
                    }
                    return item;
                });
            }
            result[key] = value;
        } else if(Validator.isProxy(dataItem)) {
            result[key] = dataItem.$value;
        } else {
            result[key] = dataItem;
        }
    }
    return result;
};

const ObservableGet = function(target, property) {
    const item = target[property];
    if(Validator.isObservable(item)) {
        return item.val();
    }
    if(Validator.isProxy(item)) {
        return item.$value;
    }
    return item;
};

/**
 *
 * @param {Object} initialValue
 * @param {{propagation: boolean, deep: boolean, reset: boolean}|null} configs
 * @returns {Proxy}
 */
Observable.init = function(initialValue, configs = null) {
    const data = {};
    for(const key in initialValue) {
        const itemValue = initialValue[key];
        if(Array.isArray(itemValue)) {
            if(configs?.deep !== false) {
                const mappedItemValue = itemValue.map(item => {
                    if(Validator.isJson(item)) {
                        return Observable.json(item, configs);
                    }
                    if(Validator.isArray(item)) {
                        return Observable.array(item, configs);
                    }
                    return Observable(item, configs);
                });
                data[key] = Observable.array(mappedItemValue, configs);
                continue;
            }
            data[key] = Observable.array(itemValue, configs);
            continue;
        }
        if(Validator.isObservable(itemValue) || Validator.isProxy(itemValue)) {
            data[key] = itemValue;
            continue;
        }
        data[key] = Observable(itemValue, configs);
    }

    const $reset = () => {
        for(const key in data) {
            const item = data[key];
            item.reset();
        }
    }

    const $val = () => ObservableObjectValue(data);

    const $clone = () => Observable.init($val(), configs);

    const $updateWith = (values) => {
        Observable.update(proxy, values);
    };

    const $get = (key) => ObservableGet(data, key);

    const proxy = new Proxy(data, {
        get(target, property) {
            if(property === '__isProxy__') { return true; }
            if(property === '$value') { return $val() }
            if(property === 'get' || property === '$get') { return $get; }
            if(property === 'val' || property === '$val') { return $val; }
            if(property === 'set' || property === '$set' || property === '$updateWith') { return $updateWith; }
            if(property === 'observables' || property === '$observables') { return Object.values(target); }
            if(property === 'keys'|| property === '$keys') { return Object.keys(initialValue); }
            if(property === 'clone' || property === '$clone') { return $clone; }
            if(property === 'reset') { return $reset; }
            if(property === 'configs') { return configs; }
            return target[property];
        },
        set(target, prop, newValue) {
            if(target[prop] !== undefined) {
                Validator.isObservable(newValue)
                    ? target[prop].set(newValue.val())
                    : target[prop].set(newValue);
                return true;
            }
            return true;
        }
    });

    return proxy;
};

/**
 *
 * @param {any[]} data
 * @return Proxy[]
 */
Observable.arrayOfObject = function(data) {
    return data.map(item => Observable.object(item));
}

/**
 * Get the value of an observable or an object of observables.
 * @param {ObservableItem|Object<ObservableItem>} data
 * @returns {{}|*|null}
 */
Observable.value = function(data) {
    if(Validator.isObservable(data)) {
        return data.val();
    }
    if(Validator.isProxy(data)) {
        return data.$value;
    }
    if(Validator.isArray(data)) {
        const result = [];
        for(let i = 0, length = data.length; i < length; i++) {
            const item = data[i];
            result.push(Observable.value(item));
        }
        return result;
    }
    return data;
};


Observable.update = function($target, newData) {
    const data = Validator.isProxy(newData) ? newData.$value : newData;
    const configs = $target.configs;

    for(const key in data) {
        const targetItem = $target[key];
        const newValueOrigin = newData[key];
        const newValue = data[key];

        if(Validator.isObservable(targetItem)) {
            if(Validator.isArray(newValue)) {
                const firstElementFromOriginalValue = newValueOrigin.at(0);
                if(Validator.isObservable(firstElementFromOriginalValue) || Validator.isProxy(firstElementFromOriginalValue)) {
                    const newValues = newValue.map(item => {
                        if(Validator.isProxy(firstElementFromOriginalValue)) {
                            return Observable.init(item, configs);
                        }
                        return Observable(item, configs);
                    });
                    targetItem.set(newValues);
                    continue;
                }
                targetItem.set([...newValue]);
                continue;
            }
            targetItem.set(newValue);
            continue;
        }
        if(Validator.isProxy(targetItem)) {
            Observable.update(targetItem, newValue);
            continue;
        }
        $target[key] = newValue;
    }
};

Observable.object = Observable.init;
Observable.json = Observable.init;