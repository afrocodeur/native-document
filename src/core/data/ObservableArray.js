import {match} from "../utils/filters/index";
import Validator from "../utils/validator";
import ObservableItem from "./ObservableItem.js";
import {Observable} from "./Observable.js";
import PluginsManager from "../utils/plugins-manager.js";
import NativeDocumentError from "../errors/NativeDocumentError.js";

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
    PluginsManager.emit('CreateObservableArray', this);
};

ObservableArray.prototype = Object.create(ObservableItem.prototype);
ObservableArray.prototype.constructor = ObservableArray;
ObservableArray.prototype.__$isObservableArray = true;


Object.defineProperty(ObservableArray.prototype, 'length', {
    get() {
        return this.$currentValue.length;
    }
})

mutationMethods.forEach((method) => {
    ObservableArray.prototype[method] = function(...values) {
        const result = this.$currentValue[method](...values);
        this.trigger({ action: method, args: values, result });
        return result;
    };
});

noMutationMethods.forEach((method) => {
    ObservableArray.prototype[method] = function(...values) {
        return this.$currentValue[method](...values);
    };
});

ObservableArray.prototype.clear = function() {
    if(this.$currentValue.length === 0) {
        return;
    }
    this.$currentValue.length = 0;
    this.trigger({ action: 'clear' });
    return true;
};

ObservableArray.prototype.at = function(index) {
    return this.$currentValue[index];
};

ObservableArray.prototype.merge = function(values) {
    this.$currentValue.push(...values);
    this.trigger({ action: 'merge',  args: values });
};

/**
 *
 * @param {Function} condition
 * @returns {number}
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

ObservableArray.prototype.swap = function(indexA, indexB) {
    const value = this.$currentValue;
    const length = value.length;
    if(length < indexA || length < indexB) {
        return false;
    }
    if(indexB < indexA) {
        const temp = indexA;
        indexA = indexB;
        indexB = temp;
    }
    const elementA = value[indexA];
    const elementB = value[indexB]

    value[indexA] = elementB;
    value[indexB] = elementA;
    this.trigger({ action: 'swap', args: [indexA, indexB], result: [elementA, elementB] });
    return true;
};

ObservableArray.prototype.remove = function(index) {
    const deleted = this.$currentValue.splice(index, 1);
    if(deleted.length === 0) {
        return [];
    }
    this.trigger({ action: 'remove', args: [index], result: deleted[0] });
    return deleted;
};

ObservableArray.prototype.removeItem = function(item) {
    const indexOfItem = this.$currentValue.indexOf(item);
    return this.remove(indexOfItem);
};

ObservableArray.prototype.isEmpty = function() {
    return this.$currentValue.length === 0;
};

ObservableArray.prototype.populateAndRender = function(iteration, callback) {
    this.trigger({ action: 'populate', args: [this.$currentValue, iteration, callback] });
};


ObservableArray.prototype.where = function(predicates) {
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
                observableDependencies.push(...deps);
            }
        } else if(typeof predicate === 'function') {
            filterCallbacks[key] = predicate;
        } else {
            filterCallbacks[key] = (value) => value === predicate;
        }
    }

    const viewArray = Observable.array();

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

ObservableArray.prototype.whereSome = function(fields, filter) {
    return this.where({
        _: {
            dependencies: filter.dependencies,
            callback: (item) => fields.some(field => filter.callback(item[field]))
        }
    });
};

ObservableArray.prototype.whereEvery = function(fields, filter) {
    return this.where({
        _: {
            dependencies: filter.dependencies,
            callback: (item) => fields.every(field => filter.callback(item[field]))
        }
    });
};

export default ObservableArray;