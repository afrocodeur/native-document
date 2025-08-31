import {NDElement} from "./elements";
import {ObservableItem} from "./observable";
import { Map} from "./polyfill";

type FrameworkEvents = {
    // Observable Events
    'CreateObservable': (observable: ObservableItem) => void;
    'ObservableBeforeChange': (observable: ObservableItem) => void;
    'ObservableAfterChange': (observable: ObservableItem) => void;
    'ObservableSubscribe': (observable: ObservableItem, target?: any) => void;
    'ObservableUnsubscribe': (observable: ObservableItem) => void;
    'CreateObservableArray': (observer: ObservableItem) => void;
    'CreateObservableComputed': (observable: ObservableItem, dependencies: ObservableItem[]) => void;

    // Element Events
    'NDElementCreated': (element: HTMLElement, ndElement: NDElement) => void;
    'Setup': (element: HTMLElement, attributes?: any, customWrapper?: Function) => void;
    'BeforeProcessChildren': (parent: HTMLElement | DocumentFragment) => void;
    'AfterProcessChildren': (parent: HTMLElement | DocumentFragment) => void;
    'BeforeProcessComponent': (component: Function) => void;
};

type EventMethodName = `on${Capitalize<keyof FrameworkEvents>}`;

interface Plugin {
    $name?: string;

    init?(): void;
    cleanup?(): void;

    // NativeDocument Framework Events
    onCreateObservable?: (observable: ObservableItem) => void;
    onObservableBeforeChange?: (observable: ObservableItem) => void;
    onObservableAfterChange?: (observable: ObservableItem) => void;
    onObservableSubscribe?: (observable: ObservableItem, target?: any) => void;
    onObservableUnsubscribe?: (observable: ObservableItem) => void;
    onCreateObservableArray?: (observer: ObservableItem) => void;
    onCreateObservableComputed?: (observable: ObservableItem, dependencies: ObservableItem[]) => void;
    onNDElementCreated?: (element: HTMLElement, ndElement: NDElement) => void;
    onSetup?: (element: HTMLElement, attributes?: any, customWrapper?: Function) => void;
    onBeforeProcessChildren?: (parent: HTMLElement | DocumentFragment) => void;
    onAfterProcessChildren?: (parent: HTMLElement | DocumentFragment) => void;
    onBeforeProcessComponent?: (component: Function) => void;

    // Other possible events
    [key: string]: any;
}

interface IPluginsManager {
    list(): Map<string, Plugin>;

    add(name: string, plugin: Plugin): void;

    remove(pluginName: string): void;

    emit(event: string, ...data: any[]): void;
}

declare const PluginsManager: IPluginsManager;

export type TypedPlugin<T extends Record<string, (...args: any[]) => void> = {}> = Plugin & {
    [K in keyof T as K extends string ? `on${Capitalize<K>}` : never]: T[K];
};

export default PluginsManager;