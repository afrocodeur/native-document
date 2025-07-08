import ObservableItem from './ObservableItem';
import Validator from "../utils/validator";
import MemoryManager from "./MemoryManager";
import NativeDocumentError from "../errors/NativeDocumentError";

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
Observable.value = function(object) {
    if(Validator.isObservable(object)) {
        return object.val();
    }
    if(typeof object !== 'object') {
        return null;
    }
    const value = {};
    for(const key in object) {
        value[key] = object[key].val();
    }
    return value;
}

/**
 *
 * @param {Object} value
 * @returns {Proxy}
 */
Observable.init = function(value) {
    const data = {};
    for(const key in value) {
        data[key] = Observable(value[key]);
    }
    return new Proxy(data, {
        get(target, property) {
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

