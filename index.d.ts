// Main NativeDocument type definitions index
export * from './types/observable';
export * from './types/elements';
export * from './types/forms';
export * from './types/images';
export * from './types/control-flow';
export * from './types/router';
export * from './types/store';

// Main static exports
import { ObservableStatic } from './types/observable';
import { RouterStatic } from './types/router';
import { StoreStatic } from './types/store';

export declare const Observable: ObservableStatic;
export declare const Store: StoreStatic;
export declare const Router: RouterStatic;