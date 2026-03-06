import ObservableItem from "./ObservableItem";
import Validator from "../utils/validator";
import {nextTick} from "../utils/helpers";
import {Observable} from "./Observable";

export const ObservableObject = function(target, configs) {
    ObservableItem.call(this, target);
    this.$observables = {};
    this.configs = configs;

    this.$load(target);

    for(const name in target) {
        if(!Object.hasOwn(this, name)) {
            Object.defineProperty(this, name, {
                get: () => this.$observables[name],
                set: (value) => this.$observables[name].set(value)
            });
        }
    }

};

ObservableObject.prototype = Object.create(ObservableItem.prototype);

Object.defineProperty(ObservableObject, '$value', {
    get() {
        return this.val();
    },
    set(value) {
        this.set(value);
    }
})

ObservableObject.prototype.__$isObservableObject = true;
ObservableObject.prototype.__isProxy__ = true;

ObservableObject.prototype.$load = function(initialValue) {
    const configs = this.configs;
    for(const key in initialValue) {
        const itemValue = initialValue[key];
        if(Array.isArray(itemValue)) {
            if(configs?.deep !== false) {
                const mappedItemValue = itemValue.map(item => {
                    if(Validator.isJson(item)) {
                        return Observable.json(item, configs);
                    }
                    if(Validator.isArray(item)) {
                        return Observable.array(item, configs);
                    }
                    return Observable(item, configs);
                });
                this.$observables[key] = Observable.array(mappedItemValue, configs);
                continue;
            }
            this.$observables[key] = Observable.array(itemValue, configs);
            continue;
        }
        if(Validator.isObservable(itemValue) || Validator.isProxy(itemValue)) {
            this.$observables[key] = itemValue;
            continue;
        }
        this.$observables[key] = (typeof itemValue === 'object') ? Observable.object(itemValue, configs) : Observable(itemValue, configs);
    }
};

ObservableObject.prototype.val = function() {
    const result = {};
    for(const key in this.$observables) {
        const dataItem = this.$observables[key];
        if(Validator.isObservable(dataItem)) {
            let value = dataItem.val();
            if(Array.isArray(value)) {
                value = value.map(item => {
                    if(Validator.isObservable(item)) {
                        return item.val();
                    }
                    if(Validator.isProxy(item)) {
                        return item.$value;
                    }
                    return item;
                });
            }
            result[key] = value;
        } else if(Validator.isProxy(dataItem)) {
            result[key] = dataItem.$value;
        } else {
            result[key] = dataItem;
        }
    }
    return result;
};
ObservableObject.prototype.$val = ObservableObject.prototype.val;

ObservableObject.prototype.get = function(property) {
    const item = this.$observables[property];
    if(Validator.isObservable(item)) {
        return item.val();
    }
    if(Validator.isProxy(item)) {
        return item.$value;
    }
    return item;
};
ObservableObject.prototype.$get = ObservableObject.prototype.get;

ObservableObject.prototype.set = function(newData) {
    const data = Validator.isProxy(newData) ? newData.$value : newData;
    const configs = this.configs;

    for(const key in data) {
        const targetItem = this.$observables[key];
        const newValueOrigin = newData[key];
        const newValue = data[key];

        if(Validator.isObservable(targetItem)) {
            if(!Validator.isArray(newValue)) {
                targetItem.set(newValue);
                continue;
            }
            const firstElementFromOriginalValue = newValueOrigin.at(0);
            if(Validator.isObservable(firstElementFromOriginalValue) || Validator.isProxy(firstElementFromOriginalValue)) {
                const newValues = newValue.map(item => {
                    if(Validator.isProxy(firstElementFromOriginalValue)) {
                        return Observable.init(item, configs);
                    }
                    return Observable(item, configs);
                });
                targetItem.set(newValues);
                continue;
            }
            targetItem.set([...newValue]);
            continue;
        }
        if(Validator.isProxy(targetItem)) {
            targetItem.update(newValue);
            continue;
        }
        this[key] = newValue;
    }
};
ObservableObject.prototype.$set = ObservableObject.prototype.set;
ObservableObject.prototype.$updateWith = ObservableObject.prototype.set;

ObservableObject.prototype.observables = function() {
    return Object.values(this.$observables);
};
ObservableObject.prototype.$observables = ObservableObject.prototype.observables;

ObservableObject.prototype.keys = function() {
    return Object.keys(this.$observables);
};
ObservableObject.prototype.$keys = ObservableObject.prototype.keys;
ObservableObject.prototype.clone = function() {
    return Observable.init(this.val(), this.configs);
};
ObservableObject.prototype.$clone = ObservableObject.prototype.clone;
ObservableObject.prototype.reset = function() {
    for(const key in this.$observables) {
        this.$observables[key].reset();
    }
};
ObservableObject.prototype.originalSubscribe = ObservableObject.prototype.subscribe;
ObservableObject.prototype.subscribe = function(callback) {
    const observables = this.observables();
    const updatedValue = nextTick(() => this.trigger());

    this.originalSubscribe(callback);

    for (let i = 0, length = observables.length; i < length; i++) {
        const observable = observables[i];
        if (observable.__$isObservableArray) {
            observable.deepSubscribe(updatedValue);
            continue
        }
        observable.subscribe(updatedValue);
    }
};
ObservableObject.prototype.configs = function() {
    return this.configs;
};

ObservableObject.prototype.update = ObservableObject.prototype.set;