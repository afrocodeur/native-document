import { Observable } from "../../data/Observable";
import Validator from "../../utils/validator";
import DebugManager from "../../utils/debug-manager.js";
import Anchor from "../anchor";
import {ElementCreator} from "../../wrappers/ElementCreator";

/**
 * Show the element if the condition is true
 *
 * @param {ObservableItem|ObservableChecker} condition
 * @param {*} child
 * @param {{comment?: string|null, shouldKeepInCache?: Boolean}} configs
 * @returns {DocumentFragment}
 */
export const ShowIf = function(condition, child, { comment = null, shouldKeepInCache = true} = {}) {
    if(!(Validator.isObservable(condition)) && !Validator.isObservableWhenResult(condition)) {
        return DebugManager.warn('ShowIf', "ShowIf : condition must be an Observable / "+comment, condition);
    }
    const element = Anchor('Show if : '+(comment || ''));

    let childElement = null;
    const getChildElement = () => {
        if(childElement && shouldKeepInCache) {
            return childElement;
        }
        childElement = ElementCreator.getChild(child);
        if(Validator.isFragment(childElement)) {
            childElement = Array.from(childElement.childNodes);
        }
        return childElement;
    };

    const currentValue = condition.val();

    if(currentValue) {
        element.appendChild(getChildElement());
    }
    condition.subscribe(value => {
        if(value) {
            element.appendChild(getChildElement());
        } else {
            element.remove();
        }
    });

    return element;
}

/**
 * Hide the element if the condition is true
 * @param {ObservableItem|ObservableChecker} condition
 * @param child
 * @param {{comment?: string|null, shouldKeepInCache?: Boolean}} configs
 * @returns {DocumentFragment}
 */
export const HideIf = function(condition, child, configs) {
    const hideCondition = Observable(!condition.val());
    condition.subscribe(value => hideCondition.set(!value));

    return ShowIf(hideCondition, child, configs);
}

/**
 * Hide the element if the condition is false
 *
 * @param {ObservableItem|ObservableChecker} condition
 * @param {*} child
 * @param {{comment?: string|null, shouldKeepInCache?: Boolean}} configs
 * @returns {DocumentFragment}
 */
export const HideIfNot = function(condition, child, configs) {
    return ShowIf(condition, child, configs);
}