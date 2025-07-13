import { Observable } from "../../data/Observable";
import {createTextNode} from "../../wrappers/HtmlElementWrapper";
import Validator from "../../utils/validator";
import DebugManager from "../../utils/debug-manager.js";

/**
 * Show the element if the condition is true
 *
 * @param {ObservableItem|ObservableChecker} condition
 * @param {*} child
 * @param {string|null} comment
 * @returns {DocumentFragment}
 */
export const ShowIf = function(condition, child, comment = null) {
    if(!(Validator.isObservable(condition))) {
        return DebugManager.warn('ShowIf', "ShowIf : condition must be an Observable / "+comment, condition);
    }
    const element = document.createDocumentFragment();
    const positionKeeperStart = document.createComment('Show if : '+(comment || ''));
    const positionKeeperEnd = document.createComment('Show if : '+(comment || ''));

    element.appendChild(positionKeeperStart);
    element.appendChild(positionKeeperEnd);

    let childElement = null;
    const getChildElement = () => {
        if(childElement) {
            return childElement;
        }
        if(typeof child === 'function') {
            childElement = child();
        }
        else {
            childElement = child;
        }
        if(Validator.isStringOrObservable(childElement)) {
            childElement = createTextNode(childElement);
        }
        return childElement;
    };

    const currentValue = condition.val();

    if(currentValue) {
        element.appendChild(getChildElement());
    }
    condition.subscribe(value => {
        const parent = positionKeeperEnd.parentNode;
        if(value && parent) {
            parent.insertBefore(getChildElement(), positionKeeperEnd);
        } else {
            if(Validator.isElement(childElement)){
                childElement.remove();
            }
        }
    });

    return element;
}

/**
 * Hide the element if the condition is true
 * @param {ObservableItem|ObservableChecker} condition
 * @param child
 * @param comment
 * @returns {DocumentFragment}
 */
export const HideIf = function(condition, child, comment) {

    const hideCondition = Observable(!condition.val());
    condition.subscribe(value => hideCondition.set(!value));

    return ShowIf(hideCondition, child, comment);
}

/**
 * Hide the element if the condition is false
 *
 * @param {ObservableItem|ObservableChecker} condition
 * @param {*} child
 * @param {string|null} comment
 * @returns {DocumentFragment}
 */
export const HideIfNot = function(condition, child, comment) {
    return ShowIf(condition, child, comment);
}