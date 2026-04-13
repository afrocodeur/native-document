import DebugManager from "../../core/utils/debug-manager";
import MemoryManager from "./MemoryManager";
import NativeDocumentError from "../../core/errors/NativeDocumentError";
import ObservableChecker from "./ObservableChecker";
import PluginsManager from "../../core/utils/plugins-manager";
import Validator from "../../core/utils/validator";
import {ObservableWhen} from "./ObservableWhen";
import {deepClone} from "../utils/helpers";
import { Formatters} from "../utils/formatters";
import {Observable} from "./Observable";
import {$getFromStorage, $saveToStorage} from "../utils/localstorage";

/**
 *
 * @param {*} value
 * @param {{ propagation: boolean, reset: boolean} | null} configs
 * @class ObservableItem
 */
export default function ObservableItem(value, configs = null) {
    value = Validator.isObservable(value) ? value.val() : value;

    this.$previousValue = null;
    this.$currentValue = value;
    if(process.env.NODE_ENV === 'development') {
        this.$isCleanedUp = false;
    }

    this.$firstListener = null;
    this.$listeners = null;
    this.$watchers = null;

    this.$memoryId = null;

    if(configs) {
        this.configs = configs;
        if(configs.reset) {
            this.$initialValue = Validator.isObject(value) ? deepClone(value) : value;
        }
    }
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('CreateObservable', this);
    }
}

Object.defineProperty(ObservableItem.prototype, '$value', {
    get() {
        return this.$currentValue;
    },
    set(value) {
        this.set(value);
    },
    configurable: true,
});

ObservableItem.prototype.__$Observable = true;
ObservableItem.prototype.__$isObservable = true;
const DEFAULT_OPERATIONS = {};
const noneTrigger = function() {};

/**
 * Intercepts and transforms values before they are set on the observable.
 * The interceptor can modify the value or return undefined to use the original value.
 *
 * @param {(value) => any} callback - Interceptor function that receives (newValue, currentValue) and returns the transformed value or undefined
 * @returns {ObservableItem} The observable instance for chaining
 * @example
 * const count = Observable(0);
 * count.intercept((newVal, oldVal) => Math.max(0, newVal)); // Prevent negative values
 */
ObservableItem.prototype.intercept = function(callback) {
    this.$interceptor = callback;
    this.set = this.$setWithInterceptor;
    return this;
};

ObservableItem.prototype.interceptMutations = function(callback) {
    this.$mutationInterceptor = callback;
    return this;
};

ObservableItem.prototype.triggerFirstListener = function(operations) {
    this.$firstListener(this.$currentValue, this.$previousValue, operations);
};

ObservableItem.prototype.triggerListeners = function(operations) {
    const $listeners = this.$listeners;
    const $previousValue = this.$previousValue;
    const $currentValue = this.$currentValue;

    for(let i = 0, length = $listeners.length; i < length; i++) {
        $listeners[i]($currentValue, $previousValue, operations);
    }
};

ObservableItem.prototype.triggerWatchers = function(operations) {
    const $watchers = this.$watchers;
    const $previousValue = this.$previousValue;
    const $currentValue = this.$currentValue;

    const $currentValueCallbacks = $watchers.get($currentValue);
    const $previousValueCallbacks = $watchers.get($previousValue);
    if($currentValueCallbacks) {
        $currentValueCallbacks(true, $previousValue, operations);
    }
    if($previousValueCallbacks) {
        $previousValueCallbacks(false, $currentValue, operations);
    }
};

ObservableItem.prototype.triggerAll = function(operations) {
    this.triggerWatchers(operations);
    this.triggerListeners(operations);
};

ObservableItem.prototype.triggerWatchersAndFirstListener = function(operations) {
    this.triggerWatchers(operations);
    this.triggerFirstListener(operations);
};

ObservableItem.prototype.assocTrigger = function() {
    this.$firstListener = null;
    if(this.$watchers?.size && this.$listeners?.length) {
        this.$firstListener = this.$listeners[0];
        this.trigger = this.$firstListener.length === 0 ? this.$firstListener : this.triggerFirstListener
        this.trigger = (this.$listeners.length === 1) ? this.triggerWatchersAndFirstListener : this.triggerAll;
        return;
    }
    if(this.$listeners?.length) {
        if(this.$listeners.length === 1) {
            this.$firstListener = this.$listeners[0];
            this.trigger = this.$firstListener.length === 0 ? this.$firstListener : this.triggerFirstListener
        }
        else {
            this.trigger = this.triggerListeners;
        }
        return;
    }
    if(this.$watchers?.size) {
        this.trigger = this.triggerWatchers;
        return;
    }
    this.trigger = noneTrigger;
};
ObservableItem.prototype.trigger = noneTrigger;


const $setOperation = { action: 'set' };
ObservableItem.prototype.$updateWithNewValue = function(newValue) {
    newValue = newValue?.__$isObservable ? newValue.val() : newValue;
    if(this.$currentValue === newValue) {
        return;
    }
    this.$previousValue = this.$currentValue;
    this.$currentValue = newValue;
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('ObservableBeforeChange', this);
    }
    this.trigger($setOperation);
    this.$previousValue = null;
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('ObservableAfterChange', this);
    }
};

/**
 * @param {*} data
 */
ObservableItem.prototype.$setWithInterceptor = function(data) {
    let newValue = (typeof data === 'function') ? data(this.$currentValue) : data;
    const result = this.$interceptor(newValue, this.$currentValue);

    if (result !== undefined) {
        newValue = result;
    }

    this.$updateWithNewValue(newValue);
};


/**
 * @param {*} data
 */
ObservableItem.prototype.$basicSet = function(data) {
    let newValue = (typeof data === 'function') ? data(this.$currentValue) : data;
    this.$updateWithNewValue(newValue);
};

ObservableItem.prototype.set = ObservableItem.prototype.$basicSet;

ObservableItem.prototype.val = function() {
    return this.$currentValue;
};

ObservableItem.prototype.disconnectAll = function() {
    this.$previousValue = null;
    this.$currentValue = null;
    this.$listeners = null;
    this.$watchers = null;
    this.trigger = noneTrigger;
};

/**
 * Registers a cleanup callback that will be executed when the observable is cleaned up.
 * Useful for disposing resources, removing event listeners, or other cleanup tasks.
 *
 * @param {Function} callback - Cleanup function to execute on observable disposal
 * @example
 * const obs = Observable(0);
 * obs.onCleanup(() => console.log('Cleaned up!'));
 * obs.cleanup(); // Logs: "Cleaned up!"
 */
ObservableItem.prototype.onCleanup = function(callback) {
    this.$cleanupListeners = this.$cleanupListeners ?? [];
    this.$cleanupListeners.push(callback);
};

ObservableItem.prototype.cleanup = function() {
    if (this.$cleanupListeners) {
        for (let i = 0; i < this.$cleanupListeners.length; i++) {
            this.$cleanupListeners[i]();
        }
        this.$cleanupListeners = null;
    }
    MemoryManager.unregister(this.$memoryId);
    this.disconnectAll();
    if(process.env.NODE_ENV === 'development') {
        this.$isCleanedUp = true;
    }
    delete this.$value;
};

/**
 *
 * @param {Function} callback
 * @returns {(function(): void)}
 */
ObservableItem.prototype.subscribe = function(callback) {
    if(process.env.NODE_ENV === 'development') {
        if (this.$isCleanedUp) {
            DebugManager.warn('Observable subscription', '⚠️ Attempted to subscribe to a cleaned up observable.');
            return;
        }
        if (typeof callback !== 'function') {
            throw new NativeDocumentError('Callback must be a function');
        }
    }
    this.$listeners = this.$listeners ?? [];

    this.$listeners.push(callback);
    this.assocTrigger();
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('ObservableSubscribe', this);
    }
};

/**
 * Watches for a specific value and executes callback when the observable equals that value.
 * Creates a watcher that only triggers when the observable changes to the specified value.
 *
 * @param {*} value - The value to watch for
 * @param {(value) => void|ObservableItem} callback - Callback function or observable to set when value matches
 * @example
 * const status = Observable('idle');
 * status.on('loading', () => console.log('Started loading'));
 * status.on('error', isError); // Set another observable
 */
ObservableItem.prototype.on = function(value, callback) {
    this.$watchers = this.$watchers ?? new Map();

    let watchValueList = this.$watchers.get(value);

    if(callback.__$isObservable) {
        callback = callback.set.bind(callback);
    }

    if(!watchValueList) {
        watchValueList = callback;
        this.$watchers.set(value, callback);
    } else if(!Validator.isArray(watchValueList.list)) {
        watchValueList = [watchValueList, callback];
        callback = (value) => {
            for(let i = 0, length = watchValueList.length; i < length; i++) {
                watchValueList[i](value);
            }
        }
        callback.list = watchValueList;
        this.$watchers.set(value, callback);
    } else {
        watchValueList.list.push(callback);
    }

    this.assocTrigger();
};

/**
 * Removes a watcher for a specific value. If no callback is provided, removes all watchers for that value.
 *
 * @param {*} value - The value to stop watching
 * @param {Function} [callback] - Specific callback to remove. If omitted, removes all watchers for this value
 * @example
 * const status = Observable('idle');
 * const handler = () => console.log('Loading');
 * status.on('loading', handler);
 * status.off('loading', handler); // Remove specific handler
 * status.off('loading'); // Remove all handlers for 'loading'
 */
ObservableItem.prototype.off = function(value, callback) {
    if(!this.$watchers) return;

    const watchValueList = this.$watchers.get(value);
    if(!watchValueList) return;

    if(!callback || !Array.isArray(watchValueList.list)) {
        this.$watchers?.delete(value);
        this.assocTrigger();
        return;
    }
    const index = watchValueList.indexOf(callback);
    watchValueList?.splice(index, 1);
    if(watchValueList.length === 1) {
        this.$watchers.set(value, watchValueList[0]);
    }
    else if(watchValueList.length === 0) {
        this.$watchers?.delete(value);
    }
    this.assocTrigger();
};

/**
 * Subscribes to the observable but automatically unsubscribes after the first time the predicate matches.
 *
 * @param {(value) => Boolean|any} predicate - Value to match or function that returns true when condition is met
 * @param {(value) => void} callback - Callback to execute when predicate matches, receives the matched value
 * @example
 * const status = Observable('loading');
 * status.once('ready', (val) => console.log('Ready!'));
 * status.once(val => val === 'error', (val) => console.log('Error occurred'));
 */
ObservableItem.prototype.once = function(predicate, callback) {
    const fn = typeof predicate === 'function' ? predicate : (v) => v === predicate;

    const handler = (val) => {
        if (fn(val)) {
            this.unsubscribe(handler);
            callback(val);
        }
    };
    this.subscribe(handler);
};

/**
 * Unsubscribe from an observable.
 * @param {Function} callback
 */
ObservableItem.prototype.unsubscribe = function(callback) {
    if(!this.$listeners) return;
    const index = this.$listeners.indexOf(callback);
    if (index > -1) {
        this.$listeners.splice(index, 1);
    }
    this.assocTrigger();
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('ObservableUnsubscribe', this);
    }
};

/**
 * Create an Observable checker instance
 * @param callback
 * @returns {ObservableChecker}
 */
ObservableItem.prototype.check = function(callback) {
    return new ObservableChecker(this, callback)
};

ObservableItem.prototype.transform = ObservableItem.prototype.check;
ObservableItem.prototype.pluck = function(property) {
    return new ObservableChecker(this, (value) => value[property]);
};
ObservableItem.prototype.is = function(callbackOrValue) {
    if(typeof callbackOrValue === 'function') {
        return new ObservableChecker(this, callbackOrValue);
    }
    return new ObservableChecker(this, (value) => value === callbackOrValue);
};
ObservableItem.prototype.select = ObservableItem.prototype.check;




/**
 * Gets a property value from the observable's current value.
 * If the property is an observable, returns its value.
 *
 * @param {string|number} key - Property key to retrieve
 * @returns {*} The value of the property, unwrapped if it's an observable
 * @example
 * const user = Observable({ name: 'John', age: Observable(25) });
 * user.get('name'); // 'John'
 * user.get('age'); // 25 (unwrapped from observable)
 */
ObservableItem.prototype.get = function(key) {
    const item = this.$currentValue[key];
    return Validator.isObservable(item) ? item.val() : item;
};

/**
 * Creates an ObservableWhen that represents whether the observable equals a specific value.
 * Returns an object that can be subscribed to and will emit true/false.
 *
 * @param {*} value - The value to compare against
 * @returns {ObservableWhen} An ObservableWhen instance that tracks when the observable equals the value
 * @example
 * const status = Observable('idle');
 * const isLoading = status.when('loading');
 * isLoading.subscribe(active => console.log('Loading:', active));
 * status.set('loading'); // Logs: "Loading: true"
 */
ObservableItem.prototype.when = function(value) {
    return new ObservableWhen(this, value);
};

/**
 * Compares the observable's current value with another value or observable.
 *
 * @param {*|ObservableItem} other - Value or observable to compare against
 * @returns {boolean} True if values are equal
 * @example
 * const a = Observable(5);
 * const b = Observable(5);
 * a.equals(5);  // true
 * a.equals(b);  // true
 * a.equals(10); // false
 */
ObservableItem.prototype.equals = function(other) {
    if(Validator.isObservable(other)) {
        return this.$currentValue === other.$currentValue;
    }
    return this.$currentValue === other;
};

/**
 * Converts the observable's current value to a boolean.
 *
 * @returns {boolean} The boolean representation of the current value
 * @example
 * const count = Observable(0);
 * count.toBool(); // false
 * count.set(5);
 * count.toBool(); // true
 */
ObservableItem.prototype.toBool = function() {
    return !!this.$currentValue;
};

/**
 * Toggles the boolean value of the observable (false becomes true, true becomes false).
 *
 * @example
 * const isOpen = Observable(false);
 * isOpen.toggle(); // Now true
 * isOpen.toggle(); // Now false
 */
ObservableItem.prototype.toggle = function() {
    this.set(!this.$currentValue);
};

/**
 * Resets the observable to its initial value.
 * Only works if the observable was created with { reset: true } config.
 *
 * @example
 * const count = Observable(0, { reset: true });
 * count.set(10);
 * count.reset(); // Back to 0
 */
ObservableItem.prototype.reset = function() {
    if(!this.configs?.reset) {
        return;
    }
    const resetValue = (Validator.isObject(this.$initialValue))
        ? deepClone(this.$initialValue, (observable) => {
            observable.reset();
        })
        : this.$initialValue;
    this.set(resetValue)
};

/**
 * Returns a string representation of the observable's current value.
 *
 * @returns {string} String representation of the current value
 */
ObservableItem.prototype.toString = function() {
    return String(this.$currentValue);
};

/**
 * Returns the primitive value of the observable (its current value).
 * Called automatically in type coercion contexts.
 *
 * @returns {*} The current value of the observable
 */
ObservableItem.prototype.valueOf = function() {
    return this.$currentValue;
};


/**
 * Creates a derived observable that formats the current value using Intl.
 * Automatically reacts to both value changes and locale changes (Store.__nd.locale).
 *
 * @param {string | Function} type - Format type or custom formatter function
 * @param {Object} [options={}] - Options passed to the formatter
 * @returns {ObservableItem<string>}
 *
 * @example
 * // Currency
 * price.format('currency')                                      // "15 000 FCFA"
 * price.format('currency', { currency: 'EUR' })                 // "15 000,00 €"
 * price.format('currency', { notation: 'compact' })             // "15 K FCFA"
 *
 * // Number
 * count.format('number')                                        // "15 000"
 *
 * // Percent
 * rate.format('percent')                                        // "15,0 %"
 * rate.format('percent', { decimals: 2 })                       // "15,00 %"
 *
 * // Date
 * date.format('date')                                           // "3 mars 2026"
 * date.format('date', { dateStyle: 'full' })                    // "mardi 3 mars 2026"
 * date.format('date', { format: 'DD/MM/YYYY' })                 // "03/03/2026"
 * date.format('date', { format: 'DD MMM YYYY' })                // "03 mar 2026"
 * date.format('date', { format: 'DD MMMM YYYY' })               // "03 mars 2026"
 *
 * // Time
 * date.format('time')                                           // "20:30"
 * date.format('time', { second: '2-digit' })                    // "20:30:00"
 * date.format('time', { format: 'HH:mm:ss' })                   // "20:30:00"
 *
 * // Datetime
 * date.format('datetime')                                       // "3 mars 2026, 20:30"
 * date.format('datetime', { dateStyle: 'full' })                // "mardi 3 mars 2026, 20:30"
 * date.format('datetime', { format: 'DD/MM/YYYY HH:mm' })       // "03/03/2026 20:30"
 *
 * // Relative
 * date.format('relative')                                       // "dans 11 jours"
 * date.format('relative', { unit: 'month' })                    // "dans 1 mois"
 *
 * // Plural
 * count.format('plural', { singular: 'billet', plural: 'billets' }) // "3 billets"
 *
 * // Custom formatter
 * price.format(value => `${value.toLocaleString()} FCFA`)
 *
 * // Reacts to locale changes automatically
 * Store.setLocale('en-US');
 */
ObservableItem.prototype.format = function(type, options = {}) {
    const self = this;

    if (typeof type === 'function') {
        return new ObservableChecker(self, type);
    }

    if (process.env.NODE_ENV === 'development') {
        if (!Formatters[type]) {
            throw new NativeDocumentError(
                `Observable.format : unknown type '${type}'. Available : ${Object.keys(Formatters).join(', ')}.`
            );
        }
    }

    const formatter = Formatters[type];
    const localeObservable = Formatters.locale;

    return Observable.computed(() => formatter(self.val(), localeObservable.val(), options),
        [self, localeObservable]
    );
};

ObservableItem.prototype.persist = function(key, options = {}) {
    let value = $getFromStorage(key, this.$currentValue);
    if(options.get) {
        value = options.get(value);
    }
    this.set(value);
    const saver = $saveToStorage(this.$currentValue);
    this.subscribe((newValue) => {
        saver(key, options.set ? options.set(newValue) : newValue);
    });
    return this;
};

ObservableItem.prototype.clone = function() {
    let clonedValue = this.$currentValue;

    if(clonedValue && typeof clonedValue === 'object') {
        if(typeof clonedValue.clone === 'function') {
            clonedValue = clonedValue.clone();
        } else {
            clonedValue = structuredClone(clonedValue);
        }
    }

    return new ObservableItem(clonedValue);
};