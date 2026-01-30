import Validator from "../../utils/validator.js";
import NativeDocumentError from "../../errors/NativeDocumentError.js";
import {ShowIf} from "./show-if.js";

export const ShowWhen = function() {
    if(arguments.length === 2) {
        const [observer, target] = arguments;
        if(!Validator.isObservableWhenResult(observer)) {
            throw new NativeDocumentError('showWhen observer must be an ObservableWhenResult', {
                data: observer,
                'help': 'Use observer.when(target) to create an ObservableWhenResult'
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
        ]
    });
};