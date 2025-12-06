import {Observable} from "../Observable";
import ObservableArray from "../ObservableArray.js";


/**
 *
 * @param {Array} target
 * @returns {ObservableArray}
 */
Observable.array = function(target) {
    return new ObservableArray(target);
};