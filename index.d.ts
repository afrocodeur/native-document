// Main NativeDocument type definitions index
export * from './types/router';
export * from './types/store';
export * from './types/plugins-manager';
export * from './types/property-accumulator';
export * from './types/validator';
export * from './types/args-types';
export * from './types/template-cloner';

// Main static exports
import { ObservableStatic } from './types/observable';
import { RouterStatic } from './types/router';
import { StoreStatic } from './types/store';

export declare const Observable: ObservableStatic;
export declare const Store: StoreStatic;
export declare const Router: RouterStatic;