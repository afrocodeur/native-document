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

    this.cleanup = function() {
        return $observable.cleanup();
    }
}