import ObservableItem from "../ObservableItem";
import Validator from "../../utils/validator";
import NativeDocumentError from "../../errors/NativeDocumentError";
import {Observable} from "../Observable";
import PluginsManager from "../../utils/plugins-manager";

/**
 *
 * @param {Function} callback
 * @param {Array|Function} dependencies
 * @returns {ObservableItem}
 */
Observable.computed = function(callback, dependencies = []) {
    const initialValue = callback();
    const observable = new ObservableItem(initialValue);
    const updatedValue = () => observable.set(callback());

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