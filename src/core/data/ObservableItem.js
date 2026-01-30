import DebugManager from "../../core/utils/debug-manager";
import MemoryManager from "./MemoryManager";
import NativeDocumentError from "../../core/errors/NativeDocumentError";
import ObservableChecker from "./ObservableChecker";
import PluginsManager from "../../core/utils/plugins-manager";
import Validator from "../../core/utils/validator";
import {ObservableWhen} from "./ObservableWhen";
import {deepClone} from "../utils/helpers";

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
    this.$isCleanedUp = false;

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

    PluginsManager.emit('CreateObservable', this);
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

ObservableItem.prototype.__$isObservable = true;
const DEFAULT_OPERATIONS = {};
const noneTrigger = function() {};

ObservableItem.prototype.intercept = function(callback) {
    this.$interceptor = callback;
    return this;
};

ObservableItem.prototype.triggerFirstListener = function(operations) {
    this.$firstListener(this.$currentValue, this.$previousValue, operations || {});
};

ObservableItem.prototype.triggerListeners = function(operations) {
    const $listeners = this.$listeners;
    const $previousValue = this.$previousValue;
    const $currentValue = this.$currentValue;

    operations = operations || DEFAULT_OPERATIONS;
    for(let i = 0, length = $listeners.length; i < length; i++) {
        const listener = $listeners[i];
        $listeners[i]($currentValue, $previousValue, operations);
    }
};

const handleWatcherCallback = function(callbacks, value) {
    if(typeof callbacks === "function") {
        callbacks(value);
        return;
    }
    if (callbacks.set) {
        callbacks.set(value);
        return;
    }
    callbacks.forEach(callback => {
        callback.set ? callback.set(value) : callback(value);
    });
};

ObservableItem.prototype.triggerWatchers = function() {
    if(!this.$watchers) {
        return;
    }

    const $watchers = this.$watchers;
    const $previousValue = this.$previousValue;
    const $currentValue = this.$currentValue;

    if($watchers.has($currentValue)) {
        const $currentValueCallbacks = $watchers.get($currentValue);
        handleWatcherCallback($currentValueCallbacks, true);
    }
    if($watchers.has($previousValue)) {
        const $previousValueCallbacks = $watchers.get($previousValue);
        handleWatcherCallback($previousValueCallbacks, false);
    }
};

ObservableItem.prototype.triggerAll = function(operations) {
    this.triggerWatchers();
    this.triggerListeners(operations);
};

ObservableItem.prototype.triggerWatchersAndFirstListener = function(operations) {
    this.triggerWatchers();
    this.triggerListeners(operations);
};

ObservableItem.prototype.assocTrigger = function() {
    this.$firstListener = null;
    if(this.$watchers?.size && this.$listeners?.length) {
        this.trigger = (this.$listeners.length === 1) ? this.triggerWatchersAndFirstListener : this.triggerAll;
        return;
    }
    if(this.$listeners?.length) {
        if(this.$listeners.length === 1) {
            this.$firstListener = this.$listeners[0];
            this.trigger = this.triggerFirstListener
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

/**
 * @param {*} data
 */
ObservableItem.prototype.set = function(data) {
    let newValue = (typeof data === 'function') ? data(this.$currentValue) : data;
    newValue = Validator.isObservable(newValue) ? newValue.val() : newValue;

    if (this.$interceptor) {
        const result = this.$interceptor(newValue, this.$currentValue);

        if (result !== undefined) {
            newValue = result;
        }
    }

    if(this.$currentValue === newValue) {
        return;
    }
    this.$previousValue = this.$currentValue;
    this.$currentValue = newValue;
    PluginsManager.emit('ObservableBeforeChange', this);
    this.trigger();
    this.$previousValue = null;
    PluginsManager.emit('ObservableAfterChange', this);
};

ObservableItem.prototype.val = function() {
    return this.$currentValue;
};

ObservableItem.prototype.disconnectAll = function() {
    this.$listeners?.splice(0);
    this.$previousValue = null;
    this.$currentValue = null;
    if(this.$watchers) {
        for (const [_, watchValueList] of this.$watchers) {
            if(Validator.isArray(watchValueList)) {
                watchValueList.splice(0);
            }
        }
    }
    this.$watchers?.clear();
    this.$listeners = null;
    this.$watchers = null;
    this.trigger = noneTrigger;
};

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
    this.$isCleanedUp = true;
    delete this.$value;
};

/**
 *
 * @param {Function} callback
 * @param {any} target
 * @returns {(function(): void)}
 */
ObservableItem.prototype.subscribe = function(callback, target = null) {
    this.$listeners = this.$listeners ?? [];
    if (this.$isCleanedUp) {
        DebugManager.warn('Observable subscription', '⚠️ Attempted to subscribe to a cleaned up observable.');
        return () => {};
    }
    if (typeof callback !== 'function') {
        throw new NativeDocumentError('Callback must be a function');
    }

    this.$listeners.push(callback);
    this.assocTrigger();
    PluginsManager.emit('ObservableSubscribe', this, target);
    return () => {
        this.unsubscribe(callback);
        this.assocTrigger();
        PluginsManager.emit('ObservableUnsubscribe', this);
    };
};

ObservableItem.prototype.on = function(value, callback) {
    this.$watchers = this.$watchers ?? new Map();

    let watchValueList = this.$watchers.get(value);

    if(!watchValueList) {
        this.$watchers.set(value, callback);
    } else if(!Validator.isArray(watchValueList)) {
        watchValueList = [watchValueList];
        this.$watchers.set(value, watchValueList);
        return;
    } else {
        watchValueList.push(callback);
    }

    this.assocTrigger();
    return () => {
        const index = watchValueList.indexOf(callback);
        watchValueList?.splice(index, 1);
        if(watchValueList.size === 1) {
            this.$watchers.set(value, watchValueList[0]);
        }
        else if(watchValueList.size === 0) {
            this.$watchers?.delete(value);
            watchValueList = null;
        }
        this.assocTrigger();
    };
};

ObservableItem.prototype.once = function(predicate, callback) {
    const fn = typeof predicate === 'function' ? predicate : (v) => v === predicate;

    const unsub = this.subscribe((val) => {
        if (fn(val)) {
            unsub();
            callback(val);
        }
    });
    return unsub;
};

/**
 * Unsubscribe from an observable.
 * @param {Function} callback
 */
ObservableItem.prototype.unsubscribe = function(callback) {
    const index = this.$listeners.indexOf(callback);
    if (index > -1) {
        this.$listeners.splice(index, 1);
    }
    this.assocTrigger();
};

/**
 * Create an Observable checker instance
 * @param callback
 * @returns {ObservableChecker}
 */
ObservableItem.prototype.check = function(callback) {
    return new ObservableChecker(this, callback)
};

ObservableItem.prototype.get = function(key) {
    const item = this.$currentValue[key];
    return Validator.isObservable(item) ? item.val() : item;
};

ObservableItem.prototype.when = function(value) {
    return new ObservableWhen(this, value);
};

ObservableItem.prototype.toString = function() {
    if(!this.$memoryId) {
        MemoryManager.register(this);
    }
    return '{{#ObItem::(' +this.$memoryId+ ')}}';
};
ObservableItem.prototype.equals = function(other) {
    if(Validator.isObservable(other)) {
        return this.$currentValue === other.$currentValue;
    }
    return this.$currentValue === other;
};

ObservableItem.prototype.toBool = function() {
    return !!this.$currentValue;
};

ObservableItem.prototype.toggle = function() {
    this.set(!this.$currentValue);
};

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


ObservableItem.prototype.toString = function() {
    return String(this.$currentValue);
};