import { createFilter, createMultiSourceFilter } from "./utils";

/**
 * Creates a filter that passes when the value includes the given query string.
 * Case-insensitive by default.
 * Alias: contains
 *
 * @param {string|ObservableItem<string>} observableOrValue - Substring to search for
 * @param {boolean} [caseSensitive=false] - If true, comparison is case-sensitive
 * @returns {FilterResult}
 * @example
 * const search = Observable('john');
 * users.where({ name: includes(search) }); // reactive, case-insensitive
 * users.where({ name: includes('John', true) }); // case-sensitive
 */
export function includes(observableOrValue, caseSensitive = false){
    return createFilter(observableOrValue, (value, query) => {
        if (!value) return false;
        if (!query) return true;
        if (!caseSensitive){
            return String(value).toLowerCase().includes(String(query).toLowerCase());
        }
        return String(value).includes(String(query));
    });
}

export const contains = includes;

/**
 * Creates a filter that passes when the value starts with the given query string.
 * Case-insensitive by default.
 *
 * @param {string|ObservableItem<string>} observableOrValue - Prefix to search for
 * @param {boolean} [caseSensitive=false] - If true, comparison is case-sensitive
 * @returns {FilterResult}
 * @example
 * users.where({ name: startsWith('Jo') });
 */
export function startsWith(observableOrValue, caseSensitive = false){
    return createFilter(observableOrValue, (value, query) => {
        if (!query) return true;
        if (!caseSensitive){
            return String(value).toLowerCase().startsWith(String(query).toLowerCase());
        }
        return String(value).startsWith(String(query));
    });
}

/**
 * Creates a filter that passes when the value ends with the given query string.
 * Case-insensitive by default.
 *
 * @param {string|ObservableItem<string>} observableOrValue - Suffix to search for
 * @param {boolean} [caseSensitive=false] - If true, comparison is case-sensitive
 * @returns {FilterResult}
 * @example
 * files.where({ name: endsWith('.js') });
 */
export function endsWith(observableOrValue, caseSensitive = false){
    return createFilter(observableOrValue, (value, query) => {
        if (!query) return true;
        if (!caseSensitive){
            return String(value).toLowerCase().endsWith(String(query).toLowerCase());
        }
        return String(value).endsWith(String(query));
    });
}