import ObservableItem from "./ObservableItem.js";
import PluginsManager from "../utils/plugins-manager.js";
import NativeDocumentError from "../errors/NativeDocumentError.js";

const mutationMethods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
const noMutationMethods = ['map', 'forEach', 'filter', 'reduce', 'some', 'every', 'find', 'findIndex', 'concat', 'includes', 'indexOf'];


const ObservableArray = function (target, { propagation = false, deep = false } = {}) {
    if(!Array.isArray(target)) {
        throw new NativeDocumentError('Observable.array : target must be an array');
    }

    ObservableItem.call(this, target);
    PluginsManager.emit('CreateObservableArray', this);
};

ObservableArray.prototype = Object.create(ObservableItem.prototype);
ObservableArray.prototype.__$isObservableArray = true;

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

ObservableArray.prototype.length = function() {
    return this.$currentValue.length;
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




export default ObservableArray;