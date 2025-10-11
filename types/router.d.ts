// Router system type definitions
import { ValidChild } from './elements';
import { NDElement } from './nd-element';

export interface RouteParams {
    [key: string]: string;
}

export interface QueryParams {
    [key: string]: string;
}

export interface RouteContext {
    params: RouteParams;
    query: QueryParams;
}

export interface Route {
    name(): string | null;
    component(): (context: RouteContext) => HTMLElement | DocumentFragment;
    middlewares(): Function[];
    shouldRebuild(): boolean;
    path(): string;
    match(path: string): RouteParams | false;
    url(configs: { params?: RouteParams; query?: QueryParams; basePath?: string }): string;
}

export interface RouterState {
    route: Route | null;
    params: RouteParams | null;
    query: QueryParams | null;
    path: string | null;
}

export interface Router {
    routes(): Route[];
    currentState(): RouterState;

    add(path: string, component: (context: RouteContext) => HTMLElement | DocumentFragment, options?: {
        name?: string;
        middlewares?: Function[];
        shouldRebuild?: boolean;
        with?: Record<string, string>;
    }): this;

    group(suffix: string, options: { middlewares?: Function[]; name?: string, layout?: Function }, callback: () => void): this;

    generateUrl(name: string, params?: RouteParams, query?: QueryParams): string;
    resolve(target: string | { name: string; params?: RouteParams; query?: QueryParams }): {
        route: Route;
        params: RouteParams;
        query: QueryParams;
        path: string;
    };

    subscribe(listener: (state: RouterState) => void): () => void;

    push(target: string | { name: string; params?: RouteParams; query?: QueryParams }): void;
    replace(target: string | { name: string; params?: RouteParams; query?: QueryParams }): void;
    forward(): void;
    back(): void;

    init(defaultPath?: string): void;
    mount(container: string | HTMLElement): HTMLElement;
}

export interface RouterStatic {
    create(options: { mode: 'memory' | 'history' | 'hash'; name?: string; entry?: string }, callback: (router: Router) => void): Router;
    get(name?: string): Router;
    push(target: string | { name: string; params?: RouteParams; query?: QueryParams }, name?: string): void;
    replace(target: string | { name: string; params?: RouteParams; query?: QueryParams }, name?: string): void;
    forward(name?: string): void;
    back(name?: string): void;
}

// Link component for router
export declare const Link: (options: {
    to?: string | { name: string; params?: RouteParams; query?: QueryParams; router?: string };
    href?: string;
    [key: string]: any;
}, children: ValidChild) => HTMLAnchorElement & { nd: NDElement };