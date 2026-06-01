import type { ObservableItem } from '../../../types/observable';

export interface I18nResources {
    [language: string]: {
        translation: Record<string, string>;
    };
}

export interface I18nServiceInstance {
    init(resources: I18nResources): Promise<void>;
    current: ObservableItem<string>;
    use(lng: string): Promise<void>;
    tr(key: string, ...args: unknown[]): string;
}

export declare const I18nService: I18nServiceInstance;

export declare function tr(
    key: string,
    params?: Record<string, ObservableItem<unknown> | unknown>
): ObservableItem<string>;

declare global {
    interface String {
        tr(params?: Record<string, ObservableItem<unknown> | unknown>): ObservableItem<string>;
    }
}
