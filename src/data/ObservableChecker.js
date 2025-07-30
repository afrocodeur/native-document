/**
 *
 * @param {ObservableItem} $observable
 * @param {Function} $checker
 * @class ObservableChecker
 */
export default function ObservableChecker($observable, $checker) {
    this.observable = $observable;
    this.checker = $checker;

    this.subscribe = function(callback) {
        return $observable.subscribe((value) => {
            callback && callback($checker(value));
        });
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
    }

    this.cleanup = function() {
        return $observable.cleanup();
    }
}