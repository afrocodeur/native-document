export default function NativeFetch($baseUrl) {

    const $interceptors = {
        request: [],
        response: [],
    };

    this.interceptors = {
        response: (callback) => {
            $interceptors.response.push(callback);
        },
        request: (callback) => {
            $interceptors.request.push(callback);
        },
    };

    this.fetch = async function(method, endpoint, params = {}, options = {}) {
        endpoint = endpoint || '';
        if(options.formData) {
            const formData = new FormData();
            for(const key in params) {
                formData.append(key, params[key]);
            }
            params = formData;
        }
        if(!endpoint.startsWith('http')) {
            endpoint = ($baseUrl.endsWith('/') ? $baseUrl : $baseUrl+'/') + endpoint;
        }
        let configs = {
            method,
            headers: {
                ...(options.headers || {}),
            },
        };
        let parseToString = false;
        if(params) {
            if(params instanceof FormData) {
                configs.body = params;
            }
            else {
                if(method !== 'GET') {
                    configs.headers['Content-Type'] = 'application/json';
                    configs.body = params;
                    parseToString = true;
                } else {
                    const queryString = new URLSearchParams(params).toString();
                    if (queryString) {
                        endpoint = endpoint + (endpoint.includes('?') ? '&' : '?') + queryString;
                    }
                }
            }
        }

        for(const interceptor of $interceptors.request) {
            configs = (await interceptor(configs, endpoint)) || configs;
        }
        if(parseToString) {
            configs.body = JSON.stringify(configs.body);
        }

        let response = await fetch(endpoint, configs);

        for(const interceptor of $interceptors.response) {
            response = (await interceptor(response, endpoint)) || response;
        }

        const contentType = response.headers.get('content-type') || '';
        const data = contentType.includes('application/json')
            ? await response.json()
            : await response.text();

        if(!response.ok) {
            const error = new Error(data?.message || response.statusText);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    };


    this.post = function (endpoint, params = {}, options = {}) {
        return this.fetch('POST', endpoint, params, options);
    };
    this.put = function (endpoint, params = {}, options = {}) {
        return this.fetch('PUT', endpoint, params, options);
    };
    this.delete = function (endpoint, params = {}, options = {}) {
        return this.fetch('DELETE', endpoint, params, options);
    };
    this.get = function (endpoint, params = {}, options = {}) {
        return this.fetch('GET', endpoint, params, options);
    };
};

export const resolveData = (data) => {
    if(data?.__$Observable) {
        return data.resolve();
    }
    for(const key in data) {
        const value = data[key];
        if(value == null) {
            continue;
        }
        if(value.__$Observable) {
            data[key] = value.resolve();
            continue;
        }
        if(typeof value === 'object') {
            data[key] = resolveData(data[key]);
        }
    }
    return data;
};

export const resolveObservableInterceptor = (configs) => {
    if(configs.body && !(configs.body instanceof FormData)) {
        configs.body = resolveData(configs.body);
    }
    return configs;
};