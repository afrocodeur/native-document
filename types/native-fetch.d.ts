type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchConfig {
    method: HttpMethod;
    headers: Record<string, string>;
    body?: string | FormData;
    params?: Record<string, any>;
}

interface FetchOptions {
    headers?: Record<string, string>;
    formData?: boolean;
}

type RequestInterceptor = (
    config: FetchConfig,
    endpoint: string
) => Promise<FetchConfig | void> | FetchConfig | void;

type ResponseInterceptor = (
    response: Response,
    endpoint: string
) => Promise<Response | void> | Response | void;

interface NativeFetchError extends Error {
    status: number;
    data: any;
}

interface Interceptors {
    request: (callback: RequestInterceptor) => void;
    response: (callback: ResponseInterceptor) => void;
}

declare class NativeFetch {
    constructor(baseUrl: string);

    interceptors: Interceptors;

    fetch<T = any>(
        method: HttpMethod,
        endpoint: string,
        params?: Record<string, any> | FormData,
        options?: FetchOptions
    ): Promise<T>;

    get<T = any>(
        endpoint: string,
        params?: Record<string, any>,
        options?: FetchOptions
    ): Promise<T>;

    post<T = any>(
        endpoint: string,
        params?: Record<string, any> | FormData,
        options?: FetchOptions
    ): Promise<T>;

    put<T = any>(
        endpoint: string,
        params?: Record<string, any> | FormData,
        options?: FetchOptions
    ): Promise<T>;

    delete<T = any>(
        endpoint: string,
        params?: Record<string, any>,
        options?: FetchOptions
    ): Promise<T>;
}

export default NativeFetch;