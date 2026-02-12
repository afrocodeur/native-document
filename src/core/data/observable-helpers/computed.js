import ObservableItem from "../ObservableItem";
import Validator from "../../utils/validator";
import NativeDocumentError from "../..//errors/NativeDocumentError";
import {Observable} from "../Observable";
import PluginsManager from "../../utils/plugins-manager";
import {nextTick} from "../../utils/helpers";

/**
 * Creates a computed observable that automatically updates when its dependencies change.
 * The callback is re-executed whenever any dependency observable changes.
 *
 * @param {Function} callback - Function that returns the computed value
 * @param {Array<ObservableItem|ObservableChecker|ObservableProxy>|Function} [dependencies=[]] - Array of observables to watch, or batch function
 * @returns {ObservableItem} A new observable that updates automatically
 * @example
 * const firstName = Observable('John');
 * const lastName = Observable('Doe');
 * const fullName = Observable.computed(
 *   () => `${firstName.val()} ${lastName.val()}`,
 *   [firstName, lastName]
 * );
 *
 * // With batch function
 * const batch = Observable.batch(() => { ...  });
 * const computed = Observable.computed(() => { ... }, batch);
*/
Observable.computed = function(callback, dependencies = []) {
    const initialValue = callback();
    const observable = new ObservableItem(initialValue);
    const updatedValue = nextTick(() => observable.set(callback()));
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('CreateObservableComputed', observable, dependencies);
    }

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