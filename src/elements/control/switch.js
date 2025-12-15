import NativeDocumentError from "../../errors/NativeDocumentError";
import Validator from "../../utils/validator";
import Anchor from "../anchor";
import {ElementCreator} from "../../wrappers/ElementCreator";



/**
 *
 * @param {ObservableItem|ObservableChecker} $condition
 * @param {{[key]: *}} values
 * @param {Boolean} shouldKeepInCache
 * @returns {DocumentFragment}
 */
export const Match = function($condition, values, shouldKeepInCache = true) {

    if(!Validator.isObservable($condition)) {
        throw new NativeDocumentError("Toggle : condition must be an Observable");
    }

    const anchor = new Anchor('Match');
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
 *
 * @param {ObservableItem|ObservableChecker} $condition
 * @param {*} onTrue
 * @param {*} onFalse
 * @returns {DocumentFragment}
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
 *
 * @param {ObservableItem|ObservableChecker} $condition
 * @returns {{show: Function, otherwise: (((*) => {}):DocumentFragment)}
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
        }
    }
}