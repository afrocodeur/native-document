export default function NativeFetch($baseUrl) {

    const $interceptors = {
        request: [],
        response: []
    };

    this.interceptors = {
        response: (callback) => {
            $interceptors.response.push(callback);
        },
        request: (callback) => {
            $interceptors.request.push(callback);
        }
    };

    this.fetch = async function(method, endpoint, params = {}, options = {}) {
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
                ...(options.headers || {})
            },
        };
        if(params) {
            if(params instanceof FormData) {
                configs.body = params;
            }
            else {
                configs.headers['Content-Type'] = 'application/json';
                if(method !== 'GET') {
                    configs.body = JSON.stringify(params);
                } else {
                    configs.params = params;
                }
            }
        }

        for(const interceptor of $interceptors.request) {
            configs = (await interceptor(configs, endpoint)) || configs;
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