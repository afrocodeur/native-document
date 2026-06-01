import ObservableItem from './ObservableItem';
import PluginsManager from '../utils/plugins-manager';

/**
 *
 * @param {ObservableItem} $observable
 * @param {Function} $checker
 * @class ObservableChecker
 */
export default function ObservableChecker($observable, $checker) {
    this.observable = $observable;

    ObservableItem.call(this);
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('CreateObservableChecker', this);
    }

    this.$mutation = $checker;

    $observable.subscribe((newValue) => {
        this.$updateWithMutation(newValue);
    });

    this.$updateWithMutation($observable.val());
}

ObservableChecker.prototype = Object.create(ObservableItem.prototype);
ObservableChecker.prototype.constructor = ObservableChecker;
ObservableChecker.prototype.__$Observable = true;
ObservableChecker.prototype.__$isObservableChecker = true;


export const ObservablePipe = ObservableChecker;
ObservablePipe.prototype.constructor = ObservablePipe;

ObservableChecker.prototype.$updateWithMutation = function(newValue) {
    newValue = this.$mutation(newValue);
    return this.set(newValue);
};