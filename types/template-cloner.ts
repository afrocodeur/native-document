
interface BindingData {
    attributes?: Record<string, (...data: any[]) => any>;
    classes?: Record<string, (...data: any[]) => any>;
    styles?: Record<string, (...data: any[]) => any>;
    value?: (...data: any[]) => any;
    events?: Record<string, (this: Element, event: Event, ...data: any[]) => void>;
}

interface ProcessedAttributes {
    class?: Record<string, any>;
    style?: Record<string, any>;
    [key: string]: any;
}

export interface BindingHydrator {
    $hydrate: (element: Element | Text, property?: string) => void;
}

export type TemplateBuilder = (templateCloner: TemplateCloner) => Node;

type CachedTemplateFunction = (...args: any[]) => Node;

export declare class TemplateCloner {
    constructor($fn: TemplateBuilder);

    clone(data: any[]): Node;

    style(fn: (...data: any[]) => any): BindingHydrator;
    class(fn: (...data: any[]) => any): BindingHydrator;
    value(fn: (...data: any[]) => any): BindingHydrator;
    attr(fn: (...data: any[]) => any): BindingHydrator;
    event(fn: (event: Event, ...data: any[]) => void): BindingHydrator;
}

export declare function useCache(fn: TemplateBuilder): CachedTemplateFunction;