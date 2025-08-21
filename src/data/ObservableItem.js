import DebugManager from "../utils/debug-manager";
import MemoryManager from "./MemoryManager";
import NativeDocumentError from "../errors/NativeDocumentError";
import ObservableChecker from "./ObservableChecker";

/**
 *
 * @param {*} value
 * @class ObservableItem
 */
export default function ObservableItem(value) {
    if (value === undefined) {
        throw new NativeDocumentError('ObservableItem requires an initial value');
    }
    if(value instanceof ObservableItem) {
        throw new NativeDocumentError('ObservableItem cannot be an Observable');
    }

    this.$previousValue = value;
    this.$currentValue = value;
    this.$isCleanedUp = false;

    this.$listeners = null;
    this.$watchers = null;

    this.$memoryId = MemoryManager.register(this);
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

ObservableItem.prototype.triggerListeners = function(operations) {
    const $listeners = this.$listeners;
    const $previousValue = this.$previousValue;
    const $currentValue = this.$currentValue;

    operations = operations || {};
    if($listeners?.length) {
        for(let i = 0, length = $listeners.length; i < length; i++) {
            $listeners[i]($currentValue, $previousValue, operations);
        }
    }
};

ObservableItem.prototype.triggerWatchers = function() {
    if(!this.$watchers) {
        return;
    }

    const $watchers = this.$watchers;
    const $previousValue = this.$previousValue;
    const $currentValue = this.$currentValue;

    if($watchers.has($currentValue)) {
        const watchValueList = $watchers.get($currentValue);
        watchValueList.forEach(itemValue => {
            if(itemValue.ifTrue.called) {
                return;
            }
            itemValue.ifTrue.callback();
            itemValue.else.called = false;
        })
    }
    if($watchers.has($previousValue)) {
        const watchValueList = $watchers.get($previousValue);
        watchValueList.forEach(itemValue => {
            if(itemValue.else.called) {
                return;
            }
            itemValue.else.callback();
            itemValue.ifTrue.called = false;
        });
    }
};

ObservableItem.prototype.trigger = function(operations) {
    this.triggerListeners(operations);
    this.triggerWatchers();
}

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
    this.trigger();
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
            for (const itemValue of watchValueList) {
                itemValue.ifTrue.callback = null;
                itemValue.else.callback = null;
            }
            watchValueList.clear();
        }
    }
    this.$watchers?.clear();
    this.$listeners = null;
    this.$watchers = null;
}
ObservableItem.prototype.cleanup = function() {
    MemoryManager.unregister(this.$memoryId);
    this.disconnectAll();
    this.$isCleanedUp = true;
    delete this.$value;
}

/**
 *
 * @param {Function} callback
 * @returns {(function(): void)}
 */
ObservableItem.prototype.subscribe = function(callback) {
    this.$listeners = this.$listeners ?? [];
    if (this.$isCleanedUp) {
        DebugManager.warn('Observable subscription', '⚠️ Attempted to subscribe to a cleaned up observable.');
        return () => {};
    }
    if (typeof callback !== 'function') {
        throw new NativeDocumentError('Callback must be a function');
    }

    this.$listeners.push(callback);
    return () => this.unsubscribe(callback);
};

ObservableItem.prototype.on = function(value, callback, elseCallback) {
    this.$watchers = this.$watchers ?? new Map();

    let watchValueList = this.$watchers.get(value);
    if(!watchValueList) {
        watchValueList = new Set();
        this.$watchers.set(value, watchValueList);
    }

    let itemValue = {
        ifTrue: { callback, called: false },
        else: { callback: elseCallback, called: false }
    };
    watchValueList.add(itemValue);
    return () => {
        watchValueList?.delete(itemValue);
        if(watchValueList.size === 0) {
            this.$watchers?.delete(value);
        }
        watchValueList = null;
        itemValue = null;
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
};

/**
 * Create an Observable checker instance
 * @param callback
 * @returns {ObservableChecker}
 */
ObservableItem.prototype.check = function(callback) {
    return new ObservableChecker(this, callback)
};
ObservableItem.prototype.get = ObservableItem.prototype.check;

    ObservableItem.prototype.toString = function() {
    return '{{#ObItem::(' +this.$memoryId+ ')}}';
}