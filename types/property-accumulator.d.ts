import {ObservableItem} from "./observable";

type CssPropertyValueType = string | ObservableItem | number;
type ClassPropertyValueType = boolean | ObservableItem;

export interface CssPropertyAccumulator {
    add(key: string, value: CssPropertyValueType): void;
    value(): string | Record<string, CssPropertyValueType>;
}

export interface ClassPropertyAccumulator {
    add(key: string, value?: ClassPropertyValueType): void;
    value(): string | Record<string, ClassPropertyValueType>;
}


type CssInitialValue = string | Record<string, CssPropertyValueType> | string[];
type ClassInitialValue = string | Record<string, ClassPropertyValueType> | string[];

export declare const cssPropertyAccumulator: (initialValue?: CssInitialValue) => CssPropertyAccumulator;


export declare const classPropertyAccumulator: (initialValue?: ClassInitialValue) => ClassPropertyValueType;

// Export des types pour usage externe
export type {
    cssPropertyAccumulator as CssPropertyAccumulatorType,
    classPropertyAccumulator as ClassPropertyAccumulatorType,
    CssPropertyValueType,
    ClassPropertyValueType,
    CssInitialValue,
    ClassInitialValue
};