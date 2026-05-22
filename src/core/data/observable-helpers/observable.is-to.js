import ObservableItem from "../ObservableItem";

const $computed = (fn, dependencies) => ObservableItem.computed(fn, dependencies);
const $checker = (obs, fn) => obs.transform(fn);

//
// is... -> ObservableChecker<boolean>
//

ObservableItem.prototype.isEqualTo = function (value) {
    if (value?.__$Observable) {
        return $computed((a, b) => a === b, [this, value]);
    }
    return $checker(this, x => x === value);
};

ObservableItem.prototype.isNotEqualTo = function (value) {
    if (value?.__$Observable) {
        return $computed((a, b) => a !== b, [this, value]);
    }
    return $checker(this, x => x !== value);
};

ObservableItem.prototype.isGreaterThan = function (value) {
    if (value?.__$Observable) {
        return $computed((a, b) => a > b, [this, value]);
    }
    return $checker(this, x => x > value);
};

ObservableItem.prototype.isGreaterThanOrEqualTo = function (value) {
    if (value?.__$Observable) {
        return $computed((a, b) => a >= b, [this, value]);
    }
    return $checker(this, x => x >= value);
};

ObservableItem.prototype.isLessThan = function (value) {
    if (value?.__$Observable) {
        return $computed((a, b) => a < b, [this, value]);
    }
    return $checker(this, x => x < value);
};

ObservableItem.prototype.isLessThanOrEqualTo = function (value) {
    if (value?.__$Observable) {
        return $computed((a, b) => a <= b, [this, value]);
    }
    return $checker(this, x => x <= value);
};

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

ObservableItem.prototype.isNull = function () {
    return $checker(this, x => x == null);
};

ObservableItem.prototype.isTruthy = function () {
    return $checker(this, x => !!x);
};

ObservableItem.prototype.isFalsy = function () {
    return $checker(this, x => !x);
};

ObservableItem.prototype.isStartingWith = function (str) {
    if (str?.__$Observable) {
        return $computed((a, b) => String(a).startsWith(b), [this, str]);
    }
    return $checker(this, x => String(x).startsWith(str));
};

ObservableItem.prototype.isEndingWith = function (str) {
    if (str?.__$Observable) {
        return $computed((a, b) => String(a).endsWith(b), [this, str]);
    }
    return $checker(this, x => String(x).endsWith(str));
};

ObservableItem.prototype.isMatchingPattern = function (regex) {
    if (regex?.__$Observable) {
        return $computed((a, b) => new RegExp(b).test(String(a)), [this, regex]);
    }
    return $checker(this, x => regex.test(String(x)));
};

ObservableItem.prototype.isEmpty = function () {
    return $checker(this, x => x == null || x === '' || (Array.isArray(x) && x.length === 0));
};

ObservableItem.prototype.isNotEmpty = function () {
    return $checker(this, x => x != null && x !== '' && !(Array.isArray(x) && x.length === 0));
};

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

ObservableItem.prototype.isIncludedIn = function (array) {
    if (array?.__$Observable) {
        return $computed((a, b) => b.includes(a), [this, array]);
    }
    return $checker(this, x => array.includes(x));
};

ObservableItem.prototype.isOneOf = ObservableItem.prototype.isIncludedIn;

ObservableItem.prototype.isHaving = function (key) {
    if (key?.__$Observable) {
        return $computed((a, b) => b in Object(a), [this, key]);
    }
    return $checker(this, x => key in Object(x));
};

//
// to... -> ObservableChecker<any>
//

ObservableItem.prototype.toUpperCase = function () {
    return $checker(this, x => String(x).toUpperCase());
};

ObservableItem.prototype.toLowerCase = function () {
    return $checker(this, x => String(x).toLowerCase());
};

ObservableItem.prototype.toTrimmed = function () {
    return $checker(this, x => String(x).trim());
};

ObservableItem.prototype.toBoolean = function () {
    return $checker(this, x => !!x);
};

ObservableItem.prototype.toLiteral = function (template, placeholder = '${v}') {
    return $checker(this, x => template.replace(placeholder, x));
};

ObservableItem.prototype.toFormatted = ObservableItem.prototype.toLiteral;

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

ObservableItem.prototype.toLength = function () {
    return $checker(this, x => (x == null ? 0 : x.length));
};

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

ObservableItem.prototype.toPercent = function (total) {
    if (total?.__$Observable) {
        return $computed((a, b) => (b === 0 ? 0 : (a / b) * 100), [this, total]);
    }
    return $checker(this, x => (total === 0 ? 0 : (x / total) * 100));
};