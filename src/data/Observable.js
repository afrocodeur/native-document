import ObservableItem from './ObservableItem';
import MemoryManager from "./MemoryManager";
import NativeDocumentError from "../errors/NativeDocumentError";

/**
 *
 * @param {*} value
 * @param {{ propagation: boolean, reset: boolean} | null} configs
 * @returns {ObservableItem}
 * @constructor
 */
export function Observable(value, configs = null) {
    return new ObservableItem(value, configs);
}

export const $ = Observable;
export const obs = Observable;

/**
 *
 * @param {string} propertyName
 */
Observable.useValueProperty = function(propertyName = 'value') {
    Object.defineProperty(ObservableItem.prototype, propertyName, {
        get() {
            return this.$currentValue;
        },
        set(value) {
            this.set(value);
        },
        configurable: true,
    });
};


/**
 *
 * @param id
 * @returns {ObservableItem|null}
 */
Observable.getById = function(id) {
    const item = MemoryManager.getObservableById(parseInt(id));
    if(!item) {
        throw new NativeDocumentError('Observable.getById : No observable found with id ' + id);
    }
    return item;
};

/**
 *
 * @param {ObservableItem} observable
 */
Observable.cleanup = function(observable) {
    observable.cleanup();
};

/**
 * Enable auto cleanup of observables.
 * @param {Boolean} enable
 * @param {{interval:Boolean, threshold:number}} options
 */
Observable.autoCleanup = function(enable = false, options = {}) {
    if(!enable) {
        return;
    }
    const { interval = 60000, threshold = 100 } = options;

    window.addEventListener('beforeunload', () => {
        MemoryManager.cleanup();
    });

    setInterval(() => MemoryManager.cleanObservables(threshold), interval);
};

