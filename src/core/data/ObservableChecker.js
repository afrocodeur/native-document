/**
 *
 * @param {ObservableItem} $observable
 * @param {Function} $checker
 * @class ObservableChecker
 */
export default function ObservableChecker($observable, $checker) {
    this.observable = $observable;
    this.checker = $checker;
    this.unSubscriptions = [];
}

export const ObservablePipe = ObservableChecker;

ObservableChecker.prototype.__$Observable = true;
ObservableChecker.prototype.__$isObservableChecker = true;

/**
 * Subscribes to changes in the checked/transformed value.
 *
 * @param {Function} callback - Function called with the transformed value when observable changes
 * @returns {Function} Unsubscribe function
 * @example
 * const count = Observable(5);
 * const doubled = count.check(n => n * 2);
 * doubled.subscribe(value => console.log(value)); // Logs: 10
 */
ObservableChecker.prototype.subscribe = function(callback) {
    const unSubscribe = this.observable.subscribe((value) => {
        callback && callback(this.checker(value));
    });
    this.unSubscriptions.push(unSubscribe);
    return unSubscribe;
};

/**
 * Creates a new ObservableChecker by applying another transformation.
 * Allows chaining transformations.
 *
 * @param {(value: *) => *} callback - Transformation function to apply to the current checked value
 * @returns {ObservableChecker} New ObservableChecker with chained transformation
 * @example
 * const count = Observable(5);
 * const result = count.check(n => n * 2).check(n => n + 1);
 * result.val(); // 11
 */
ObservableChecker.prototype.check = function(callback) {
    return this.observable.check(() => callback(this.val()));
}

/**
 * Gets the current transformed/checked value.
 *
 * @returns {*} The result of applying the checker function to the observable's current value
 * @example
 * const count = Observable(5);
 * const doubled = count.check(n => n * 2);
 * doubled.val(); // 10
 */
ObservableChecker.prototype.val = function() {
    return this.checker && this.checker(this.observable.val());
}

/**
 * Sets the value of the underlying observable (not the transformed value).
 *
 * @param {*} value - New value for the underlying observable
 * @example
 * const count = Observable(5);
 * const doubled = count.check(n => n * 2);
 * doubled.set(10); // Sets count to 10, doubled.val() returns 20
 */
ObservableChecker.prototype.set = function(value) {
    return this.observable.set(value);
};

/**
 * Manually triggers the underlying observable to notify subscribers.
 *
 * @example
 * const count = Observable(5);
 * const doubled = count.check(n => n * 2);
 * doubled.trigger(); // Notifies all subscribers
 */
ObservableChecker.prototype.trigger = function() {
    return this.observable.trigger();
};

/**
 * Cleans up the underlying observable and all its subscriptions.
 */
ObservableChecker.prototype.cleanup = function() {
    return this.observable.cleanup();
};