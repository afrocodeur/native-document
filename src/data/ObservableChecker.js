/**
 *
 * @param {ObservableItem} $observable
 * @param {Function} $checker
 * @class ObservableChecker
 */
export default function ObservableChecker($observable, $checker) {
    this.__$isObservableChecker = true;
    this.observable = $observable;
    this.checker = $checker;
    this.unSubscriptions = [];
}

ObservableChecker.prototype.subscribe = function(callback) {
    const unSubscribe = this.observable.subscribe((value) => {
        callback && callback(this.checker(value));
    });
    this.unSubscriptions.push(unSubscribe);
    return unSubscribe;
};

ObservableChecker.prototype.check = function(callback) {
    return this.observable.check(() => callback(this.val()));
}

ObservableChecker.prototype.val = function() {
    return this.checker && this.checker(this.observable.val());
}

ObservableChecker.prototype.set = function(value) {
    return this.observable.set(value);
};

ObservableChecker.prototype.trigger = function() {
    return this.observable.trigger();
};

ObservableChecker.prototype.cleanup = function() {
    return this.observable.cleanup();
};