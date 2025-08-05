/**
 *
 * @param {ObservableItem} $observable
 * @param {Function} $checker
 * @class ObservableChecker
 */
export default function ObservableChecker($observable, $checker) {
    this.observable = $observable;
    this.checker = $checker;
    const $unSubscriptions = [];

    this.subscribe = function(callback) {
        const unSubscribe = $observable.subscribe((value) => {
            callback && callback($checker(value));
        });
        $unSubscriptions.push(unSubscribe);

        return unSubscribe;
    };

    this.val = function() {
        return $checker && $checker($observable.val());
    };
    this.check = function(callback) {
        return $observable.check(() => callback(this.val()));
    };

    this.set = function(value) {
        return $observable.set(value);
    };
    this.trigger = function() {
        return $observable.trigger();
    };

    this.cleanup = function() {
        $unSubscriptions.forEach(unSubscription => unSubscription());
    };
}