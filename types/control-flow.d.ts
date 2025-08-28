// Control flow components type definitions
import { ObservableItem, ObservableChecker, ObservableArray } from './observable';
import { ValidChild } from './elements';

// Control Flow Functions
export interface ShowIfFunction {
    (condition: ObservableItem<boolean> | ObservableChecker<boolean>, child: ValidChild, comment?: string): DocumentFragment;
}

export interface HideIfFunction {
    (condition: ObservableItem<boolean> | ObservableChecker<boolean>, child: ValidChild, comment?: string): DocumentFragment;
}

export interface MatchFunction {
    <T extends string | number>(condition: ObservableItem<T> | ObservableChecker<T>, values: Record<T, ValidChild>, shouldKeepInCache?: boolean): DocumentFragment;
}

export interface SwitchFunction {
    (condition: ObservableItem<boolean> | ObservableChecker<boolean>, onTrue: ValidChild, onFalse: ValidChild): DocumentFragment;
}

export interface WhenFunction {
    (condition: ObservableItem<boolean> | ObservableChecker<boolean>): {
        show(onTrue: ValidChild): {
            otherwise(onFalse: ValidChild): DocumentFragment;
        };
    };
}

export interface ForEachFunction {
    <T>(data: T[] | Record<string, T> | ObservableItem<T[]> | ObservableItem<Record<string, T>>,
        callback: (item: T, index?: ObservableItem<number>) => ValidChild,
        key?: string | ((item: T, defaultKey: string | number) => string)): DocumentFragment;
}

export interface ForEachArrayFunction {
    <T>(data: ObservableArray<T>,
        callback: (item: T, index?: ObservableItem<number>) => ValidChild,
        key?: string | ((item: T, defaultKey: number) => string),
        configs?: { pushDelay?: (items: T[]) => number }): DocumentFragment;
}

// Control Flow Components
export declare const ShowIf: ShowIfFunction;
export declare const HideIf: HideIfFunction;
export declare const HideIfNot: ShowIfFunction;
export declare const Match: MatchFunction;
export declare const Switch: SwitchFunction;
export declare const When: WhenFunction;
export declare const ForEach: ForEachFunction;
export declare const ForEachArray: ForEachArrayFunction;