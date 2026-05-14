import {match} from "../utils/filters/index";
import Validator from "../utils/validator";
import ObservableItem from "./ObservableItem.js";
import PluginsManager from "../utils/plugins-manager.js";
import NativeDocumentError from "../errors/NativeDocumentError.js";
import {nextTick} from "../utils/helpers";

const mutationMethods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
const noMutationMethods = ['map', 'forEach', 'filter', 'reduce', 'some', 'every', 'find', 'findIndex', 'concat', 'includes', 'indexOf'];

/**
 *
 * @param target
 * @param {{propagation: boolean, deep: boolean, reset: boolean}|null} configs
 * @constructor
 */
const ObservableArray = function (target, configs = null) {
    if(!Array.isArray(target)) {
        throw new NativeDocumentError('Observable.array : target must be an array');
    }

    ObservableItem.call(this, target, configs);
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('CreateObservableArray', this);
    }
};

ObservableArray.prototype = Object.create(ObservableItem.prototype);
ObservableArray.prototype.constructor = ObservableArray;
ObservableArray.prototype.__$isObservableArray = true;


Object.defineProperty(ObservableArray.prototype, 'length', {
    get() {
        return this.$currentValue.length;
    }
});


ObservableArray.prototype.$mutate = function(action, args, mutateFn) {
    if(this.$mutationInterceptor) {
        const value = this.$mutationInterceptor(args, { action });
        if(args !== undefined) {
            args = value;
        }
    }
    mutateFn(args);
};

mutationMethods.forEach((method) => {
    ObservableArray.prototype[method] = function(...values) {
        return this.$mutate(method, values, (argsToUse) => {
            const result = this.$currentValue[method].apply(this.$currentValue, argsToUse);
            this.trigger({ action: method, args: argsToUse, result });
            return result;
        })
    };
});

noMutationMethods.forEach((method) => {
    ObservableArray.prototype[method] = function(...values) {
        return this.$currentValue[method].apply(this.$currentValue, values);
    };
});


const $clearEvent = { action: 'clear' };

/**
 * Removes all items from the array and triggers an update.
 *
 * @returns {boolean} True if array was cleared, false if it was already empty
 * @example
 * const items = Observable.array([1, 2, 3]);
 * items.clear(); // []
 */
ObservableArray.prototype.clear = function() {
    if(this.$currentValue.length === 0) {
        return;
    }
    this.$mutate('clear', [], () => {
        this.$currentValue.length = 0;
        this.trigger($clearEvent);
    });
    return true;
};

/**
 * Returns the element at the specified index in the array.
 *
 * @param {number} index - Zero-based index of the element to retrieve
 * @returns {*} The element at the specified index
 * @example
 * const items = Observable.array(['a', 'b', 'c']);
 * items.at(1); // 'b'
 */
ObservableArray.prototype.at = function(index) {
    return this.$currentValue[index];
};


/**
 * Merges multiple values into the array and triggers an update.
 * Similar to push but with a different operation name.
 *
 * @param {Array} values - Array of values to merge
 * @example
 * const items = Observable.array([1, 2]);
 * items.merge([3, 4]); // [1, 2, 3, 4]
 */
ObservableArray.prototype.merge = function(values) {
    this.$mutate('merge', values, (valuesToMerge) => {
        this.$currentValue.push.apply(this.$currentValue, valuesToMerge);
        this.trigger({ action: 'merge',  args: valuesToMerge });
    });
};

/**
 * Counts the number of elements that satisfy the provided condition.
 *
 * @param {(value: *, index: number) => Boolean} condition - Function that tests each element (item, index) => boolean
 * @returns {number} The count of elements that satisfy the condition
 * @example
 * const numbers = Observable.array([1, 2, 3, 4, 5]);
 * numbers.count(n => n > 3); // 2
 */
ObservableArray.prototype.count = function(condition) {
    let count = 0;
    this.$currentValue.forEach((item, index) => {
        if(condition(item, index)) {
            count++;
        }
    });
    return count;
};

/**
 * Swaps two elements at the specified indices and triggers an update.
 *
 * @param {number} indexA - Index of the first element
 * @param {number} indexB - Index of the second element
 * @returns {boolean} True if swap was successful, false if indices are out of bounds
 * @example
 * const items = Observable.array(['a', 'b', 'c']);
 * items.swap(0, 2); // ['c', 'b', 'a']
 */
ObservableArray.prototype.swap = function(indexA, indexB) {
    this.$mutate('swap', [indexA, indexB], ([indexA, indexB]) => {
        const value = this.$currentValue;
        const length = value.length;
        if(indexB < indexA) {
            const temp = indexA;
            indexA = indexB;
            indexB = temp;
        }
        if(length < indexA || length < indexB) {
            return false;
        }
        const elementA = value[indexA];
        const elementB = value[indexB]

        value[indexA] = elementB;
        value[indexB] = elementA;
        this.trigger({ action: 'swap', args: [indexA, indexB], result: [elementA, elementB] });
    });
    return true;
};

ObservableArray.prototype.swapItems = function(itemA, itemB) {
    const indexA = this.$currentValue.indexOf(itemA);
    const indexB = this.$currentValue.indexOf(itemB);

    return this.swap(indexA, indexB);
};

ObservableArray.prototype.insertAfter = function(data, target) {
    const targetIndex = this.$currentValue.indexOf(target);
    return this.splice(targetIndex + 1, 0, data);
};

/**
 * Removes the element at the specified index and triggers an update.
 *
 * @param {number} index - Index of the element to remove
 * @returns {Array} Array containing the removed element, or empty array if index is invalid
 * @example
 * const items = Observable.array(['a', 'b', 'c']);
 * items.remove(1); // ['b'] - Array is now ['a', 'c']
 */
ObservableArray.prototype.remove = function(index) {
    let deleted = [];
    this.$mutate('remove', [index], ([idx]) => {
        deleted = this.$currentValue.splice(idx, 1);
        if(deleted.length === 0) {
            return;
        }
        this.trigger({action: 'remove', args: [idx], result: deleted[0]});
    });
    return deleted;
};

/**
 * Removes the first occurrence of the specified item from the array.
 *
 * @param {*} item - The item to remove
 * @returns {Array} Array containing the removed element, or empty array if item not found
 * @example
 * const items = Observable.array(['a', 'b', 'c']);
 * items.removeItem('b'); // ['b'] - Array is now ['a', 'c']
 */
ObservableArray.prototype.removeItem = function(item) {
    const indexOfItem = this.$currentValue.indexOf(item);
    if(indexOfItem === -1) {
        return [];
    }
    return this.remove(indexOfItem);
};

/**
 * Checks if the array is empty.
 *
 * @returns {boolean} True if array has no elements
 * @example
 * const items = Observable.array([]);
 * items.isEmpty(); // true
 */
ObservableArray.prototype.empty = function() {
    return this.$currentValue.length === 0;
};

/**
 * Triggers a populate operation with the current array, iteration count, and callback.
 * Used internally for rendering optimizations.
 *
 * @param {number} iteration - Iteration count for rendering
 * @param {Function} callback - Callback function for rendering items
 */
ObservableArray.prototype.populateAndRender = function(iteration, callback) {
    this.trigger({ action: 'populate', args: [this.$currentValue, iteration, callback] });
};


/**
 * Creates a filtered view of the array based on predicates.
 * The filtered array updates automatically when source data or predicates change.
 *
 * @param {Object} predicates - Object mapping property names to filter conditions or functions
 * @returns {ObservableArray} A new observable array containing filtered items
 * @example
 * const users = Observable.array([
 *   { name: 'John', age: 25 },
 *   { name: 'Jane', age: 30 }
 * ]);
 *
 * const adults = users.where({ age: (val) => val >= 18 });
 */
ObservableArray.prototype.where = function(predicates) {
    if(typeof predicates === 'function') {
        predicates = { _: predicates };
    }
    const sourceArray = this;
    const observableDependencies = [sourceArray];
    const filterCallbacks = {};

    for (const [key, rawPredicate] of Object.entries(predicates)) {
        const predicate = Validator.isObservable(rawPredicate) ? match(rawPredicate, false) : rawPredicate;
        if (predicate && typeof predicate === 'object' && 'callback' in predicate) {
            filterCallbacks[key] = predicate.callback;

            if (predicate.dependencies) {
                const deps = Array.isArray(predicate.dependencies)
                    ? predicate.dependencies
                    : [predicate.dependencies];
                observableDependencies.push.apply(observableDependencies, deps);
            }
        } else if(typeof predicate === 'function') {
            filterCallbacks[key] = predicate;
        } else {
            filterCallbacks[key] = (value) => value === predicate;
        }
    }

    const viewArray = new ObservableArray([]);

    const filters = Object.entries(filterCallbacks);
    const updateView = () => {
        const filtered = sourceArray.val().filter(item => {
            for (const [key, callback] of filters) {
                if(key === '_') {
                    if (!callback(item)) return false;
                } else {
                    if (!callback(item[key])) return false;
                }
            }
            return true;
        });

        viewArray.set(filtered);
    };

    observableDependencies.forEach(dep => dep.subscribe(updateView));

    updateView();

    return viewArray;
};

/**
 * Creates a filtered view where at least one of the specified fields matches the filter.
 *
 * @param {Array<string>} fields - Array of field names to check
 * @param {FilterResult} filter - Filter condition with callback and dependencies
 * @returns {ObservableArray} A new observable array containing filtered items
 * @example
 * const products = Observable.array([
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' }
 * ]);
 * const searchTerm = Observable('App');
 * const filtered = products.whereSome(['name', 'category'], match(searchTerm));
 */
ObservableArray.prototype.whereSome = function(fields, filter) {
    return this.where({
        _: {
            dependencies: filter.dependencies,
            callback: (item) => fields.some(field => filter.callback(item[field]))
        }
    });
};

/**
 * Creates a filtered view where all specified fields match the filter.
 *
 * @param {Array<string>} fields - Array of field names to check
 * @param {FilterResult} filter - Filter condition with callback and dependencies
 * @returns {ObservableArray} A new observable array containing filtered items
 * @example
 * const items = Observable.array([
 *   { status: 'active', verified: true },
 *   { status: 'active', verified: false }
 * ]);
 * const activeFilter = equals('active');
 * const filtered = items.whereEvery(['status', 'verified'], activeFilter);
 */
ObservableArray.prototype.whereEvery = function(fields, filter) {
    return this.where({
        _: {
            dependencies: filter.dependencies,
            callback: (item) => fields.every(field => filter.callback(item[field]))
        }
    });
};

ObservableArray.prototype.deepSubscribe = function(callback) {
    const updatedValue = nextTick(() => callback(this.val()));
    const $listeners = new WeakMap();

    const bindItem = (item) => {
        if ($listeners.has(item)) {
            return;
        }
        if (item?.__$isObservableArray) {
            $listeners.set(item, item.deepSubscribe(updatedValue));
            return;
        }
        if (item?.__$isObservable) {
            item.subscribe(updatedValue);
            $listeners.set(item, () => item.unsubscribe(updatedValue));
        }
    };

    const unbindItem = (item) => {
        const unsub = $listeners.get(item);
        if (unsub) {
            unsub();
            $listeners.delete(item);
        }
    };

    this.$currentValue.forEach(bindItem);
    this.subscribe(updatedValue);

    this.subscribe((items, _, operations) => {
        switch (operations?.action) {
            case 'push':
            case 'unshift':
                operations.args.forEach(bindItem);
                break;

            case 'splice': {
                const [start, deleteCount, ...newItems] = operations.args;
                operations.result?.forEach(unbindItem);
                newItems.forEach(bindItem);
                break;
            }

            case 'remove':
                unbindItem(operations.result);
                break;

            case 'merge':
                operations.args.forEach(bindItem);
                break;

            case 'clear':
                this.$currentValue.forEach(unbindItem);
                break;

            case 'sort':
            case 'reverse':
                break;
        }
    });

    return () => {
        this.$currentValue.forEach(unbindItem);
    };
};


ObservableArray.prototype.sync = function(targetObservable) {
    if (!targetObservable || !targetObservable.__$isObservableArray) {
        throw new NativeDocumentError('ObservableArray.sync : target must be an ObservableArray');
    }

    targetObservable.set([...this.$currentValue]);

    const sync = (currentValue, _, operations) => {
        if (!operations) {
            targetObservable.set([...currentValue]);
            return;
        }

        const { action, args } = operations;
        targetObservable[action].apply(targetObservable, args);
    };
    this.subscribe(sync);

    return () => this.unsubscribe(sync);
};

ObservableArray.prototype.clone = function() {
    return new ObservableArray(this.resolve());
};

export default ObservableArray;