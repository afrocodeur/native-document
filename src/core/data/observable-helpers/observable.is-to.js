import ObservableItem from '../ObservableItem';

const $computed = (fn, dependencies) => ObservableItem.computed(fn, dependencies);
const $checker = (obs, fn) => obs.transform(fn);

//
// is... -> ObservableChecker<boolean>
//

/**
 * Returns a derived observable that emits true when the value strictly equals the given value.
 * Supports reactive comparison when an ObservableItem is passed.
 *
 * @param {*|ObservableItem} value - Static value or observable to compare against
 * @returns {ObservableChecker<boolean>}
 * @example
 * const age = Observable(25);
 * age.isEqualTo(25).val(); // true
 * age.isEqualTo(Observable(25)).val(); // true
 */
ObservableItem.prototype.isEqualTo = function (value) {
    if (value?.__$Observable) {
        return $computed((a, b) => a === b, [this, value]);
    }
    return $checker(this, x => x === value);
};

/**
 * Returns a derived observable that emits true when the value does not strictly equal the given value.
 *
 * @param {*|ObservableItem} value - Static value or observable to compare against
 * @returns {ObservableChecker<boolean>}
 */
ObservableItem.prototype.isNotEqualTo = function (value) {
    if (value?.__$Observable) {
        return $computed((a, b) => a !== b, [this, value]);
    }
    return $checker(this, x => x !== value);
};

/**
 * Returns a derived observable that emits true when the value is greater than the given value.
 *
 * @param {number|ObservableItem<number>} value - Threshold value or observable
 * @returns {ObservableChecker<boolean>}
 */
ObservableItem.prototype.isGreaterThan = function (value) {
    if (value?.__$Observable) {
        return $computed((a, b) => a > b, [this, value]);
    }
    return $checker(this, x => x > value);
};

/**
 * Returns a derived observable that emits true when the value is greater than or equal to the given value.
 *
 * @param {number|ObservableItem<number>} value - Threshold value or observable
 * @returns {ObservableChecker<boolean>}
 */
ObservableItem.prototype.isGreaterThanOrEqualTo = function (value) {
    if (value?.__$Observable) {
        return $computed((a, b) => a >= b, [this, value]);
    }
    return $checker(this, x => x >= value);
};

/**
 * Returns a derived observable that emits true when the value is less than the given value.
 *
 * @param {number|ObservableItem<number>} value - Threshold value or observable
 * @returns {ObservableChecker<boolean>}
 */
ObservableItem.prototype.isLessThan = function (value) {
    if (value?.__$Observable) {
        return $computed((a, b) => a < b, [this, value]);
    }
    return $checker(this, x => x < value);
};

/**
 * Returns a derived observable that emits true when the value is less than or equal to the given value.
 *
 * @param {number|ObservableItem<number>} value - Threshold value or observable
 * @returns {ObservableChecker<boolean>}
 */
ObservableItem.prototype.isLessThanOrEqualTo = function (value) {
    if (value?.__$Observable) {
        return $computed((a, b) => a <= b, [this, value]);
    }
    return $checker(this, x => x <= value);
};

/**
 * Returns a derived observable that emits true when the value is between min and max (inclusive).
 * All combinations of static and observable min/max are supported.
 *
 * @param {number|ObservableItem<number>} min - Lower bound (inclusive)
 * @param {number|ObservableItem<number>} max - Upper bound (inclusive)
 * @returns {ObservableChecker<boolean>}
 * @example
 * const age = Observable(25);
 * age.isBetween(18, 65).val(); // true
 * age.isBetween(Observable(18), Observable(65)).val(); // true
 */
ObservableItem.prototype.isBetween = function (min, max) {
    if (min.__$Observable && max.__$Observable) {
        return $computed((x, a, b) => x >= a && x <= b, [this, min, max]);
    }
    if (min.__$Observable) {
        return $computed((x, a) => x >= a && x <= max, [this, min]);
    }
    if (max.__$Observable) {
        return $computed((x, b) => x >= min && x <= b, [this, max]);
    }
    return $checker(this, x => x >= min && x <= max);
};

/**
 * Returns a derived observable that emits true when the value is null or undefined.
 *
 * @returns {ObservableChecker<boolean>}
 */
ObservableItem.prototype.isNull = function () {
    return $checker(this, x => x == null);
};

/**
 * Returns a derived observable that emits true when the value is truthy.
 *
 * @returns {ObservableChecker<boolean>}
 */
ObservableItem.prototype.isTruthy = function () {
    return $checker(this, x => !!x);
};

/**
 * Returns a derived observable that emits true when the value is falsy.
 *
 * @returns {ObservableChecker<boolean>}
 */
ObservableItem.prototype.isFalsy = function () {
    return $checker(this, x => !x);
};

/**
 * Returns a derived observable that emits true when the string value starts with the given string.
 *
 * @param {string|ObservableItem<string>} str - Prefix to check for
 * @returns {ObservableChecker<boolean>}
 */
ObservableItem.prototype.isStartingWith = function (str) {
    if (str?.__$Observable) {
        return $computed((a, b) => String(a).startsWith(b), [this, str]);
    }
    return $checker(this, x => String(x).startsWith(str));
};

/**
 * Returns a derived observable that emits true when the string value ends with the given string.
 *
 * @param {string|ObservableItem<string>} str - Suffix to check for
 * @returns {ObservableChecker<boolean>}
 */
ObservableItem.prototype.isEndingWith = function (str) {
    if (str?.__$Observable) {
        return $computed((a, b) => String(a).endsWith(b), [this, str]);
    }
    return $checker(this, x => String(x).endsWith(str));
};

/**
 * Returns a derived observable that emits true when the string value matches the given regex.
 *
 * @param {RegExp|ObservableItem<RegExp>} regex - Pattern to test against
 * @returns {ObservableChecker<boolean>}
 */
ObservableItem.prototype.isMatchingPattern = function (regex) {
    if (regex?.__$Observable) {
        return $computed((a, b) => new RegExp(b).test(String(a)), [this, regex]);
    }
    return $checker(this, x => regex.test(String(x)));
};

/**
 * Returns a derived observable that emits true when the value is empty.
 * Empty means: null, undefined, empty string, or empty array.
 *
 * @returns {ObservableChecker<boolean>}
 */
ObservableItem.prototype.isEmpty = function () {
    return $checker(this, x => x == null || x === '' || (Array.isArray(x) && x.length === 0));
};

/**
 * Returns a derived observable that emits true when the value is not empty.
 * Not empty means: not null, not undefined, not empty string, not empty array.
 *
 * @returns {ObservableChecker<boolean>}
 */
ObservableItem.prototype.isNotEmpty = function () {
    return $checker(this, x => x != null && x !== '' && !(Array.isArray(x) && x.length === 0));
};

/**
 * Returns a derived observable that emits true when the value includes the given value.
 * Works for both arrays (includes check) and strings (substring check).
 *
 * @param {*|ObservableItem} value - Value to search for
 * @returns {ObservableChecker<boolean>}
 * @example
 * Observable([1, 2, 3]).isIncludes(2).val(); // true
 * Observable('hello world').isIncludes('world').val(); // true
 */
ObservableItem.prototype.isIncludes = function (value) {
    if (value?.__$Observable) {
        return $computed((a, b) => {
            if (Array.isArray(a)) return a.includes(b);
            return String(a).includes(String(b));
        }, [this, value]);
    }
    return $checker(this, x => {
        if (Array.isArray(x)) return x.includes(value);
        return String(x).includes(String(value));
    });
};

/**
 * Returns a derived observable that emits true when the value is included in the given array.
 * Alias: isOneOf
 *
 * @param {Array|ObservableItem<Array>} array - Array to check membership in
 * @returns {ObservableChecker<boolean>}
 * @example
 * const role = Observable('admin');
 * role.isIncludedIn(['admin', 'editor']).val(); // true
 */
ObservableItem.prototype.isIncludedIn = function (array) {
    if (array?.__$Observable) {
        return $computed((a, b) => b.includes(a), [this, array]);
    }
    return $checker(this, x => array.includes(x));
};

ObservableItem.prototype.isOneOf = ObservableItem.prototype.isIncludedIn;

/**
 * Returns a derived observable that emits true when the given key exists in the value object.
 *
 * @param {string|ObservableItem<string>} key - Property key to check for
 * @returns {ObservableChecker<boolean>}
 * @example
 * const user = Observable({ name: 'John' });
 * user.isHaving('name').val(); // true
 */
ObservableItem.prototype.isHaving = function (key) {
    if (key?.__$Observable) {
        return $computed((a, b) => b in Object(a), [this, key]);
    }
    return $checker(this, x => key in Object(x));
};

//
// to... -> ObservableChecker<any>
//

/**
 * Returns a derived observable that emits the string value converted to uppercase.
 *
 * @returns {ObservableChecker<string>}
 */
ObservableItem.prototype.toUpperCase = function () {
    return $checker(this, x => String(x).toUpperCase());
};

/**
 * Returns a derived observable that emits the string value converted to lowercase.
 *
 * @returns {ObservableChecker<string>}
 */
ObservableItem.prototype.toLowerCase = function () {
    return $checker(this, x => String(x).toLowerCase());
};

/**
 * Returns a derived observable that emits the string value trimmed of whitespace.
 *
 * @returns {ObservableChecker<string>}
 */
ObservableItem.prototype.toTrimmed = function () {
    return $checker(this, x => String(x).trim());
};

/**
 * Returns a derived observable that emits the value coerced to boolean.
 *
 * @returns {ObservableChecker<boolean>}
 */
ObservableItem.prototype.toBoolean = function () {
    return $checker(this, x => !!x);
};

/**
 * Returns a derived observable that emits a string with the placeholder replaced by the current value.
 * Alias: toFormatted
 *
 * @param {string} template - Template string containing the placeholder
 * @param {string} [placeholder='${v}'] - Placeholder string to replace with the value
 * @returns {ObservableChecker<string>}
 * @example
 * const count = Observable(5);
 * count.toLiteral('You have ${v} items').val(); // 'You have 5 items'
 */
ObservableItem.prototype.toLiteral = function (template, placeholder = '${v}') {
    return $checker(this, x => template.replace(placeholder, x));
};

ObservableItem.prototype.toFormatted = ObservableItem.prototype.toLiteral;

/**
 * Returns a derived observable that emits a nested property value resolved via dot notation.
 *
 * @param {string} key - Dot-notation path to the property (e.g. 'user.address.city')
 * @returns {ObservableChecker<*>}
 * @example
 * const state = Observable({ user: { name: 'John' } });
 * state.toProperty('user.name').val(); // 'John'
 */
ObservableItem.prototype.toProperty = function (key) {
    const keys = key.split('.');
    return $checker(this, x => {
        let value = x;
        for (const k of keys) {
            if (value == null) return undefined;
            value = value[k];
        }
        return value;
    });
};

/**
 * Returns a derived observable that emits the length of the current value.
 * Returns 0 if the value is null or undefined.
 *
 * @returns {ObservableChecker<number>}
 */
ObservableItem.prototype.toLength = function () {
    return $checker(this, x => (x == null ? 0 : x.length));
};

/**
 * Returns a derived observable that emits the value clamped between min and max.
 * All combinations of static and observable min/max are supported.
 *
 * @param {number|ObservableItem<number>} min - Minimum bound
 * @param {number|ObservableItem<number>} max - Maximum bound
 * @returns {ObservableChecker<number>}
 * @example
 * const volume = Observable(150);
 * volume.toClamped(0, 100).val(); // 100
 */
ObservableItem.prototype.toClamped = function (min, max) {
    if (min.__$Observable && max.__$Observable) {
        return $computed((x, a, b) => Math.min(Math.max(x, a), b), [this, min, max]);
    }
    if (min.__$Observable) {
        return $computed((x, a) => Math.min(Math.max(x, a), max), [this, min]);
    }
    if (max.__$Observable) {
        return $computed((x, b) => Math.min(Math.max(x, min), b), [this, max]);
    }
    return $checker(this, x => Math.min(Math.max(x, min), max));
};

/**
 * Returns a derived observable that emits the value expressed as a percentage of total.
 * Returns 0 if total is 0.
 *
 * @param {number|ObservableItem<number>} total - The total value representing 100%
 * @returns {ObservableChecker<number>}
 * @example
 * const score = Observable(75);
 * score.toPercent(100).val(); // 75
 * score.toPercent(200).val(); // 37.5
 */
ObservableItem.prototype.toPercent = function (total) {
    if (total?.__$Observable) {
        return $computed((a, b) => (b === 0 ? 0 : (a / b) * 100), [this, total]);
    }
    return $checker(this, x => (total === 0 ? 0 : (x / total) * 100));
};