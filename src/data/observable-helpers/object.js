import Validator from "../../utils/validator";
import {Observable} from "../Observable";
import ObservableItem from "../ObservableItem";

/**
 *
 * @param {Object} initialValue
 * @returns {Proxy}
 */
Observable.init = function(initialValue) {
    const data = {};
    for(const key in initialValue) {
        const itemValue = initialValue[key];
        data[key] = Observable(itemValue);
    }

    const $val = function() {
        const result = {};
        for(const key in data) {
            const dataItem = data[key];
            if(Validator.isObservable(dataItem)) {
                result[key] = dataItem.val();
            } else if(Validator.isProxy(dataItem)) {
                result[key] = dataItem.$value;
            } else {
                result[key] = dataItem;
            }
        }
        return result;
    };
    const $clone = function() {
        return Observable.init($val());
    };
    const $updateWith = function(values) {
        Observable.update(proxy, values);
    };

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
            if(property === '$observables') {
                return Object.values(target);
            }
            if(property === '$updateWith') {
                return $updateWith;
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


Observable.update = function($target, data) {
    if(Validator.isProxy(data)) {
        data = data.$value;
    }
    for(const key in data) {
        const targetItem = $target[key];
        const newValue = data[key];

        if(Validator.isObservable(targetItem)) {
            if(Validator.isArray(newValue)) {
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