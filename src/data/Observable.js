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

/**
 *
 * @param {Function} callback
 * @param {Array|Function} dependencies
 * @returns {ObservableItem}
 */
Observable.computed = function(callback, dependencies = []) {
    const initialValue = callback();
    const observable = new ObservableItem(initialValue);
    const updatedValue = () => observable.set(callback());

    if(Validator.isFunction(dependencies)) {
        if(!Validator.isObservable(dependencies.$observer)) {
            throw new NativeDocumentError('Observable.computed : dependencies must be valid batch function');
        }
        dependencies.$observer.subscribe(updatedValue);
        return observable;
    }

    dependencies.forEach(dependency => dependency.subscribe(updatedValue));

    return observable;
};

Observable.batch = function(callback) {
    const $observer = Observable(0);
    const batch = function() {
        if(Validator.isAsyncFunction(callback)) {
            return (callback(...arguments)).then(() => {
                $observer.trigger();
            }).catch(error => { throw error; });
        }
        callback(...arguments);
        $observer.trigger();
    };
    batch.$observer = $observer;
    return batch;
}

/**
 *
 * @param id
 * @returns {ObservableItem|null}
 */
Observable.getById = function(id) {
    const item = MemoryManager.getObservableById(parseInt(id));
    if(!item) {
        throw new NativeDocumentError('Observable.getById : No observable found with id ' + id);
    }
    return item;
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
                result[key] = dataItem.$val();
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
            if(property === '$val') {
                return $val;
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

Observable.object = Observable.init;
Observable.json = Observable.init;
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

