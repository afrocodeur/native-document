import {ObservableChecker, ObservableItem, ObservableProxy} from "./observable";
import { NDElement, ValidChild } from "./elements";

export type ValidChildren = ValidChild | ValidChild[];

/**
 * Validator utility class with type guards
 */
declare const Validator: {
    isObservable(value: any): value is ObservableItem;

    isProxy(value: any): value is ObservableProxy<any>;

    isObservableChecker(value: any): value is ObservableChecker;

    isArray(value: any): value is Array<any>;

    isString(value: any): value is string;

    isNumber(value: any): value is number;

    isBoolean(value: any): value is boolean;

    isFunction(value: any): value is Function;

    isAsyncFunction(value: any): value is (...args: any[]) => Promise<any>;

    isObject(value: any): value is object;

    isJson(value: any): value is Record<string, any>;

    isElement(value: any): value is HTMLElement | DocumentFragment | Text;

    isFragment(value: any): value is DocumentFragment;

    isStringOrObservable(value: any): value is string | ObservableItem<string>;

    isValidChild(child: any): child is ValidChild;

    isNDElement(child: any): child is NDElement;

    isValidChildren(children: any): children is ValidChildren;

    validateChildren(children: any): ValidChildren;

    containsObservables(data: any): boolean;

    containsObservableReference(data: any): data is string;

    validateAttributes(attributes: any): Record<string, any> | null | undefined;

    validateEventCallback(callback: any): asserts callback is Function;
};

export { Validator };