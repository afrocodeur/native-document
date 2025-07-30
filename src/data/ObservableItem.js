import DebugManager from "../utils/debug-manager";
import MemoryManager from "./MemoryManager";
import NativeDocumentError from "../errors/NativeDocumentError";
import ObservableChecker from "./ObservableChecker";

/**
 *
 * @param {*} value
 * @class ObservableItem
 */
export default function ObservableItem(value) {
    if (value === undefined) {
        throw new NativeDocumentError('ObservableItem requires an initial value');
    }
    if(value instanceof ObservableItem) {
        throw new NativeDocumentError('ObservableItem cannot be an Observable');
    }

    const $initialValue = (typeof value === 'object') ? JSON.parse(JSON.stringify(value)) : value;

    let $previousValue = value;
    let $currentValue = value;
    let $isCleanedUp = false;

    const $listeners = [];

    const $memoryId = MemoryManager.register(this, $listeners);

    this.trigger = () => {
        $listeners.forEach(listener => {
            try {
                listener($currentValue, $previousValue);
            } catch (error) {
                DebugManager.error('Listener Undefined', 'Error in observable listener:', error);
                this.unsubscribe(listener);
            }
        });

    };

    this.originalValue = () => $initialValue;

    /**
     * @param {*} data
     */
    this.set = (data) => {
        const newValue = (typeof data === 'function') ? data($currentValue) : data;
        if($currentValue === newValue) {
            return;
        }
        $previousValue = $currentValue;
        $currentValue = newValue;
        this.trigger();
    };

    this.val = () => $currentValue;

    this.cleanup = function() {
        $listeners.splice(0);
        $isCleanedUp = true;
    };

    /**
     *
     * @param {Function} callback
     * @returns {(function(): void)}
     */
    this.subscribe = (callback) => {
        if ($isCleanedUp) {
            DebugManager.warn('Observable subscription', '⚠️ Attempted to subscribe to a cleaned up observable.');
            return () => {};
        }
        if (typeof callback !== 'function') {
            throw new NativeDocumentError('Callback must be a function');
        }

        $listeners.push(callback);
        return () => this.unsubscribe(callback);
    };

    /**
     * Unsubscribe from an observable.
     * @param {Function} callback
     */
    this.unsubscribe = (callback) => {
        const index = $listeners.indexOf(callback);
        if (index > -1) {
            $listeners.splice(index, 1);
        }
    };

    /**
     * Create an Observable checker instance
     * @param callback
     * @returns {ObservableChecker}
     */
    this.check = function(callback) {
        return new ObservableChecker(this, callback)
    };

    const $object = this;
    Object.defineProperty($object, '$value', {
        get() {
            return $object.val();
        },
        set(value) {
            $object.set(value);
            return $object;
        }
    })

    this.toString = function() {
        return   '{{#ObItem::(' +$memoryId+ ')}}';
    };

}