import {Observable} from "@src/core/data/Observable";
import ObservableArray from "@src/core/data/ObservableArray.js";


/**
 *
 * @param {Array} target
 * @param {{propagation: boolean, deep: boolean, reset: boolean}|null} configs
 * @returns {ObservableArray}
 */
Observable.array = function(target = [], configs = null) {
    return new ObservableArray(target, configs);
};