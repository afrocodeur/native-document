import ObservableItem from './ObservableItem';
import Validator from "../utils/validator";
import MemoryManager from "./MemoryManager";
import NativeDocumentError from "../errors/NativeDocumentError";
import {throttle} from "../utils/helpers.js";

/**
 *
 * @param {*} value
 * @returns {ObservableItem}
 * @constructor
 */
export function Observable(value) {
    return new ObservableItem(value);
}


Observable.computed = function(callback, dependencies = []) {
    const initialValue = callback();
    const observable = new ObservableItem(initialValue);

    const updatedValue = throttle(() => observable.set(callback()), 10, { debounce: true });

    dependencies.forEach(dependency => dependency.subscribe(updatedValue));

    return observable;
};

/**
 *
 * @param {ObservableItem} observable
 */
Observable.cleanup = function(observable) {
    observable.cleanup();
};

/**
 * Get the value of an observable or an object of observables.
 * @param {ObservableItem|Object<ObservableItem>} object
 * @returns {{}|*|null}
 */
Observable.value = function(data) {
    if(Validator.isObservable(data)) {
        return data.val();
    }
    if(Validator.isProxy(data)) {
        return data.$val();
    }
    if(Validator.isArray(data)) {
        const result = [];
        data.forEach(item => {
            result.push(Observable.value(item));
        });
        return result;
    }
    return data;
}

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
        data[key] = Observable(itemValue);
    }

    const $val = function() {
        const result = {};
        for(const key in data) {
            const dataItem = data[key];
            if(Validator.isObservable(dataItem)) {
                result[key] = dataItem.val();
            } else if(Validator.isProxy(dataItem)) {
                result[key] = dataItem.$val();
            } else {
                result[key] = dataItem;
            }
        }
        return result;
    };

    return new Proxy(data, {
        get(target, property) {
            if(property === '__isProxy__') {
                return true;
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
                target[prop].set(newValue);
            }
        }
    })
};

Observable.object = Observable.init;
/**
 *
 * @param {Array} target
 * @returns {ObservableItem}
 */
Observable.array = function(target) {
    if(!Array.isArray(target)) {
        throw new NativeDocumentError('Observable.array : target must be an array');
    }
    const observer = Observable(target);

    const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];

    methods.forEach((method) => {
        observer[method] = function(...values) {
            const target = observer.val();
            const result = target[method].apply(target, arguments);
            observer.trigger();
            return result;
        };
    });

    const overrideMethods = ['map', 'filter', 'reduce', 'some', 'every', 'find'];
    overrideMethods.forEach((method) => {
        observer[method] = function(callback) {
            return observer.val()[method](callback);
        };
    })

    return observer;
};

/**
 * Enable auto cleanup of observables.
 * @param {Boolean} enable
 * @param {{interval:Boolean, threshold:number}} options
 */
Observable.autoCleanup = function(enable = false, options = {}) {
    if(!enable) {
        return;
    }
    const { interval = 60000, threshold = 100 } = options;

    window.addEventListener('beforeunload', () => {
        MemoryManager.cleanup();
    });

    setInterval(() => MemoryManager.cleanObservables(threshold), interval);
}

