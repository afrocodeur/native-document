import Validator from '../../utils/validator.js';
import NativeDocumentError from '../../errors/NativeDocumentError.js';
import {ShowIf} from './show-if.js';

/**
 * Shows content when an observable equals a specific value.
 * Can be called with 2 or 3 arguments.
 *
 * @overload
 * @param {ObservableWhen} observerWhenResult - Result from observable.when(value)
 * @param {NdChild|(() => NdChild)} view - Content to show when condition matches
 * @returns {AnchorDocumentFragment}
 *
 * @overload
 * @param {ObservableItem} observer - Observable to watch
 * @param {*} target - Value to match
 * @param {NdChild|(() => NdChild)} view - Content to show when observable equals target
 * @returns {AnchorDocumentFragment}
 *
 * @example
 * // 2 arguments
 * const status = Observable('idle');
 * ShowWhen(status.when('loading'), LoadingSpinner());
 *
 * // 3 arguments
 * ShowWhen(status, 'loading', LoadingSpinner());
 */
export const ShowWhen = function() {
    if(arguments.length === 2) {
        const [observer, target] = arguments;
        if(!Validator.isObservableWhenResult(observer)) {
            throw new NativeDocumentError('showWhen observer must be an ObservableWhenResult', {
                data: observer,
                'help': 'Use observer.when(target) to create an ObservableWhenResult',
            });
        }
        return ShowIf(observer, target);
    }
    if(arguments.length === 3) {
        const [observer, target, view] = arguments;
        if(!Validator.isObservable(observer)) {
            throw new NativeDocumentError('showWhen observer must be an Observable', {
                data: observer,
            });
        }
        return ShowIf(observer.when(target), view);
    }
    throw new NativeDocumentError('showWhen must have 2 or 3 arguments', {
        data: [
            'showWhen(observer, target, view)',
            'showWhen(observerWhenResult, view)',
        ],
    });
};