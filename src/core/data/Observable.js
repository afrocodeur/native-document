import ObservableItem from './ObservableItem';
import MemoryManager from "./MemoryManager";
import NativeDocumentError from "../../core/errors/NativeDocumentError";
import ObservableArray from "./ObservableArray";
import Validator from "../utils/validator";
import {nextTick} from "../utils/helpers";
import PluginsManager from "../utils/plugins-manager";
import {ObservableObject} from "./ObservableObject";

import "./observable-helpers/observable.is-to";
import './observable-helpers/observable.prototypes';
import ObservableResource from "./ObservableResource";
import {Formatters} from "../utils/formatters";
/**
 *
 * @param {*} value
 * @param {{ propagation: boolean, reset: boolean} | null} configs
 * @returns {ObservableItem}
 * @constructor
 */
export function Observable(value, configs = null) {
    return new ObservableItem(value, configs);
}

export const $ = Observable;
export const obs = Observable;

/**
 *
 * @param {string} propertyName
 */
Observable.useValueProperty = function(propertyName = 'value') {
    Object.defineProperty(ObservableItem.prototype, propertyName, {
        get() {
            return this.$currentValue;
        },
        set(value) {
            this.set(value);
        },
        configurable: true,
    });
};

Observable.setLocale = function(locale) {
    Formatters.locale = locale.__$Observable ? locale : Observable(locale);
};


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
};


/**
 * Creates an observable array with reactive array methods.
 * All mutations trigger updates automatically.
 *
 * @param {Array} [target=[]] - Initial array value
 * @param {Object|null} [configs=null] - Configuration options
 * // @param {boolean} [configs.propagation=true] - Whether to propagate changes to parent observables
 * // @param {boolean} [configs.deep=false] - Whether to make nested objects observable
 * @param {boolean} [configs.reset=false] - Whether to store initial value for reset()
 * @returns {ObservableArray} An observable array with reactive methods
 * @example
 * const items = Observable.array([1, 2, 3]);
 * items.push(4); // Triggers update
 * items.subscribe((arr) => console.log(arr));
 */
Observable.array = function(target = [], configs = null) {
    return new ObservableArray(target, configs);
};

/**
 *
 * @param {Function} callback
 * @returns {Function}
 */
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
};


/**
 * Creates a computed observable that automatically updates when its dependencies change.
 * The callback is re-executed whenever any dependency observable changes.
 *
 * @param {Function} callback - Function that returns the computed value
 * @param {Array<ObservableItem|ObservableChecker|ObservableProxy>|Function} [dependencies=[]] - Array of observables to watch, or batch function
 * @returns {ObservableItem} A new observable that updates automatically
 * @example
 * const firstName = Observable('John');
 * const lastName = Observable('Doe');
 * const fullName = Observable.computed(
 *   () => `${firstName.val()} ${lastName.val()}`,
 *   [firstName, lastName]
 * );
 *
 * // With batch function
 * const batch = Observable.batch(() => { ...  });
 * const computed = Observable.computed(() => { ... }, batch);
 */
Observable.computed = function(callback, dependencies = []) {
    const getValues = () => dependencies.map((item) => item.val());
    const initialValue = callback(...getValues());
    const observable = new ObservableItem(initialValue);
    const updatedValue = nextTick(() => observable.set(callback(...getValues())));
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('CreateObservableComputed', observable, dependencies);
    }

    if(Validator.isFunction(dependencies)) {
        if(!Validator.isObservable(dependencies.$observer)) {
            throw new NativeDocumentError('Observable.computed : dependencies must be valid batch function');
        }
        dependencies.$observer.subscribe(updatedValue);
        return observable;
    }

    dependencies.forEach(dependency => {
        if(Validator.isProxy(dependency)) {
            dependency.$observables.forEach((observable) => {
                observable.subscribe(updatedValue);
            });
            return;
        }
        dependency.subscribe(updatedValue);
    });

    return observable;
};
ObservableItem.computed = Observable.computed;


Observable.init = function(initialValue, configs = null) {
    return new ObservableObject(initialValue, configs)
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
    if(data?.__$isObservableArray) {
        const result = [];
        for(let i = 0, length = data.length; i < length; i++) {
            const item = data.at(i);
            result.push(Observable.value(item));
        }
        return result;
    }
    if(data?.__$Observable) {
        return data.val();
    }
    if(Validator.isProxy(data)) {
        return data.$value;
    }
    return data;
};

ObservableItem.prototype.resolve = function () {
    return Observable.value(this);
};

Observable.object = Observable.init;
Observable.json = Observable.init;


Observable.resource = function(fn, deps = [], options = false) {
    const config = (typeof options === 'boolean')
        ? { auto: options, debounce: 0, lazy: false }
        : { auto: false, debounce: 0, lazy: false, ...options };

    return new ObservableResource(fn, deps, config);
};