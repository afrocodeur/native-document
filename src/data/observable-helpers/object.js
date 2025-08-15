import Validator from "../../utils/validator";
import {Observable} from "../Observable";

/**
 *
 * @param {Object} value
 * @returns {Proxy}
 */
Observable.init = function(value) {
    const data = {};
    for(const key in value) {
        const itemValue = value[key];
        if(Validator.isJson(itemValue)) {
            data[key] = Observable.init(itemValue);
            continue;
        }
        else if(Validator.isArray(itemValue)) {
            data[key] = Observable.array(itemValue);
            continue;
        }
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

    };

    return new Proxy(data, {
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
            if(target[property] !== undefined) {
                return target[property];
            }
            return undefined;
        },
        set(target, prop, newValue) {
            if(target[prop] !== undefined) {
                target[prop].set(newValue);
            }
        }
    })
};

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
        data.forEach(item => {
            result.push(Observable.value(item));
        });
        return result;
    }
    return data;
};


Observable.update = function($target, data) {
    for(const key in data) {
        const targetItem = $target[key];
        const newValue = data[key];

        if(Validator.isObservable(targetItem)) {
            if(Validator.isArray(newValue)) {
                Observable.update(targetItem, newValue);
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