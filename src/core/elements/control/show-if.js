import { Observable } from '../../data/Observable';
import Validator from '../../utils/validator';
import DebugManager from '../../utils/debug-manager.js';
import Anchor from '../anchor/anchor';
import {ElementCreator} from '../../wrappers/ElementCreator';

/**
 * Conditionally shows an element based on an observable condition.
 * The element is mounted/unmounted from the DOM as the condition changes.
 *
 * @param {ObservableItem<boolean>|ObservableChecker<boolean>|ObservableWhen} condition - Observable condition to watch
 * @param {NdChild|(() => NdChild)} child - Element or content to show/hide
 * @param {Object} [options={}] - Configuration options
 * @param {string|null} [options.comment=null] - Comment for debugging
 * @param {boolean} [options.shouldKeepInCache=true] - Whether to cache the element when hidden
 * @returns {AnchorDocumentFragment} Anchor fragment managing the conditional content
 * @example
 * const isVisible = Observable(false);
 * ShowIf(isVisible, Div({}, 'Hello World'));
 */
export const ShowIf = function(condition, child, { comment = null, shouldKeepInCache = true} = {}) {
    if(!Validator.isObservable(condition)) {
        if(typeof condition === 'boolean') {
            return condition ? ElementCreator.getChild(child) : null;
        }

        return DebugManager.warn('ShowIf', 'ShowIf : condition must be an Observable or boolean / '+comment, condition);
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

    condition.subscribe((value) => {
        if(value) {
            element.appendChild(getChildElement());
            return;
        }
        element.remove();
    });

    return element;
};

/**
 * Conditionally hides an element when the observable condition is true.
 * Inverse of ShowIf - element is shown when condition is false.
 *
 * @param {ObservableItem<boolean>|ObservableChecker<boolean>} condition - Observable condition to watch
 * @param {NdChild|(() => NdChild)} child - Element or content to show/hide
 * @param {Object} [configs] - Configuration options
 * @param {string|null} [configs.comment] - Comment for debugging
 * @param {boolean} [configs.shouldKeepInCache] - Whether to cache element when hidden
 * @returns {AnchorDocumentFragment} Anchor fragment managing the conditional content
 * @example
 * const hasError = Observable(false);
 * HideIf(hasError, Div({}, 'Content'));
 */
export const HideIf = function(condition, child, configs) {
    const hideCondition = Observable(!condition.val());
    condition.subscribe(value => hideCondition.set(!value));

    return ShowIf(hideCondition, child, configs);
};

/**
 * Conditionally hides an element when the observable condition is false.
 * Same as ShowIf - element is shown when condition is true.
 *
 * @param {ObservableItem<boolean>|ObservableChecker<boolean>|ObservableWhen} condition - Observable condition to watch
 * @param {NdChild|(() => NdChild)} child - Element or content to show/hide
 * @param {Object} [configs] - Configuration options
 * @param {string|null} [configs.comment] - Comment for debugging
 * @param {boolean} [configs.shouldKeepInCache] - Whether to cache element when hidden
 * @returns {AnchorDocumentFragment} Anchor fragment managing the conditional content
 */
export const HideIfNot = function(condition, child, configs) {
    return ShowIf(condition, child, configs);
};