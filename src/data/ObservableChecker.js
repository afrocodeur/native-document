/**
 *
 * @param {ObservableItem} observable
 * @param {Function} checker
 * @class ObservableChecker
 */
export default function ObservableChecker(observable, checker) {
    this.observable = observable;
    this.checker = checker;
}