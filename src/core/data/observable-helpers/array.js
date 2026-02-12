import {Observable} from "../Observable";
import ObservableArray from "../ObservableArray";


/**
 * Creates an observable array with reactive array methods.
 * All mutations trigger updates automatically.
 *
 * @param {Array} [target=[]] - Initial array value
 * @param {Object|null} [configs=null] - Configuration options
 * // @param {boolean} [configs.propagation=true] - Whether to propagate changes to parent observables
 * // @param {boolean} [configs.deep=false] - Whether to make nested objects observable
 * @param {boolean} [configs.reset=false] - Whether to store initial value for reset()
 * @returns {ObservableArray} An observable array with reactive methods
 * @example
 * const items = Observable.array([1, 2, 3]);
 * items.push(4); // Triggers update
 * items.subscribe((arr) => console.log(arr));
 */
Observable.array = function(target = [], configs = null) {
    return new ObservableArray(target, configs);
};