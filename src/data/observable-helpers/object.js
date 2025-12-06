import Validator from "../../utils/validator";
import {Observable} from "../Observable";
import ObservableItem from "../ObservableItem";



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
 * @param {{propagation: boolean, deep: boolean}} configs
 * @returns {Proxy}
 */
Observable.init = function(initialValue, { propagation= false, deep = true } = {}) {
    const data = {};
    for(const key in initialValue) {
        const itemValue = initialValue[key];
        if(Array.isArray(itemValue)) {
            if(deep) {
                const mappedItemValue = itemValue.map(item => {
                    if(Validator.isJson(item)) {
                        return Observable.json(item, { propagation, deep });
                    }
                    if(Validator.isArray(item)) {
                        return Observable.array(item, { propagation, deep });
                    }
                    return Observable(item);
                });
                data[key] = Observable.array(mappedItemValue, { propagation });
                continue;
            }
            data[key] = Observable.array(itemValue, { propagation });
            continue;
        }
        if(Validator.isObservable(itemValue) || Validator.isProxy(itemValue)) {
            data[key] = itemValue;
            continue;
        }
        data[key] = Observable(itemValue);
    }

    const $val = () => ObservableObjectValue(data);

    const $clone = () => Observable.init($val(), { propagation, deep });

    const $updateWith = (values) => {
        Observable.update(proxy, values);
    };

    const $get = (key) => ObservableGet(data, key);

    const proxy = new Proxy(data, {
        get(target, property) {
            if(property === '__isProxy__') {
                return true;
            }
            if(property === '$value') {
                return $val();
            }
            if(property === '$clone') {
                return $clone;
            }
            if(property === '$keys') {
                return Object.keys(initialValue);
            }
            if(property === '$observables') {
                return Object.values(target);
            }
            if(property === '$set' || property === '$updateWith') {
                return $updateWith;
            }
            if(property === '$get') {
                return $get;
            }
            if(property === '$val') {
                return $val;
            }
            if(target[property] !== undefined) {
                return target[property];
            }
            return undefined;
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
                            return Observable.init(item);
                        }
                        return Observable(item);
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