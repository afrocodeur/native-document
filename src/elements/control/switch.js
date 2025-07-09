import NativeDocumentError from "../../errors/NativeDocumentError";
import {createTextNode} from "../../wrappers/HtmlElementWrapper";
import Validator from "../../utils/validator";

/**
 *
 * @param {ObservableItem|ObservableChecker} condition
 * @param {*} onTrue
 * @param {*} onFalse
 * @returns {DocumentFragment}
 */
export const Switch = function (condition, onTrue, onFalse) {

    if(!Validator.isObservable(condition)) {
        throw new NativeDocumentError("Toggle : condition must be an Observable");
    }

    const commentStart = document.createComment('Toggle Start');
    const commentEnd = document.createComment('Toggle End');

    const element = document.createDocumentFragment();
    element.appendChild(commentStart);
    element.appendChild(commentEnd);

    const elements = {
        onTrueNode: (Validator.isFunction(onTrue)) ? null : onTrue,
        onFalseNode: (Validator.isFunction(onFalse)) ? null : onFalse,
    };

    if(Validator.isStringOrObservable(elements.onTrueNode)) {
        elements.onTrueNode = createTextNode(elements.onTrueNode);
    }
    if(Validator.isStringOrObservable(elements.onFalseNode)) {
        elements.onFalseNode = createTextNode(elements.onFalseNode);
    }

    const handle = (value) => {
        const parent = commentEnd.parentNode;
        if(!parent) {
            return;
        }
        if(value) {
            if(!elements.onTrueNode && Validator.isFunction(onTrue)) {
                elements.onTrueNode = onTrue();
            }
            elements.onFalseNode && elements.onFalseNode.remove();
            parent.insertBefore(elements.onTrueNode, commentEnd);
        } else {
            if(!elements.onFalseNode && Validator.isFunction(onFalse)) {
                elements.onFalseNode = onFalse();
            }
            elements.onTrueNode && elements.onTrueNode.remove();
            parent.insertBefore(elements.onFalseNode, commentEnd);
        }
    };

    condition.subscribe(handle);
    handle(condition.val());

    return element;
}

/**
 *
 * @param condition
 * @returns {{show: Function, otherwise: (((*) => {}):DocumentFragment)}
 */
export const When = function(condition) {
    let $onTrue = null;
    let $onFalse = null;

    return {
        show(onTrue) {
            if(!Validator.isElement(onTrue) && !Validator.isFunction(onTrue)) {
                throw new NativeDocumentError("When : onTrue must be a valid Element");
            }
            $onTrue = onTrue;
            return this;
        },
        otherwise(onFalse) {
            if(!Validator.isElement(onFalse) && !Validator.isFunction(onFalse)) {
                throw new NativeDocumentError("When : onFalse must be a valid Element");
            }
            $onFalse = onFalse;
            return Switch(condition, $onTrue, $onFalse);
        }
    }
}