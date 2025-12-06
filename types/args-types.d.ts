import {ObservableItem} from "./observable";
import {ValidChildren} from "./validator";

type ValidateFunction<T = any> = (value: any) => value is T;

interface ArgType<T = any> {
    name: string;
    type: string;
    validate: ValidateFunction<T>;
    optional?: boolean;
}

export interface OneOfArgType extends Omit<ArgType, 'validate'> {
    type: 'oneOf';
    types: ArgType[];
    validate: (value: any) => boolean;
}

type AnyArgType = ArgType | OneOfArgType;

type Element = HTMLElement | DocumentFragment | Text;

export interface OptionalArgType<T = any> extends ArgType<T> {
    optional: true;
}

export declare const ArgTypes: {
    string: (name: string) => ArgType<string>;
    number: (name: string) => ArgType<number>;
    boolean: (name: string) => ArgType<boolean>;
    observable: (name: string) => ArgType<ObservableItem>;
    element: (name: string) => ArgType<Element>;
    function: (name: string) => ArgType<Function>;
    object: (name: string) => ArgType<object>;
    objectNotNull: (name: string) => ArgType<NonNullable<object>>;
    children: (name: string) => ArgType<ValidChildren>;
    attributes: (name: string) => ArgType<any>;

    optional: <T extends AnyArgType>(argType: T) => T & { optional: true };

    oneOf: (name: string, ...argTypes: ArgType[]) => OneOfArgType;
};

type ArgSchema = AnyArgType[];

export declare function withValidation<T extends (...args: any[]) => any>(
    fn: T,
    argSchema: ArgSchema,
    fnName?: string
): T;

export declare function normalizeComponentArgs(
    props: any,
    children: any
): {
    props: any;
    children: any;
};