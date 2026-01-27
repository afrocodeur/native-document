import Validator from "@src/core/utils/validator";
import {Observable} from ".@src/core/data/Observable";

/**
 *
 * @param {Function} callback
 * @returns {Function}
 */
Observable.batch = function(callback) {
    const $observer = Observable(0);
    const batch = function() {
        if(Validator.isAsyncFunction(callback)) {
            return (callback(...arguments)).then(() => {
                $observer.trigger();
            }).catch(error => { throw error; });
        }
        callback(...arguments);
        $observer.trigger();
    };
    batch.$observer = $observer;
    return batch;
};