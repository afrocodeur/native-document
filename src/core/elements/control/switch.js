import NativeDocumentError from "../../errors/NativeDocumentError";
import Validator from "../../utils/validator";
import Anchor from "../../elements/anchor";
import {ElementCreator} from "../../wrappers/ElementCreator";



/**
 * Displays different content based on the current value of an observable.
 * Like a switch statement for UI - shows the content corresponding to current value.
 *
 * @param {ObservableItem|ObservableChecker} $condition - Observable to watch
 * @param {Object<string|number, ValidChild>} values - Map of values to their corresponding content
 * @param {boolean} [shouldKeepInCache=true] - Whether to cache rendered views
 * @returns {AnchorDocumentFragment & {add: Function, remove: Function}} Fragment with dynamic methods
 * @example
 * const status = Observable('idle');
 * const view = Match(status, {
 *   idle: Div({}, 'Ready'),
 *   loading: Div({}, 'Loading...'),
 *   error: Div({}, 'Error occurred')
 * });
 *
 * // Dynamic addition
 * view.add('success', Div({}, 'Success!'));
 * view.remove('idle');
 */
export const Match = function($condition, values, shouldKeepInCache = true) {

    if(!Validator.isObservable($condition)) {
        throw new NativeDocumentError("Toggle : condition must be an Observable");
    }

    const anchor = Anchor('Match');
    const cache = new Map();

    const getItem = function(key) {
        if(shouldKeepInCache && cache.has(key)) {
            return cache.get(key);
        }
        let item = values[key];
        if(!item) {
            return null;
        }
        item = ElementCreator.getChild(item);
        if(Validator.isFragment(item)) {
            item = Array.from(item.children);
        }
        shouldKeepInCache && cache.set(key, item);
        return item;
    }

    const defaultValue = $condition.val();
    const defaultContent = getItem(defaultValue);
    if(defaultContent) {
        anchor.appendChild(defaultContent);
    }

    $condition.subscribe(value => {
        const content = getItem(value);
        anchor.remove();
        if(content) {
            anchor.appendChild(content);
        }
    });

    return anchor.nd.with({
        add(key, view, shouldFocusOn = false) {
            values[key] = view;
            if(shouldFocusOn) {
                $condition.set(key);
            }
        },
        remove(key) {
            shouldKeepInCache && cache.delete(key);
            delete values[key];
        }
    });
}


/**
 * Displays one of two views based on a boolean observable condition.
 * Simplified version of Match for true/false cases.
 *
 * @param {ObservableItem<boolean>|ObservableChecker<boolean>} $condition - Boolean observable to watch
 * @param {ValidChild} onTrue - Content to show when condition is true
 * @param {ValidChild} onFalse - Content to show when condition is false
 * @returns {AnchorDocumentFragment} Fragment managing the conditional content
 * @example
 * const isLoggedIn = Observable(false);
 * Switch(isLoggedIn,
 *   Div({}, 'Welcome back!'),
 *   Div({}, 'Please login')
 * );
 */
export const Switch = function ($condition, onTrue, onFalse) {
    if(!Validator.isObservable($condition)) {
        throw new NativeDocumentError("Toggle : condition must be an Observable");
    }

    return Match($condition, {
        true: onTrue,
        false: onFalse,
    });
}

/**
 * Provides a fluent API for conditional rendering with show/otherwise pattern.
 *
 * @param {ObservableItem<boolean>|ObservableChecker<boolean>} $condition - Boolean observable to watch
 * @returns {{show: Function, otherwise: Function}} Object with fluent methods
 * @example
 * const isLoading = Observable(false);
 * When(isLoading)
 *   .show(LoadingSpinner())
 *   .otherwise(Content());
 */
export const When = function($condition) {
    if(!Validator.isObservable($condition)) {
        throw new NativeDocumentError("When : condition must be an Observable");
    }

    let $onTrue = null;
    let $onFalse = null;

    return {
        show(onTrue) {
            $onTrue = onTrue;
            return this;
        },
        otherwise(onFalse) {
            $onFalse = onFalse;
            return Switch($condition, $onTrue, $onFalse);
        },
        toNdElement() {
            return Switch($condition, $onTrue, $onFalse);
        }
    }
}