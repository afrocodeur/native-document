import DebugManager from "../utils/debug-manager";
import MemoryManager from "./MemoryManager";
import NativeDocumentError from "../errors/NativeDocumentError";
import ObservableChecker from "./ObservableChecker";
import PluginsManager from "../utils/plugins-manager";
import Validator from "../utils/validator";
import {ObservableWhen} from "./ObservableWhen";

/**
 *
 * @param {*} value
 * @class ObservableItem
 */
export default function ObservableItem(value) {
    this.$previousValue = null;
    this.$currentValue = value;
    this.$isCleanedUp = false;

    this.$listeners = null;
    this.$watchers = null;

    this.$memoryId = null;
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

ObservableItem.prototype.triggerFirstListener = function(operations) {
    this.$listeners[0](this.$currentValue, this.$previousValue, operations || {});
}
ObservableItem.prototype.triggerListeners = function(operations) {
    const $listeners = this.$listeners;
    const $previousValue = this.$previousValue;
    const $currentValue = this.$currentValue;

    operations = operations || DEFAULT_OPERATIONS;
    for(let i = 0, length = $listeners.length; i < length; i++) {
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
}
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
    this.triggerListeners(operations);
    this.triggerWatchers();
};

ObservableItem.prototype.triggerWatchersAndFirstListener = function(operations) {
    this.triggerListeners(operations);
    this.triggerWatchers();
};

ObservableItem.prototype.assocTrigger = function() {
    if(this.$watchers?.size && this.$listeners?.length) {
        this.trigger = (this.$listeners.length === 1) ? this.triggerWatchersAndFirstListener : this.triggerAll;
        return;
    }
    if(this.$listeners?.length) {
        this.trigger = (this.$listeners.length === 1) ? this.triggerFirstListener : this.triggerListeners;
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
    const newValue = (typeof data === 'function') ? data(this.$currentValue) : data;
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

ObservableItem.prototype.cleanup = function() {
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