
/**
 * Creates an ObservableWhen that tracks whether an observable equals a specific value.
 *
 * @param {ObservableItem} observer - The observable to watch
 * @param {*} value - The value to compare against
 * @class ObservableWhen
 */
export const ObservableWhen = function(observer, value) {
    this.$target = value;
    this.$observer = observer;
};

ObservableWhen.prototype.__$Observable = true;
ObservableWhen.prototype.__$isObservableWhen = true;

/**
 * Subscribes to changes in the match status (true when observable equals target value).
 *
 * @param {Function} callback - Function called with boolean indicating if values match
 * @returns {Function} Unsubscribe function
 * @example
 * const status = Observable('idle');
 * const isLoading = status.when('loading');
 * isLoading.subscribe(active => console.log('Loading:', active));
 */
ObservableWhen.prototype.subscribe = function(callback) {
    return this.$observer.on(this.$target, callback);
};

/**
 * Returns true if the observable's current value equals the target value.
 *
 * @returns {boolean} True if observable value matches target value
 */
ObservableWhen.prototype.val = function() {
    return this.$observer.$currentValue === this.$target;
};

/**
 * Returns true if the observable's current value equals the target value.
 * Alias for val().
 *
 * @returns {boolean} True if observable value matches target value
 */
ObservableWhen.prototype.isMatch = ObservableWhen.prototype.val;

/**
 * Returns true if the observable's current value equals the target value.
 * Alias for val().
 *
 * @returns {boolean} True if observable value matches target value
 */
ObservableWhen.prototype.isActive = ObservableWhen.prototype.val;