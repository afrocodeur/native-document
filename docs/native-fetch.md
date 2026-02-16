# NativeFetch

NativeFetch is a powerful HTTP client built on top of the native Fetch API, providing a clean interface with interceptors, automatic request/response handling, and advanced features for modern web applications.

## Overview

NativeFetch enhances the standard Fetch API with:
- **Interceptors** - Request and response transformation
- **Base URL** - Centralized endpoint configuration
- **Automatic JSON handling** - Parse and stringify automatically
- **Error handling** - Consistent error responses
- **Request cancellation** - AbortController integration
- **TypeScript-friendly** - Clean, predictable API

## Import
```javascript
import { NativeFetch } from 'native-document/utils';
```

## Basic Usage

### Creating an Instance
```javascript
import { NativeFetch } from 'native-document/utils';

// Create client with base URL
const api = new NativeFetch('https://api.example.com');

// Make requests
const users = await api.get('/users');
const user = await api.get('/users/123');
const newUser = await api.post('/users', { name: 'Alice', email: 'alice@example.com' });
```

### HTTP Methods
```javascript
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

// GET request
const data = await api.get('/endpoint');
const dataWithParams = await api.get('/endpoint', { page: 1, limit: 10 });

// POST request
const created = await api.post('/endpoint', { 
    name: 'New Item',
    description: 'Description'
});

// PUT request
const updated = await api.put('/endpoint/123', { 
    name: 'Updated Item'
});

// PATCH request
const patched = await api.patch('/endpoint/123', { 
    status: 'active'
});

// DELETE request
const deleted = await api.delete('/endpoint/123');
```

### Query Parameters
```javascript
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

// Pass query parameters as object
const users = await api.get('/users', {
    page: 1,
    limit: 20,
    sort: 'name',
    filter: 'active'
});
// Request: GET /users?page=1&limit=20&sort=name&filter=active

// Array parameters
const posts = await api.get('/posts', {
    tags: ['javascript', 'tutorial'],
    categories: ['tech', 'programming']
});
// Request: GET /posts?tags=javascript,tutorial&categories=tech,programming
```

## Interceptors

Interceptors allow you to transform requests before they're sent and responses before they're returned.

### Request Interceptors
```javascript
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

// Add authentication header
api.interceptors.request((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Add custom headers
api.interceptors.request((config) => {
    config.headers['X-App-Version'] = '1.0.0';
    config.headers['X-Request-ID'] = generateRequestId();
    return config;
});

// Log requests
api.interceptors.request((config) => {
    console.log(`[${config.method}] ${config.url}`);
    return config;
});
```

### Response Interceptors
```javascript
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

// Handle authentication errors
api.interceptors.response((response) => {
    if (response.status === 401) {
        // Redirect to login
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }
    return response;
});

// Transform response data
api.interceptors.response((response) => {
    // Unwrap data from envelope
    if (response.data && response.data.result) {
        return {
            ...response,
            data: response.data.result
        };
    }
    return response;
});

// Log responses
api.interceptors.response((response) => {
    console.log(`[${response.status}] ${response.url}`);
    return response;
});

// Handle errors globally
api.interceptors.response((response) => {
    if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response;
});
```

### Multiple Interceptors
```javascript
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

// Interceptors are executed in order
api.interceptors.request((config) => {
    console.log('Interceptor 1');
    return config;
});

api.interceptors.request((config) => {
    console.log('Interceptor 2');
    return config;
});

// When making a request:
await api.get('/users');
// Logs: "Interceptor 1"
// Logs: "Interceptor 2"
```

## Advanced Features

### Custom Headers
```javascript
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

// Set default headers
api.interceptors.request((config) => {
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';
    return config;
});

// Per-request headers
const data = await api.get('/endpoint', {}, {
    headers: {
        'X-Custom-Header': 'value'
    }
});
```

### Retry Logic
```javascript
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

// Add retry logic
api.interceptors.response(async (response) => {
    if (response.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = response.headers.get('Retry-After') || 1;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        
        // Retry the request
        return fetch(response.url, response.config);
    }
    return response;
});
```

## Practical Examples

### Authentication Flow
```javascript
import { NativeFetch } from 'native-document/utils';
import { Store } from 'native-document';

const api = new NativeFetch('https://api.example.com');

// Create auth store
Store.create('auth', {
    user: null,
    token: null,
    isAuthenticated: false
});

// Add token to requests
api.interceptors.request((config) => {
    const auth = Store.get('auth').val();
    if (auth.token) {
        config.headers['Authorization'] = `Bearer ${auth.token}`;
    }
    return config;
});

// Handle unauthorized
api.interceptors.response((response) => {
    if (response.status === 401) {
        const auth = Store.get('auth');
        auth.set({
            user: null,
            token: null,
            isAuthenticated: false
        });
        window.location.href = '/login';
    }
    return response;
});

// Login function
async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    
    const auth = Store.get('auth');
    auth.set({
        user: data.user,
        token: data.token,
        isAuthenticated: true
    });
    
    return data;
}

// Logout function
async function logout() {
    await api.post('/auth/logout');
    
    const auth = Store.get('auth');
    auth.set({
        user: null,
        token: null,
        isAuthenticated: false
    });
}
```

### API Service Layer
```javascript
import { NativeFetch } from 'native-document/utils';
import { Cache } from 'native-document/utils';

// Create API client singleton
const getAPI = Cache.singleton(() => {
    const client = new NativeFetch('https://api.example.com');
    
    // Add interceptors
    client.interceptors.request((config) => {
        config.headers['Content-Type'] = 'application/json';
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    });
    
    return client;
});

// API endpoints by resource
export const API = Cache.memoize((resource) => {
    const client = getAPI();
    
    return {
        list: (params = {}) => client.get(`/${resource}`, params),
        get: (id) => client.get(`/${resource}/${id}`),
        create: (data) => client.post(`/${resource}`, data),
        update: (id, data) => client.put(`/${resource}/${id}`, data),
        patch: (id, data) => client.patch(`/${resource}/${id}`, data),
        delete: (id) => client.delete(`/${resource}/${id}`)
    };
});

// Usage
const users = await API.users.list({ page: 1, limit: 10 });
const user = await API.users.get('123');
const newUser = await API.users.create({ name: 'Alice' });
await API.users.update('123', { name: 'Alice Updated' });
await API.users.delete('123');
```

### Loading States
```javascript
import { NativeFetch } from 'native-document/utils';
import { Observable } from 'native-document';

const api = new NativeFetch('https://api.example.com');

const isLoading = Observable(false);
const loadingCount = Observable(0);

// Track loading state
api.interceptors.request((config) => {
    loadingCount.set(loadingCount.val() + 1);
    isLoading.set(true);
    return config;
});

api.interceptors.response((response) => {
    const count = loadingCount.val() - 1;
    loadingCount.set(count);
    if (count === 0) {
        isLoading.set(false);
    }
    return response;
});

// Use in UI
import { Div } from 'native-document/src/elements';
import { ShowIf } from 'native-document';

const LoadingIndicator = Div({ class: 'loading-indicator' }, [
    ShowIf(isLoading, () => 
        Div({ class: 'spinner' }, 'Loading...')
    )
]);
```

### Error Handling
```javascript
import { NativeFetch } from 'native-document/utils';
import { Observable } from 'native-document';

const api = new NativeFetch('https://api.example.com');
const globalError = Observable(null);

// Global error handler
api.interceptors.response((response) => {
    if (!response.ok) {
        const error = {
            status: response.status,
            message: response.statusText,
            url: response.url
        };
        
        globalError.set(error);
        
        // Auto-clear after 5 seconds
        setTimeout(() => globalError.set(null), 5000);
    }
    return response;
});

// Error display component
import { Div } from 'native-document/src/elements';
import { ShowIf } from 'native-document';

const ErrorNotification = Div([
    ShowIf(globalError, () => 
        Div({ 
            class: 'error-notification',
            style: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: '#ff4444',
                color: 'white',
                padding: '16px',
                borderRadius: '8px'
            }
        }, [
            globalError.check(err => err ? err.message : '')
        ])
    )
]);
```

### Request Logging
```javascript
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

// Log all requests
api.interceptors.request((config) => {
    console.group(`🔵 ${config.method} ${config.url}`);
    console.log('Headers:', config.headers);
    console.log('Body:', config.body);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
    return config;
});

// Log all responses
api.interceptors.response((response) => {
    const color = response.ok ? '🟢' : '🔴';
    console.group(`${color} ${response.status} ${response.url}`);
    console.log('Status:', response.statusText);
    console.log('Data:', response.data);
    console.log('Duration:', /* calculate duration */);
    console.groupEnd();
    return response;
});
```

### Analytics Tracking
```javascript
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

// Track API calls
api.interceptors.request((config) => {
    config._startTime = Date.now();
    return config;
});

api.interceptors.response((response) => {
    const duration = Date.now() - response.config._startTime;
    
    // Send to analytics
    if (window.analytics) {
        window.analytics.track('api_request', {
            method: response.config.method,
            endpoint: response.url,
            status: response.status,
            duration: duration,
            success: response.ok
        });
    }
    
    return response;
});
```

## Response Format

NativeFetch automatically parses JSON responses and provides a consistent response object:
```javascript
{
    ok: boolean,           // true if status 200-299
    status: number,        // HTTP status code
    statusText: string,    // Status message
    headers: Headers,      // Response headers
    data: any,            // Parsed JSON data
    url: string,          // Request URL
    config: object        // Original request config
}
```

### Handling Different Response Types
```javascript
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

// JSON response (default)
const json = await api.get('/data');
console.log(json.data);

// Text response
const response = await fetch('https://api.example.com/text');
const text = await response.text();

// Blob response (files, images)
const blobResponse = await fetch('https://api.example.com/image.png');
const blob = await blobResponse.blob();
const imageUrl = URL.createObjectURL(blob);
```

## Error Handling

### Try-Catch Pattern
```javascript
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

try {
    const data = await api.get('/endpoint');
    console.log('Success:', data);
} catch (error) {
    if (error.response) {
        // Server responded with error
        console.error('Server error:', error.response.status);
        console.error('Message:', error.response.data);
    } else if (error.request) {
        // Request made but no response
        console.error('Network error:', error.message);
    } else {
        // Other errors
        console.error('Error:', error.message);
    }
}
```

### Async Error Boundaries
```javascript
import { NativeFetch } from 'native-document/utils';
import { Observable } from 'native-document';

const api = new NativeFetch('https://api.example.com');

async function fetchData() {
    const data = Observable(null);
    const error = Observable(null);
    const loading = Observable(true);
    
    try {
        const response = await api.get('/data');
        data.set(response.data);
    } catch (err) {
        error.set(err.message);
    } finally {
        loading.set(false);
    }
    
    return { data, error, loading };
}
```

## Best Practices

### 1. Create Singleton API Client
```javascript
import { Cache } from 'native-document/utils';
import { NativeFetch } from 'native-document/utils';

// ✅ Good: Single instance with interceptors
const getAPI = Cache.singleton(() => {
    const client = new NativeFetch('https://api.example.com');
    
    client.interceptors.request((config) => {
        // Add auth header
        return config;
    });
    
    return client;
});

// ❌ Bad: New instance every time
function makeRequest() {
    const api = new NativeFetch('https://api.example.com');
    return api.get('/data');
}
```

### 2. Use Resource-Based Endpoints
```javascript
import { Cache } from 'native-document/utils';

// ✅ Good: Organized by resource
const API = Cache.memoize((resource) => ({
    list: () => api.get(`/${resource}`),
    get: (id) => api.get(`/${resource}/${id}`),
    create: (data) => api.post(`/${resource}`, data)
}));

// ❌ Bad: Scattered API calls
async function getUsers() {
    return api.get('/users');
}
async function getUser(id) {
    return api.get('/users/' + id);
}
```

### 3. Handle Errors Consistently
```javascript
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

// ✅ Good: Centralized error handling
api.interceptors.response((response) => {
    if (!response.ok) {
        handleError(response);
    }
    return response;
});

// ❌ Bad: Error handling in every request
try {
    await api.get('/endpoint1');
} catch (error) {
    showError(error);
}

try {
    await api.get('/endpoint2');
} catch (error) {
    showError(error);
}
```

### 4. Use Query Parameters Object
```javascript
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

// ✅ Good: Clean object syntax
const users = await api.get('/users', {
    page: 1,
    limit: 20,
    sort: 'name'
});

// ❌ Bad: Manual query string
const users = await api.get('/users?page=1&limit=20&sort=name');
```

### 5. Type Your Responses
```javascript
import { NativeFetch } from 'native-document/utils';

const api = new NativeFetch('https://api.example.com');

// ✅ Good: Document expected response
/**
 * @returns {Promise<{data: User[]}>}
 */
async function getUsers() {
    return await api.get('/users');
}

// Use with confidence
const { data } = await getUsers();
data.forEach(user => console.log(user.name));
```

## Performance Tips

### 1. Reuse Client Instances
```javascript
import { Cache } from 'native-document/utils';

// ✅ Singleton - created once
const getAPI = Cache.singleton(() => new NativeFetch('https://api.example.com'));
```

### 2. Cancel Unnecessary Requests
```javascript
let controller = new AbortController();

async function search(query) {
    // Cancel previous request
    controller.abort();
    controller = new AbortController();
    
    return await api.get('/search', { q: query }, {
        signal: controller.signal
    });
}
```

### 3. Batch Related Requests
```javascript
// ✅ Good: Batch requests
const [users, posts, comments] = await Promise.all([
    api.get('/users'),
    api.get('/posts'),
    api.get('/comments')
]);

// ❌ Bad: Sequential requests
const users = await api.get('/users');
const posts = await api.get('/posts');
const comments = await api.get('/comments');
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
