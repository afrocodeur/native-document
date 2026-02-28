# Cache Utilities

NativeDocument provides utility functions for optimizing function execution through lazy initialization, memoization, and singleton patterns. These utilities help improve performance by deferring execution and caching results.

## Overview

The Cache utilities include:
- **`Cache.once(fn)`** - Lazy execution (via `autoOnce`) - executes on first property access
- **`Cache.singleton(fn)`** - Eager singleton (via `once`) - executes immediately on first call
- **`Cache.memoize(fn)`** - Lazy memoization (via `autoMemoize`) - proxy-based caching

## Import
```javascript
import { Cache } from 'native-document/utils';

// Use Cache methods
const lazyInit = Cache.once(() => { /* ... */ });
const singleton = Cache.singleton(() => { /* ... */ });
const memoized = Cache.memoize((key) => { /* ... */ });
```

## Cache.once() - Lazy Initialization

Lazy execution using `autoOnce`. The function is **not executed immediately** - it only runs when you access a property on the returned object.

### Basic Usage
```javascript
import { Cache } from 'native-document/utils';

const LazyConfig = Cache.once(() => {
    console.log('Loading config...');
    return {
        apiUrl: 'https://api.example.com',
        timeout: 5000,
        maxRetries: 3
    };
});

// Function not executed yet
console.log('Config created');

// First property access triggers execution
console.log(LazyConfig.apiUrl); 
// Logs: "Loading config..."
// Returns: "https://api.example.com"

// Subsequent accesses use cached result
console.log(LazyConfig.timeout); // No log, returns 5000
console.log(LazyConfig.maxRetries); // No log, returns 3
```

### Lazy Module Loading
```javascript
import { Cache } from 'native-document/utils';

const Utils = Cache.once(() => {
    console.log('Initializing utils...');
    return {
        formatDate: (date) => new Date(date).toLocaleDateString(),
        capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
        truncate: (str, len) => str.length > len ? str.slice(0, len) + '...' : str,
        slugify: (str) => str.toLowerCase().replace(/\s+/g, '-')
    };
});

// Utils not initialized yet
console.log('App started');

// First use initializes the module
const formatted = Utils.formatDate(new Date());
// Logs: "Initializing utils..."

// Already initialized - no log
const capitalized = Utils.capitalize('hello');
const slug = Utils.slugify('Hello World');
```

### Lazy API Client
```javascript
import { Cache } from 'native-document/utils';
import { NativeFetch } from 'native-document/utils';

const API = Cache.once(() => {
    console.log('Setting up API client...');
    const client = new NativeFetch('https://api.example.com');
    
    client.interceptors.request((config) => {
        config.headers['Authorization'] = `Bearer ${getToken()}`;
        return config;
    });
    
    return {
        users: {
            get: (id) => client.get(`/users/${id}`),
            list: () => client.get('/users')
        },
        posts: {
            get: (id) => client.get(`/posts/${id}`),
            create: (data) => client.post('/posts', data)
        }
    };
});

// Client not created yet
console.log('Starting app...');

// Client created on first API call
const users = await API.users.list();
// Logs: "Setting up API client..."

// Client already created
const user = await API.users.get('123');
```

## Cache.singleton() - Eager Singleton

Eager execution using `once`. The function executes **on the first call** and caches the result for subsequent calls.

### Basic Usage
```javascript
import { Cache } from 'native-document/utils';

const getLogger = Cache.singleton(() => {
    console.log('Creating logger instance...');
    return {
        log: (msg) => console.log(`[LOG] ${msg}`),
        error: (msg) => console.error(`[ERROR] ${msg}`),
        warn: (msg) => console.warn(`[WARN] ${msg}`),
        info: (msg) => console.info(`[INFO] ${msg}`)
    };
});

// First call creates the logger
const logger = getLogger();
// Logs: "Creating logger instance..."

logger.log('Application started');

// Subsequent calls return cached instance
const logger2 = getLogger();
// No log - returns cached instance

console.log(logger === logger2); // true - same reference
```

### Application Configuration
```javascript
import { Cache } from 'native-document/utils';

const getConfig = Cache.singleton(() => {
    console.log('Loading configuration...');
    return {
        apiUrl: import.meta.env.VITE_API_URL || 'https://api.example.com',
        debug: import.meta.env.DEV,
        version: '1.0.0',
        features: {
            analytics: true,
            darkMode: true
        }
    };
});

// First call loads config
const config = getConfig();
// Logs: "Loading configuration..."

console.log(config.apiUrl);

// Returns same config instance
const config2 = getConfig();
console.log(config === config2); // true
```

### Event Bus Singleton
```javascript
import { Cache } from 'native-document/utils';

const getEventBus = Cache.singleton(() => {
    console.log('Creating event bus...');
    const listeners = new Map();
    
    return {
        on: (event, callback) => {
            if (!listeners.has(event)) {
                listeners.set(event, []);
            }
            listeners.get(event).push(callback);
        },
        off: (event, callback) => {
            const eventListeners = listeners.get(event);
            if (eventListeners) {
                const index = eventListeners.indexOf(callback);
                if (index > -1) {
                    eventListeners.splice(index, 1);
                }
            }
        },
        emit: (event, data) => {
            const eventListeners = listeners.get(event);
            if (eventListeners) {
                eventListeners.forEach(callback => callback(data));
            }
        }
    };
});

// Create event bus
const bus = getEventBus();
// Logs: "Creating event bus..."

bus.on('user:login', (user) => console.log('User logged in:', user));
bus.emit('user:login', { id: 1, name: 'John' });

// Same event bus everywhere
const bus2 = getEventBus();
console.log(bus === bus2); // true
```

## Cache.memoize() - Lazy Memoization with Key-Based Instances

Lazy memoization using `autoMemoize`. Each property access creates and caches a **separate instance** of the function result, using the property name as the key parameter.

### How It Works
```javascript
import { Cache } from 'native-document/utils';

const API = Cache.memoize((key) => {
    console.log(`Creating API for: ${key}`);
    return {
        async list() {
            return await fetch('/' + key);
        },
        async get(id) {
            return await fetch('/' + key + '/' + id);
        }
    };
});

// First access to 'users' - executes function with key='users'
await API.users.list();
// Logs: "Creating API for: users"
// Fetch: '/users'

// Second access to 'users' - returns cached instance
await API.users.get('123');
// No log - cached instance
// Fetch: '/users/123'

// First access to 'posts' - executes function with key='posts'
await API.posts.list();
// Logs: "Creating API for: posts"
// Fetch: '/posts'

// Cached instance for 'posts'
await API.posts.get('456');
// No log - cached instance
// Fetch: '/posts/456'
```

### Key Concepts

1. **Property name becomes the key**: `API.users` -> `key = 'users'`
2. **Function executed per unique key**: First access creates instance
3. **Results cached by key**: Subsequent accesses return same instance
4. **Each key has its own instance**: `API.users` ≠ `API.posts`

### Basic Resource Providers
```javascript
import { Cache } from 'native-document/utils';

const Resources = Cache.memoize((resource) => {
    console.log(`Loading ${resource}...`);
    
    return {
        data: `${resource} data`,
        load: () => console.log(`Reloading ${resource}`),
        save: (content) => console.log(`Saving to ${resource}:`, content)
    };
});

// First access - creates 'icons' instance
Resources.icons.load();
// Logs: "Loading icons..."
// Logs: "Reloading icons"

// Cached instance
Resources.icons.save('new-icon.svg');
// Logs: "Saving to icons: new-icon.svg"

// Different key - creates 'fonts' instance
Resources.fonts.load();
// Logs: "Loading fonts..."
// Logs: "Reloading fonts"
```

### API Endpoint Collections
```javascript
import { Cache } from 'native-document/utils';
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

const Endpoints = Cache.memoize((resource) => {
    console.log(`Creating endpoint for: ${resource}`);
    
    return {
        list: () => api.get(`/${resource}`),
        get: (id) => api.get(`/${resource}/${id}`),
        create: (data) => api.post(`/${resource}`, data),
        update: (id, data) => api.put(`/${resource}/${id}`, data),
        delete: (id) => api.delete(`/${resource}/${id}`)
    };
});

// Create 'users' endpoint instance
const users = await Endpoints.users.list();
// Logs: "Creating endpoint for: users"
// GET: /users

const user = await Endpoints.users.get('123');
// GET: /users/123 (cached instance)

// Create 'posts' endpoint instance
const posts = await Endpoints.posts.list();
// Logs: "Creating endpoint for: posts"
// GET: /posts

await Endpoints.posts.create({ title: 'New Post' });
// POST: /posts (cached instance)
```

### Store Providers
```javascript
import { Cache } from 'native-document/utils';
import { Store } from 'native-document';

const Stores = Cache.memoize((storeName) => {
    console.log(`Creating store: ${storeName}`);
    
    // Create store if it doesn't exist
    if (!Store.get(storeName)) {
        Store.create(storeName, {
            items: [],
            loading: false,
            error: null
        });
    }
    
    return {
        get: () => Store.use(storeName),
        setLoading: (value) => {
            /*...*/
        },
        addItem: (items) => {
            /*...*/
        },
        setItems: (items) => {
            /*...*/
        },
        setError: (error) => {
            /*...*/
        }
    };
});

// Create 'products' store
const productsStore = Stores.products.get();
// Logs: "Creating store: products"

Stores.products.setLoading(true);
Stores.products.addItem({ id: 1, name: 'Product 1' });

// Create 'users' store
const usersStore = Stores.users.get();
// Logs: "Creating store: users"

Stores.users.setItems([{ id: 1, name: 'Alice' }]);
```

### LocalStorage Namespaces
```javascript
import { Cache } from 'native-document/utils';

const Storage = Cache.memoize((namespace) => {
    console.log(`Creating storage for namespace: ${namespace}`);
    
    const prefix = `${namespace}:`;
    
    return {
        get: (key) => {
            try {
                const item = localStorage.getItem(prefix + key);
                return item ? JSON.parse(item) : null;
            } catch {
                return null;
            }
        },
        set: (key, value) => {
            try {
                localStorage.setItem(prefix + key, JSON.stringify(value));
                return true;
            } catch {
                return false;
            }
        },
        remove: (key) => {
            localStorage.removeItem(prefix + key);
        },
        clear: () => {
            // Clear all keys with this namespace
            Object.keys(localStorage)
                .filter(key => key.startsWith(prefix))
                .forEach(key => localStorage.removeItem(key));
        }
    };
});

// User preferences namespace
Storage.user.set('theme', 'dark');
// Logs: "Creating storage for namespace: user"
// localStorage: "user:theme" = "dark"

Storage.user.set('language', 'en');
// localStorage: "user:language" = "en"

const theme = Storage.user.get('theme');
// Returns: "dark"

// App settings namespace (different instance)
Storage.app.set('version', '1.0.0');
// Logs: "Creating storage for namespace: app"
// localStorage: "app:version" = "1.0.0"
```

### Event Handlers by Type
```javascript
import { Cache } from 'native-document/utils';

const EventHandlers = Cache.memoize((eventType) => {
    console.log(`Creating handler for: ${eventType}`);
    const listeners = [];
    
    return {
        add: (callback) => {
            listeners.push(callback);
        },
        remove: (callback) => {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        },
        emit: (data) => {
            listeners.forEach(callback => callback(data));
        },
        count: () => listeners.length
    };
});

// Create 'click' event handler
EventHandlers.click.add((data) => console.log('Clicked:', data));
// Logs: "Creating handler for: click"

EventHandlers.click.emit({ x: 100, y: 200 });
// Logs: "Clicked: { x: 100, y: 200 }"

// Create 'scroll' event handler (different instance)
EventHandlers.scroll.add((data) => console.log('Scrolled:', data));
// Logs: "Creating handler for: scroll"

EventHandlers.scroll.emit({ top: 500 });
// Logs: "Scrolled: { top: 500 }"

console.log(EventHandlers.click.count()); // 1
console.log(EventHandlers.scroll.count()); // 1
```

### Validation Rules by Type
```javascript
import { Cache } from 'native-document/utils';

const Validators = Cache.memoize((fieldType) => {
    console.log(`Creating validators for: ${fieldType}`);
    
    const rules = {
        email: {
            required: (value) => !!value || 'Email is required',
            format: (value) => /\S+@\S+\.\S+/.test(value) || 'Invalid email format'
        },
        password: {
            required: (value) => !!value || 'Password is required',
            minLength: (value) => value.length >= 8 || 'Password must be at least 8 characters',
            hasNumber: (value) => /\d/.test(value) || 'Password must contain a number'
        },
        phone: {
            required: (value) => !!value || 'Phone is required',
            format: (value) => /^\d{10}$/.test(value) || 'Phone must be 10 digits'
        }
    };
    
    return {
        validate: (value) => {
            const fieldRules = rules[fieldType];
            if (!fieldRules) return [];
            
            const errors = [];
            for (const [ruleName, rule] of Object.entries(fieldRules)) {
                const result = rule(value);
                if (result !== true) {
                    errors.push(result);
                }
            }
            return errors;
        },
        isValid: (value) => {
            return Validators[fieldType].validate(value).length === 0;
        }
    };
});

// Validate email
const emailErrors = Validators.email.validate('invalid-email');
// Logs: "Creating validators for: email"
// Returns: ['Invalid email format']

const isEmailValid = Validators.email.isValid('test@example.com');
// Returns: true (cached instance)

// Validate password
const passwordErrors = Validators.password.validate('weak');
// Logs: "Creating validators for: password"
// Returns: ['Password must be at least 8 characters', 'Password must contain a number']
```

### Chart Instances by Type
```javascript
import { Cache } from 'native-document/utils';

const Charts = Cache.memoize((chartType) => {
    console.log(`Creating ${chartType} chart instance...`);
    
    return {
        render: (container, data, options = {}) => {
            console.log(`Rendering ${chartType} chart`);
            
            // Simplified chart rendering
            const canvas = document.createElement('canvas');
            container.appendChild(canvas);
            
            // Chart-specific rendering logic
            switch (chartType) {
                case 'bar':
                    renderBarChart(canvas, data, options);
                    break;
                case 'line':
                    renderLineChart(canvas, data, options);
                    break;
                case 'pie':
                    renderPieChart(canvas, data, options);
                    break;
            }
            
            return canvas;
        },
        update: (canvas, data) => {
            console.log(`Updating ${chartType} chart`);
            // Update logic
        }
    };
});

// Create bar chart instance
const barContainer = document.querySelector('#bar-chart');
Charts.bar.render(barContainer, [10, 20, 30]);
// Logs: "Creating bar chart instance..."
// Logs: "Rendering bar chart"

// Create line chart instance (different from bar)
const lineContainer = document.querySelector('#line-chart');
Charts.line.render(lineContainer, [5, 15, 25]);
// Logs: "Creating line chart instance..."
// Logs: "Rendering line chart"

// Reuse bar chart instance
Charts.bar.update(barCanvas, [15, 25, 35]);
// Logs: "Updating bar chart"
```

### Form Field Managers
```javascript
import { Cache } from 'native-document/utils';
import { Observable } from 'native-document';

const FormFields = Cache.memoize((fieldName) => {
    console.log(`Creating field manager for: ${fieldName}`);
    
    const value = Observable('');
    const errors = Observable([]);
    const touched = Observable(false);
    
    return {
        value,
        errors,
        touched,
        setValue: (newValue) => {
            value.set(newValue);
            touched.set(true);
        },
        setErrors: (newErrors) => {
            errors.set(newErrors);
        },
        reset: () => {
            value.set('');
            errors.set([]);
            touched.set(false);
        },
        isValid: () => errors.val().length === 0
    };
});

// Create email field
FormFields.email.setValue('test@example.com');
// Logs: "Creating field manager for: email"

FormFields.email.setErrors([]);
console.log(FormFields.email.isValid()); // true

// Create password field (different instance)
FormFields.password.setValue('weak');
// Logs: "Creating field manager for: password"

FormFields.password.setErrors(['Too short']);
console.log(FormFields.password.isValid()); // false
```

## Comparison: once vs singleton vs memoize

| Feature | `Cache.once()` | `Cache.singleton()` | `Cache.memoize()` |
|---------|------------------|------------------------|---------------------|
| **Execution** | Lazy (on property access) | Eager (on first call) | Lazy (per key on property access) |
| **Implementation** | `autoOnce` | `once` | `autoMemoize` |
| **Access Pattern** | `obj.property` | `fn()` | `obj[key].method()` |
| **Instances Created** | 1 (single instance) | 1 (single instance) | N (one per key) |
| **Cache Strategy** | Properties from result | Entire result | Result per property key |
| **Use Case** | Lazy modules | Eager singletons | Multiple instances by key |

### Visual Comparison
```javascript
import { Cache } from 'native-document/utils';

// Cache.once() - Single lazy instance
const LazyUtils = Cache.once(() => {
    console.log('Init utils');
    return { 
        format: () => 'formatted',
        parse: () => 'parsed'
    };
});

LazyUtils.format(); // Logs: "Init utils"
LazyUtils.parse();  // No log - same instance

// Cache.singleton() - Single eager instance
const getConfig = Cache.singleton(() => {
    console.log('Init config');
    return { api: 'url', debug: true };
});

const config = getConfig(); // Logs: "Init config"
const config2 = getConfig(); // No log - same instance

// Cache.memoize() - Multiple instances by key
const API = Cache.memoize((resource) => {
    console.log(`Init ${resource}`);
    return { 
        list: () => `List ${resource}`,
        get: (id) => `Get ${resource}/${id}`
    };
});

API.users.list();  // Logs: "Init users"
API.users.get(1);  // No log - cached 'users' instance
API.posts.list();  // Logs: "Init posts" - new key, new instance
API.posts.get(2);  // No log - cached 'posts' instance
```

## When to Use Cache.memoize()

### ✅ Good Use Cases
```javascript
import { Cache } from 'native-document/utils';

// Multiple API endpoints with same structure
const API = Cache.memoize((resource) => ({
    list: () => fetch(`/${resource}`),
    get: (id) => fetch(`/${resource}/${id}`)
}));

// Multiple storage namespaces
const Storage = Cache.memoize((namespace) => ({
    get: (key) => localStorage.getItem(`${namespace}:${key}`),
    set: (key, val) => localStorage.setItem(`${namespace}:${key}`, val)
}));

// Multiple event types with same handler structure
const Events = Cache.memoize((type) => {
    const listeners = [];
    return {
        on: (cb) => listeners.push(cb),
        emit: (data) => listeners.forEach(cb => cb(data))
    };
});

// Multiple form fields with same structure
const Fields = Cache.memoize((name) => ({
    value: Observable(''),
    error: Observable(null),
    validate: () => { /* ... */ }
}));
```

### ❌ Bad Use Cases
```javascript
import { Cache } from 'native-document/utils';

// ❌ Don't use for single instance
const Config = Cache.memoize(() => loadConfig());
// Use Cache.singleton() instead

// ❌ Don't use when keys are unpredictable
const RandomData = Cache.memoize((timestamp) => generateData());
// Each call has unique timestamp - cache never hits

// ❌ Don't use for simple property access
const Constants = Cache.memoize(() => ({
    PI: 3.14159,
    E: 2.71828
}));
// Use Cache.once() instead
```

## Best Practices

### 1. Use Descriptive Keys
```javascript
import { Cache } from 'native-document/utils';

// ✅ Good: Clear, predictable keys
const Endpoints = Cache.memoize((resource) => createAPI(resource));
Endpoints.users.list();
Endpoints.posts.list();

// ❌ Bad: Dynamic, unpredictable keys
const DynamicAPI = Cache.memoize((timestamp) => createAPI(timestamp));
DynamicAPI[Date.now()].list(); // New instance every time
```

### 2. Document Key-Based Behavior
```javascript
import { Cache } from 'native-document/utils';

/**
 * API endpoints by resource type
 * @memoized Each resource type gets its own instance
 * @param {string} resource - Resource name (e.g., 'users', 'posts')
 */
const API = Cache.memoize((resource) => ({
    list: () => fetch(`/${resource}`),
    get: (id) => fetch(`/${resource}/${id}`)
}));
```

### 3. Keep Keys Simple
```javascript
import { Cache } from 'native-document/utils';

// ✅ Good: Simple string keys
const Stores = Cache.memoize((name) => Store.create(name, {}));
Stores.user;
Stores.settings;

// ❌ Bad: Complex keys (won't work as expected)
const BadCache = Cache.memoize((config) => createThing(config));
BadCache[{ type: 'user' }]; // Object as key - problematic
```

### 4. Combine with Other Patterns
```javascript
import { Cache } from 'native-document/utils';

// Eager config + Memoized resources
const getConfig = Cache.singleton(() => loadConfig());

const Resources = Cache.memoize((type) => {
    const config = getConfig(); // Config already loaded
    return createResource(type, config);
});
```

## Performance Considerations

### Memory Usage
```javascript
import { Cache } from 'native-document/utils';

// ⚠️ Each key creates a new cached instance
const API = Cache.memoize((resource) => createAPI(resource));

API.users;     // Instance 1
API.posts;     // Instance 2
API.comments;  // Instance 3
// All instances stay in memory

// Consider: Do you need separate instances per key?
```

### Cache Growth
```javascript
import { Cache } from 'native-document/utils';

// ⚠️ Warning: Unbounded cache growth
const DynamicCache = Cache.memoize((id) => createInstance(id));

// If IDs keep changing, cache grows indefinitely
for (let i = 0; i < 1000; i++) {
    DynamicCache[`user-${i}`]; // 1000 cached instances
}

// ✅ Better: Limited, predictable keys
const ResourceCache = Cache.memoize((type) => createResource(type));
ResourceCache.users;    // Only a few known types
ResourceCache.posts;
ResourceCache.comments;
```

## Summary

### Quick Reference

| Pattern | Syntax | When to Use |
|---------|--------|-------------|
| **Lazy Module** | `Cache.once(() => {...})` | Optional features, heavy resources |
| **Eager Singleton** | `Cache.singleton(() => {...})` | Core services, configuration |
| **Multi-Instance** | `Cache.memoize((key) => {...})` | Resources by type, namespaced data |

### Key Differences
```javascript
import { Cache } from 'native-document/utils';

// Cache.once() - Single lazy instance via autoOnce
const Lazy = Cache.once(() => ({ value: 1 }));
Lazy.value; // Creates instance on property access

// Cache.singleton() - Single eager instance via once
const Eager = Cache.singleton(() => ({ value: 1 }));
Eager(); // Creates instance on function call

// Cache.memoize() - Multiple instances by key via autoMemoize
const Multi = Cache.memoize((key) => ({ value: key }));
Multi.a; // Creates instance for key 'a'
Multi.b; // Creates instance for key 'b'
```

## Next Steps

Explore related utilities and concepts:

## Next Steps

- **[Getting Started](getting-started.md)** - Installation and first steps
- **[Core Concepts](core-concepts.md)** - Understanding the fundamentals
- **[Observables](observables.md)** - Reactive state management
- **[Elements](elements.md)** - Creating and composing UI
- **[Conditional Rendering](conditional-rendering.md)** - Dynamic content
- **[List Rendering](list-rendering.md)** - (ForEach | ForEachArray) and dynamic lists
- **[Routing](routing.md)** - Navigation and URL management
- **[State Management](state-management.md)** - Global state patterns
- **[NDElement](native-document-element.md)** - Native Document Element
- **[Extending NDElement](extending-native-document-element.md)** - Custom Methods Guide
- **[Advanced Components](advanced-components.md)** - Template caching and singleton views
- **[Args Validation](validation.md)** - Function Argument Validation
- **[Memory Management](memory-management.md)** - Memory management

## Utilities

- **[Cache](docs/utils/cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](docs/utils/native-fetch.md)** - HTTP client with interceptors
- **[Filters](docs/utils/filters.md)** - Data filtering helpers
