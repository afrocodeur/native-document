/**
 * Creates an ObservableWhen that represents whether the observable equals a specific value.
 * Returns an object that can be subscribed to and will emit true/false.
 *
 * @param {*} value - The value to compare against
 * @returns {ObservableWhen} An ObservableWhen instance that tracks when the observable equals the value
 * @example
 * const status = Observable('idle');
 * const isLoading = status.when('loading');
 * isLoading.subscribe(active => console.log('Loading:', active));
 * status.set('loading'); // Logs: "Loading: true"
 */
import {ObservableWhen} from '../ObservableWhen';
import ObservableItem from '../ObservableItem';
import ObservableChecker from '../ObservableChecker';
import {Formatters} from '../../utils/formatters';
import NativeDocumentError from '../../errors/NativeDocumentError';

ObservableItem.prototype.when = function(value) {
    return new ObservableWhen(this, value);
};



/**
 * Create an Observable checker instance
 * @param callback
 * @returns {ObservableChecker}
 */
ObservableItem.prototype.check = function(callback) {
    return new ObservableChecker(this, callback);
};

ObservableItem.prototype.transform = ObservableItem.prototype.check;

/**
 * Returns a derived observable that emits the value of a nested property.
 * Alias for .check(value => value[property]).
 *
 * @param {string} property - Property name to extract
 * @returns {ObservableChecker<*>}
 * @example
 * const user = Observable({ name: 'John', age: 25 });
 * user.pluck('name').val(); // 'John'
 */
ObservableItem.prototype.pluck = function(property) {
    return new ObservableChecker(this, (value) => value[property]);
};

/**
 * Creates a derived observable using a callback or checks equality with a static value.
 * - If callback is a function: equivalent to .check(callback)
 * - If callback is a value: equivalent to .check(v => v === value)
 * Alias: .select()
 *
 * @param {Function|*} callbackOrValue - Transform function or value to compare
 * @returns {ObservableChecker<*>}
 * @example
 * const count = Observable(5);
 * count.is(v => v > 3).val(); // true
 * count.is(5).val(); // true
 */
ObservableItem.prototype.is = function(callbackOrValue) {
    if(typeof callbackOrValue === 'function') {
        return new ObservableChecker(this, callbackOrValue);
    }
    return new ObservableChecker(this, (value) => value === callbackOrValue);
};
ObservableItem.prototype.select = ObservableItem.prototype.check;

/**
 * Creates a derived observable that formats the current value using Intl.
 * Automatically reacts to both value changes and locale changes (Store.__nd.locale).
 *
 * @param {string | Function} type - Format type or custom formatter function
 * @param {Object} [options={}] - Options passed to the formatter
 * @returns {ObservableItem<string>}
 *
 * @example
 * // Currency
 * price.format('currency')                                      // "15 000 FCFA"
 * price.format('currency', { currency: 'EUR' })                 // "15 000,00 €"
 * price.format('currency', { notation: 'compact' })             // "15 K FCFA"
 *
 * // Number
 * count.format('number')                                        // "15 000"
 *
 * // Percent
 * rate.format('percent')                                        // "15,0 %"
 * rate.format('percent', { decimals: 2 })                       // "15,00 %"
 *
 * // Date
 * date.format('date')                                           // "3 mars 2026"
 * date.format('date', { dateStyle: 'full' })                    // "mardi 3 mars 2026"
 * date.format('date', { format: 'DD/MM/YYYY' })                 // "03/03/2026"
 * date.format('date', { format: 'DD MMM YYYY' })                // "03 mar 2026"
 * date.format('date', { format: 'DD MMMM YYYY' })               // "03 mars 2026"
 *
 * // Time
 * date.format('time')                                           // "20:30"
 * date.format('time', { second: '2-digit' })                    // "20:30:00"
 * date.format('time', { format: 'HH:mm:ss' })                   // "20:30:00"
 *
 * // Datetime
 * date.format('datetime')                                       // "3 mars 2026, 20:30"
 * date.format('datetime', { dateStyle: 'full' })                // "mardi 3 mars 2026, 20:30"
 * date.format('datetime', { format: 'DD/MM/YYYY HH:mm' })       // "03/03/2026 20:30"
 *
 * // Relative
 * date.format('relative')                                       // "dans 11 jours"
 * date.format('relative', { unit: 'month' })                    // "dans 1 mois"
 *
 * // Plural
 * count.format('plural', { singular: 'billet', plural: 'billets' }) // "3 billets"
 *
 * // Custom formatter
 * price.format(value => `${value.toLocaleString()} FCFA`)
 *
 * // Reacts to locale changes automatically
 * Store.setLocale('en-US');
 */
ObservableItem.prototype.format = function(type, options = {}) {
    const self = this;

    if (typeof type === 'function') {
        return new ObservableChecker(self, type);
    }

    if (process.env.NODE_ENV === 'development') {
        if (!Formatters[type]) {
            throw new NativeDocumentError(
                `Observable.format : unknown type '${type}'. Available : ${Object.keys(Formatters).join(', ')}.`,
            );
        }
    }

    const formatter = Formatters[type];
    const localeObservable = Formatters.locale;

    return ObservableItem.computed(() => formatter(self.val(), localeObservable.val(), options),
        [self, localeObservable],
    );
};