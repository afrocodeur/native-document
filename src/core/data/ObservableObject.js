import ObservableItem from './ObservableItem';
import Validator from '../utils/validator';
import {nextTick} from '../utils/helpers';
import ObservableArray from './ObservableArray';

/**
 * Reactive object container extending ObservableItem.
 * Each property of the target object becomes an individual ObservableItem (or ObservableArray/ObservableObject for nested structures).
 * Use Observable.object() or Observable.init() rather than instantiating directly.
 *
 * @constructor
 * @param {Record<string, *>} target - Plain object to make reactive
 * @param {{ deep?: boolean, reset?: boolean, propagation?: boolean }|null} [configs] - Configuration
 * @param {boolean} [configs.deep] - If false, nested objects and arrays are not wrapped recursively (default: true)
 * @example
 * const user = Observable.object({ name: 'John', age: 25 });
 * user.name.$value = 'Jane'; // triggers reactivity on name only
 */
export const ObservableObject = function(target, configs) {
    ObservableItem.call(this, target);
    this.$observables = {};
    this.configs = configs;

    for(const key in target) {
        this.$addKey(key);
    }

    this.$load(target);

    Object.defineProperty(this, '$currentValue', {
        get: function() {
            return this.val();
        },
        set(value) {
            this.set(value);
        }
    });
};

ObservableObject.prototype = Object.create(ObservableItem.prototype);

Object.defineProperty(ObservableObject, '$value', {
    get() {
        return this.val();
    },
    set(value) {
        this.set(value);
    },
});

ObservableObject.prototype.__$isObservableObject = true;
ObservableObject.prototype.__isProxy__ = true;

ObservableObject.prototype.$addKey = function(key) {
    if(!Object.hasOwn(this, key)) {
        Object.defineProperty(this, key, {
            get: () => this.$observables[key],
            set: (value) => {
                this.$observables[key].set(value);
            },
            configurable: true,
            enumerable: true,
        });
    }
};


/**
 *
 * @param {String[]} properties
 */
ObservableObject.prototype.only = function(properties) {
    const result = {};
    for(const key of properties) {
        result[key] = this.$observables[key]?.val();
    }
    return result;
};

/**
 * Initialises (or reinitialize) the internal observables map from a plain object.
 * Called automatically in the constructor.
 *
 * @internal
 * @param {Record<string, *>} initialValue - Object whose properties are turned into observables
 */
ObservableObject.prototype.$load = function(initialValue) {
    const configs = this.configs;
    for(const key in initialValue) {
        const itemValue = initialValue[key];
        if(Array.isArray(itemValue)) {
            if(configs?.deep !== false) {
                const mappedItemValue = itemValue.map(item => {
                    if(Validator.isJson(item)) {
                        return new ObservableObject(item, configs);
                    }
                    if(Validator.isArray(item)) {
                        return new ObservableArray(item, configs);
                    }
                    return new ObservableItem(item, configs);
                });
                this.$observables[key] = new ObservableArray(mappedItemValue, configs);
                continue;
            }
            this.$observables[key] = new ObservableArray(itemValue, configs);
            continue;
        }
        if(itemValue?.__$Observable) {
            this.$observables[key] = itemValue;
            continue;
        }
        this.$observables[key] = (Validator.isJson(itemValue)) ? new ObservableObject(itemValue, configs) : new ObservableItem(itemValue, configs);
    }
};

/**
 * Returns a plain snapshot of all observable values.
 * Unwraps nested ObservableItem, ObservableArray, and ObservableObject recursively.
 * Alias: $val()
 *
 * @returns {Record<string, *>} Plain object with current values
 * @example
 * const user = Observable.object({ name: 'John', age: 25 });
 * user.val(); // { name: 'John', age: 25 }
 */
ObservableObject.prototype.val = function() {
    const result = {};
    for(const key in this.$observables) {
        const dataItem = this.$observables[key];
        if(dataItem?.__$Observable) {
            let value = dataItem.val();
            if(Array.isArray(value)) {
                value = value.map(item => {
                    if(item.__$Observable) {
                        return item.val();
                    }
                    return item;
                });
            }
            result[key] = value;
        } else {
            result[key] = dataItem;
        }
    }
    return result;
};
ObservableObject.prototype.$val = ObservableObject.prototype.val;

/**
 * Returns the current value of a single property, unwrapped from its observable.
 * Alias: $get(property)
 *
 * @param {string} property - Property name
 * @returns {*} The current value of that property
 * @example
 * const user = Observable.object({ name: 'John' });
 * user.get('name'); // 'John'
 */
ObservableObject.prototype.get = function(property) {
    const item = this.$observables[property];
    if(item?.__$Observable) {
        return item.val();
    }
    return item;
};
ObservableObject.prototype.$get = ObservableObject.prototype.get;

/**
 * Updates one or more properties with new values.
 * Supports partial updates — only provided keys are changed.
 * Aliases: $set(newData), $updateWith(newData), update(newData)
 *
 * @param {Partial<Record<string, *>>} newData - Object with properties to update
 * @example
 * const user = Observable.object({ name: 'John', age: 25 });
 * user.set({ name: 'Jane' }); // Only name changes, age stays 25
 */
ObservableObject.prototype.set = function(newData) {
    const data = newData?.__$Observable ? newData.$value : newData;
    const configs = this.configs;

    for(const key in data) {
        const targetItem = this.$observables[key];
        const newValueOrigin = newData[key];
        const newValue = data[key];

        if(targetItem?.__$Observable) {
            if(targetItem.__$isObservableObject) {
                targetItem.update(newValue);
                continue;
            }
            if(!Validator.isArray(newValue)) {
                targetItem.set(newValue);
                continue;
            }
            const firstElementFromOriginalValue = newValueOrigin.at(0);
            if(firstElementFromOriginalValue?.__$Observable) {
                const newValues = newValue.map(item => {
                    if(firstElementFromOriginalValue.__$isObservableObject) {
                        return new ObservableObject(item, configs);
                    }
                    return new ObservableItem(item, configs);
                });
                targetItem.set(newValues);
                continue;
            }
            targetItem.set([...newValue]);
            continue;
        }
        this.$observables[key] = ObservableItem.auto(newValue);
        this.$addKey(key);
    }
};
ObservableObject.prototype.$set = ObservableObject.prototype.set;
ObservableObject.prototype.$updateWith = ObservableObject.prototype.set;

/**
 * Returns an array of all internal observable instances (one per property).
 *
 * @returns {ObservableItem[]} Array of observable instances
 */
ObservableObject.prototype.observables = function() {
    return Object.values(this.$observables);
};
// ObservableObject.prototype.$observables = ObservableObject.prototype.observables;

/**
 * Returns all property names of the observable object.
 * Alias: $keys()
 *
 * @returns {string[]} Array of property names
 */
ObservableObject.prototype.keys = function() {
    return Object.keys(this.$observables);
};
ObservableObject.prototype.$keys = ObservableObject.prototype.keys;

/**
 * Creates a new ObservableObject with a snapshot of the current values.
 * Changes to the clone do not affect the original.
 * Alias: $clone()
 *
 * @returns {ObservableObject} New independent ObservableObject with the same structure and values
 */
ObservableObject.prototype.clone = function() {
    return new ObservableObject(this.val(), this.configs);
};
ObservableObject.prototype.$clone = ObservableObject.prototype.clone;

/**
 * Resets all properties to their initial values by calling .reset() on each child observable.
 * Only works if observables were created with { reset: true }.
 */
ObservableObject.prototype.reset = function() {
    for(const key in this.$observables) {
        this.$observables[key].reset();
    }
};
ObservableObject.prototype.originalSubscribe = ObservableObject.prototype.subscribe;

/**
 * Subscribes to changes across all nested observables.
 * The callback is called whenever any property (or nested value) changes.
 * Internally uses debouncing (nextTick) to batch multiple simultaneous changes.
 *
 * @param {(value: Record<string, *>) => void} callback - Called on any nested change
 * @example
 * const user = Observable.object({ name: 'John', age: 25 });
 * user.subscribe(() => console.log('user changed:', user.val()));
 * user.name.$value = 'Jane'; // logs 'user changed: { name: "Jane", age: 25 }'
 */
ObservableObject.prototype.subscribe = function(callback) {
    const observables = this.observables();
    const updatedValue = nextTick(() => this.trigger());

    this.originalSubscribe(callback);

    for (let i = 0, length = observables.length; i < length; i++) {
        const observable = observables[i];
        if (observable.__$isObservableArray) {
            observable.deepSubscribe(updatedValue);
            continue;
        }
        observable.subscribe(updatedValue);
    }
};
ObservableObject.prototype.configs = function() {
    return this.configs;
};

ObservableObject.prototype.update = ObservableObject.prototype.set;