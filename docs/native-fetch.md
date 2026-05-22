---
title: NativeFetch
description: HTTP client built on the native Fetch API with request and response interceptors
---

# NativeFetch

NativeFetch is an HTTP client built on top of the native Fetch API. It adds interceptors, a base URL, and automatic JSON handling.

```javascript
import { utils } from 'native-document';
const { NativeFetch } = utils;

// Or
import { NativeFetch } from 'native-document/utils';
```

---

## Creating an Instance

```javascript
const api = new NativeFetch('https://api.example.com');
```

---

## HTTP Methods

```javascript
// GET
const users = await api.get('/users');
const user  = await api.get('/users/123');

// GET with query parameters
const page = await api.get('/users', { page: 1, limit: 20, sort: 'name' });
// -> GET /users?page=1&limit=20&sort=name

// POST
const newUser = await api.post('/users', { name: 'Alice', email: 'alice@example.com' });

// PUT
const updated = await api.put('/users/123', { name: 'Alice Updated' });

// PATCH
const patched = await api.patch('/users/123', { status: 'active' });

// DELETE
await api.delete('/users/123');
```

---

## Interceptors

### Request interceptors

Run before the request is sent:

```javascript
// Add authentication
api.interceptors.request(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Add custom headers
api.interceptors.request(config => {
    config.headers['X-App-Version'] = '1.0.0';
    return config;
});
```

### Response interceptors

Run after the response is received:

```javascript
// Handle 401
api.interceptors.response(response => {
    if (response.status === 401) {
        Store.get('auth').set({ user: null, token: null, isLoggedIn: false });
        window.location.href = '/login';
    }
    return response;
});

// Unwrap data envelope
api.interceptors.response(response => {
    if (response.data?.result) {
        return { ...response, data: response.data.result };
    }
    return response;
});
```

Multiple interceptors run in the order they were registered.

---

## Practical Example - API Service Layer

Combine with `Cache` for a clean service pattern:

```javascript
import { Cache, NativeFetch } from 'native-document/utils';
import { Store } from 'native-document';

// Singleton API client
const getAPI = Cache.singleton(() => {
    const client = new NativeFetch('https://api.example.com');

    client.interceptors.request(config => {
        const token = Store.get('auth').$value?.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    });

    client.interceptors.response(response => {
        if (response.status === 401) {
            Store.reset('auth');
            Router.push({ name: 'login' });
        }
        return response;
    });

    return client;
});

// Resource endpoints via memoize
const API = Cache.memoize(resource => {
    const client = getAPI();
    return {
        list: (params = {}) => client.get(`/${resource}`, params),
        get: (id) => client.get(`/${resource}/${id}`),
        create: (data) => client.post(`/${resource}`, data),
        update: (id, data) => client.put(`/${resource}/${id}`, data),
        delete: (id) => client.delete(`/${resource}/${id}`)
    };
});

// Usage
const users = await API.users.list({ page: 1 });
const user = await API.users.get('123');
const newUser = await API.users.create({ name: 'Alice' });
await API.users.delete('123');
```

---

## Loading State with Observables

```javascript
const isLoading = Observable(false);
const requestCount = Observable(0);

api.interceptors.request(config => {
    requestCount.set(requestCount.val() + 1);
    isLoading.set(true);
    return config;
});

api.interceptors.response(response => {
    const count = requestCount.val() - 1;
    requestCount.set(count);
    if (count === 0) {
        isLoading.set(false);
    }
    return response;
});

ShowIf(isLoading.isTruthy(), Div({ class: 'spinner' }, 'Loading...'))
```

---

## Response Format

NativeFetch returns a consistent response object:

```javascript
{
    ok:         boolean,  // true if status 200-299
    status:     number,   // HTTP status code
    statusText: string,   // status message
    headers:    Headers,  // response headers
    data:       any,      // parsed JSON body
    url:        string    // request URL
}
```

---

## Best Practices

1. Create a single instance via `Cache.singleton()` - not a new instance per request
2. Use `Cache.memoize()` for resource-based endpoint collections
3. Handle authentication and errors in interceptors - not in each call
4. Use `Promise.all()` for parallel requests instead of sequential awaits

---

## Next Steps

- **[Cache](./cache.md)** - Lazy initialization and singleton patterns
- **[Filters](./filters.md)** - Data filtering helpers
- **[State Management](./state-management.md)** - Global state with Store
- **[Observable Resource](./observable-resource.md)** - Async data with built-in states