---
title: Cache
description: Lazy initialization, singleton patterns, and key-based memoization utilities
---

# Cache

NativeDocument provides three caching utilities for optimizing function execution: lazy initialization, eager singletons, and key-based memoization.

```javascript
import { utils } from 'native-document';
const { Cache } = utils;

// Or
import { Cache } from 'native-document/utils';
```

---

## `Cache.once(fn)` - Lazy Initialization

The function is **not executed immediately**. It runs only when you access a property on the returned Proxy object. The result is cached after the first access.

```javascript
const Config = Cache.once(() => {
    console.log('Loading config...');
    return {
        apiUrl:     'https://api.example.com',
        timeout:    5000,
        maxRetries: 3
    };
});

// Function not executed yet
Config.apiUrl; // "Loading config..." -> "https://api.example.com"
Config.timeout; // no log -> 5000 (cached)
```

Use for optional features or heavy modules that may not always be needed:

```javascript
const API = Cache.once(() => {
    const client = new NativeFetch('https://api.example.com');
    client.interceptors.request(config => {
        config.headers['Authorization'] = `Bearer ${getToken()}`;
        return config;
    });
    return {
        users: {
            list: ()   => client.get('/users'),
            get:  (id) => client.get(`/users/${id}`)
        }
    };
});

// Client created only on first use
const users = await API.users.list();
```

---

## `Cache.singleton(fn)` - Eager Singleton

The function executes on the **first call** and caches the result. All subsequent calls return the same instance.

```javascript
const getLogger = Cache.singleton(() => {
    console.log('Creating logger...');
    return {
        log:   msg => console.log(`[LOG] ${msg}`),
        error: msg => console.error(`[ERROR] ${msg}`)
    };
});

const logger  = getLogger(); // "Creating logger..."
const logger2 = getLogger(); // no log
console.log(logger === logger2); // true
```

Use for core services that must exist exactly once:

```javascript
const getConfig = Cache.singleton(() => ({
    apiUrl:  import.meta.env.VITE_API_URL,
    debug:   import.meta.env.DEV,
    version: '1.0.0'
}));

const getAPI = Cache.singleton(() => {
    const config = getConfig();
    const client = new NativeFetch(config.apiUrl);
    client.interceptors.request(req => {
        const token = localStorage.getItem('token');
        if (token) {
            req.headers['Authorization'] = `Bearer ${token}`;
        }
        return req;
    });
    return client;
});
```

---

## `Cache.memoize(fn)` - Key-Based Memoization

Each property access creates and caches a **separate instance** using the property name as the key argument.

```javascript
const Endpoints = Cache.memoize((resource) => {
    console.log(`Creating endpoint: ${resource}`);
    const api = getAPI();
    return {
        list:   (params = {}) => api.get(`/${resource}`, params),
        get:    (id)          => api.get(`/${resource}/${id}`),
        create: (data)        => api.post(`/${resource}`, data),
        update: (id, data)    => api.put(`/${resource}/${id}`, data),
        delete: (id)          => api.delete(`/${resource}/${id}`)
    };
});

await Endpoints.users.list();    // "Creating endpoint: users"
await Endpoints.users.get('1');  // no log - cached
await Endpoints.posts.list();    // "Creating endpoint: posts"
```

Use for resources that share the same structure but need separate instances per key:

```javascript
// Namespaced localStorage
const Storage = Cache.memoize((namespace) => ({
    get:    (key) => JSON.parse(localStorage.getItem(`${namespace}:${key}`)),
    
    set:    (key, val) => localStorage.setItem(`${namespace}:${key}`, JSON.stringify(val)),
    
    remove: (key) => localStorage.removeItem(`${namespace}:${key}`)
}));

Storage.user.set('theme', 'dark');
Storage.app.set('version', '1.0.0');

// Form fields with observables
const Fields = Cache.memoize(name => ({
    value:  Observable(''),
    error:  Observable(null),
    reset:  () => { Fields[name].value.set(''); Fields[name].error.set(null); }
}));

Fields.email.value.set('alice@example.com');
Fields.password.value.set('secret');
```

---

## Comparison

| | `Cache.once()` | `Cache.singleton()` | `Cache.memoize()` |
|---|---|---|---|
| **Execution** | Lazy - on property access | Eager - on first call | Lazy - per key on property access |
| **Access** | `obj.property` | `fn()` | `obj.key.method()` |
| **Instances** | 1 | 1 | 1 per key |
| **Best for** | Optional modules | Core services | Resources by type |

---

## Best Practices

1. Use `Cache.singleton()` for core services (API client, config, logger)
2. Use `Cache.once()` for optional or heavy modules that may not be needed
3. Use `Cache.memoize()` for resources that share structure but need separate instances
4. Keep memoize keys simple and predictable - avoid dynamic or timestamp-based keys
5. Be aware that `Cache.memoize()` instances stay in memory - use only for a finite set of keys

---

## Next Steps

- **[NativeFetch](./native-fetch.md)** - HTTP client with interceptors
- **[State Management](./state-management.md)** - Global state with Store
- **[Observables](./observables.md)** - Reactive state management