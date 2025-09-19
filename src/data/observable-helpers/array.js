import NativeDocumentError from "../../errors/NativeDocumentError";
import {Observable} from "../Observable";
import PluginsManager from "../../utils/plugins-manager";


const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];

/**
 *
 * @param {Array} target
 * @returns {ObservableItem}
 */
Observable.array = function(target) {
    if(!Array.isArray(target)) {
        throw new NativeDocumentError('Observable.array : target must be an array');
    }
    const observer = Observable(target);

    PluginsManager.emit('CreateObservableArray', observer);

    methods.forEach((method) => {
        observer[method] = function(...values) {
            const result = observer.val()[method](...values);
            observer.trigger({ action: method, args: values, result });
            return result;
        };
    });

    observer.clear = function() {
        observer.val().length = 0;
        observer.trigger({ action: 'clear' });
        return true;
    };

    observer.merge = function(values) {
        observer.$value.push(...values);
        observer.trigger({ action: 'merge',  args: values });
    };

    observer.populateAndRender = function(iteration, callback) {
        observer.trigger({ action: 'populate', args: [observer.val(), iteration, callback] });
    };
    observer.remove = function(index) {
        const deleted = observer.val().splice(index, 1);
        if(deleted.length === 0) {
            return [];
        }
        observer.trigger({ action: 'remove', args: [index], result: deleted[0] });
        return deleted;
    };

    observer.swap = function(indexA, indexB) {
        const value = observer.val();
        const length = value.length;
        if(length < indexA || length < indexB) {
            return false;
        }
        if(indexB < indexA) {
            const temp = indexA;
            indexA = indexB;
            indexB = temp;
        }
        const elementA = value[indexA];
        const elementB = value[indexB]

        value[indexA] = elementB;
        value[indexB] = elementA;
        observer.trigger({ action: 'swap', args: [indexA, indexB], result: [elementA, elementB] });
        return true;
    };

    observer.length = function() {
        return observer.val().length;
    }

    const overrideMethods = ['map', 'filter', 'reduce', 'some', 'every', 'find', 'findIndex', 'concat', 'includes', 'indexOf'];
    overrideMethods.forEach((method) => {
        observer[method] = (...args) => {
            return observer.val()[method](...args);
        };
    })

    return observer;
};