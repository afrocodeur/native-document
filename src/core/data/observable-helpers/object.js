import Validator from "../../utils/validator";
import {Observable} from "../Observable";
import {ObservableObject} from "../ObservableObject";
import ObservableItem from "../ObservableItem";


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