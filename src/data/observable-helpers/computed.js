import ObservableItem from "../ObservableItem";
import Validator from "../../utils/validator";
import NativeDocumentError from "../../errors/NativeDocumentError";
import {Observable} from "../Observable";

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

    if(Validator.isFunction(dependencies)) {
        if(!Validator.isObservable(dependencies.$observer)) {
            throw new NativeDocumentError('Observable.computed : dependencies must be valid batch function');
        }
        dependencies.$observer.subscribe(updatedValue);
        return observable;
    }

    dependencies.forEach(dependency => dependency.subscribe(updatedValue));

    return observable;
};