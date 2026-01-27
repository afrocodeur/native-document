import ObservableItem from "@src/core/data/ObservableItem";
import Validator from "@src/core/utils/validator";
import NativeDocumentError from "@src/core/errors/NativeDocumentError";
import {Observable} from "@src/core/data/Observable";
import PluginsManager from "@src/core/utils/plugins-manager";
import {nextTick} from "@src/core/utils/helpers";

/**
 *
 * @param {Function} callback
 * @param {Array|Function} dependencies
 * @returns {ObservableItem}
 */
Observable.computed = function(callback, dependencies = []) {
    const initialValue = callback();
    const observable = new ObservableItem(initialValue);
    const updatedValue = nextTick(() => observable.set(callback()));

    PluginsManager.emit('CreateObservableComputed', observable, dependencies)

    if(Validator.isFunction(dependencies)) {
        if(!Validator.isObservable(dependencies.$observer)) {
            throw new NativeDocumentError('Observable.computed : dependencies must be valid batch function');
        }
        dependencies.$observer.subscribe(updatedValue);
        return observable;
    }

    dependencies.forEach(dependency => {
        if(Validator.isProxy(dependency)) {
            dependency.$observables.forEach((observable) => {
                observable.subscribe(updatedValue);
            });
            return;
        }
        dependency.subscribe(updatedValue);
    });

    return observable;
};