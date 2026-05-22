---
title: Routing
description: Build single-page applications with NativeDocument's full-featured router - hash, history, and memory modes with layouts, middlewares, and named routes
---

# Routing

NativeDocument's routing system enables single-page applications with client-side navigation. The router manages URL changes, renders the right components, and maintains application state without full page reloads.

## Setup

```javascript
import { Router, Link } from 'native-document/router';

Router.create({ name: 'default', mode: 'history' }, (router) => {
    router.add('/', HomePage);
    router.add('/about', AboutPage);
    router.add('/users/{id}', UserProfile);
});
```

## Router Modes

### History mode (recommended)

Uses the HTML5 History API for clean URLs:

```javascript
Router.create({ name: 'app', mode: 'history' }, (router) => {
    router.add('/', HomePage);
    router.add('/products', ProductList);
});
// URLs: /products, /users/123
```

### Hash mode

Uses URL fragments - compatible with static hosting:

```javascript
Router.create({ name: 'app', mode: 'hash' }, (router) => {
    router.add('/', HomePage);
    router.add('/dashboard', Dashboard);
});
// URLs: #/dashboard, #/users/456
```

### Memory mode

Keeps routing state in memory without changing the URL - useful for testing or embedded flows:

```javascript
Router.create({ name: 'app', mode: 'memory' }, (router) => {
    router.add('/', HomePage);
    router.add('/step2', Step2);
});
```

---

## Defining Routes

```javascript
Router.create({ name: 'app', mode: 'history' }, (router) => {
    // Static routes
    router.add('/', HomePage);
    router.add('/about', AboutPage);

    // Route with parameter
    router.add('/users/{id}', ({ params }) =>
        Div(['User: ', params.id])
    );

    // Multiple parameters
    router.add('/posts/{category}/{slug}', ({ params }) =>
        BlogPost({ category: params.category, slug: params.slug })
    );

    // Catch-all 404 (must be last)
    router.add('{*}', NotFoundPage);
});
```

---

## Route Parameters

### Basic parameters

```javascript
router.add('/users/{id}', ({ params }) => UserProfile(params.id));

router.add('/blog/{year}/{month}', ({ params }) =>
    BlogArchive({ year: parseInt(params.year), month: parseInt(params.month) })
);
```

### Parameter validation

Use `{ with: { paramName: pattern } }` to restrict a parameter to a regex pattern:

```javascript
// Inline pattern - only numeric ids
router.add('/users/{id}', UserProfile, { with: { id: '[0-9]+' } });

// Slug pattern
router.add('/posts/{slug}', BlogPost, { with: { slug: '[a-z0-9-]+' } });
```

You can also register patterns globally via `RouteParamPatterns` and reference them as `{param:patternName}`:

```javascript
import { RouteParamPatterns } from 'native-document/router';
```

Built-in patterns:

| Name | Pattern | Matches |
|---|---|---|
| `id` | `[0-9]+` | Numeric IDs |
| `uuid` | `[0-9a-f]{8}-...` | UUIDs |
| `slug` | `[a-z0-9]+(?:-[a-z0-9]+)*` | URL slugs |
| `hash` | `[a-f0-9]{32,64}` | MD5/SHA hashes |
| `alpha` | `[a-zA-Z]+` | Letters only |
| `alphanum` | `[a-zA-Z0-9]+` | Letters and digits |
| `string` | `[^/]+` | Any non-slash string |
| `any` | `.*` | Anything including slashes |
| `int` | `[0-9]+` | Integers |
| `float` | `[0-9]+\.[0-9]+` | Floats |
| `number` | `[0-9]+(\.[0-9]+)?` | Integers or floats |
| `positive` | `[1-9][0-9]*` | Positive integers (no zero) |
| `locale` | `[a-z]{2}(-[A-Z]{2})?` | Locale codes (`fr`, `en-US`) |
| `lang` | `[a-z]{2}` | Language codes (`fr`, `en`) |
| `token` | `[A-Za-z0-9_\-]+` | Tokens and API keys |

```javascript
router.add('/users/{id:id}',         UserProfile);  // numeric only
router.add('/posts/{slug:slug}',     BlogPost);      // url-safe slug
router.add('/files/{hash:hash}',     FileView);      // hash string
router.add('/lang/{code:locale}',    LocalePage);    // fr, en-US
```

You can also extend `RouteParamPatterns` with your own:

```javascript
RouteParamPatterns.year  = '[0-9]{4}';
RouteParamPatterns.color = '[0-9a-fA-F]{6}';

router.add('/archive/{year:year}', ArchivePage);
```

---

## Query Parameters

```javascript
router.add('/search', ({ query }) => {
    const { term, category, page = '1' } = query;
    return SearchResults({ term, category, page: parseInt(page) });
});
// URL: /search?term=javascript&category=tutorials&page=2
```

---

## Route Groups

Organize related routes with shared configuration:

```javascript
Router.create({ name: 'app', mode: 'history' }, (router) => {

    // Group with layout
    router.group('', { layout: DefaultLayout }, () => {
        router.add('/', HomePage, { name: 'home' });
        router.add('/about', AboutPage, { name: 'about' });
    });

    // Group with middleware and name prefix
    router.group('/admin', { middlewares: [requireAuth], name: 'admin' }, () => {
        router.add('/', AdminDashboard, { name: 'dashboard' }); // admin.dashboard
        router.add('/users', AdminUsers, { name: 'users' });    // admin.users
    });

});
```

---

## Named Routes

Naming routes lets you generate URLs and navigate without hardcoding paths:

```javascript
Router.create({ name: 'app', mode: 'history' }, (router) => {
    router.add('/', HomePage,                      { name: 'home' });
    router.add('/users/{id}', UserProfile,         { name: 'user.profile' });
    router.add('/posts/{category}/{slug}', BlogPost, { name: 'blog.post' });
});

// Generate a URL by name
const router = Router.get('app');
router.generateUrl('user.profile', { id: 123 });
// -> '/users/123'

router.generateUrl('blog.post',
    { category: 'javascript', slug: 'getting-started' },
    { ref: 'newsletter' }
);
// -> '/posts/javascript/getting-started?ref=newsletter'
```

---

## Navigation

### `Router.push(target, routerName?)`

Add a new entry to the browser history:

```javascript
Router.push('/about');              // path - uses default router
Router.push('/about', 'app');       // path - named router

Router.push({ name: 'home' });      // named route
Router.push({ name: 'user.profile', params: { id: 42 } }, 'app');
Router.push({ name: 'search', query: { term: 'laptop' } });
```

### `Router.replace(target, routerName?)`

Replace the current history entry without adding to the stack:

```javascript
Router.replace('/dashboard');
Router.replace({ name: 'login', query: { redirect: '/dashboard' } });
```

### `Router.redirectTo(pathOrRouteName, params?, routerName?)`

Redirect to a path or named route. If a route name is found, it navigates by name; otherwise it treats the argument as a path:

```javascript
Router.redirectTo('home');
Router.redirectTo('user.profile', { id: 42 });
Router.redirectTo('/legacy-path');
```

### `Router.back(routerName?)` / `Router.forward(routerName?)`

Navigate through browser history:

```javascript
Button('Back').nd.onClick(() => Router.back());
Button('Forward').nd.onClick(() => Router.forward('app'));
```

---

## Link Component

`to` takes a route **name** (string) or an object with `name`, `params`, `query`, and `router`. Use `href` for direct path links:

```javascript
import { Link } from 'native-document/router';

// Named route
Link({ to: 'home' }, 'Home')

// Named route with params
Link({ to: { name: 'user.profile', params: { id: 42 } } }, 'Profile')

// Named route with query
Link({ to: { name: 'search', query: { term: 'js' } } }, 'Search')

// Named route on a specific router
Link({ to: { name: 'admin.dashboard', router: 'admin' } }, 'Admin')

// Direct path link
Link({ href: '/about' }, 'About')

// External link - opens in new tab
Link.blank({ href: 'https://example.com' }, 'External')
```

---

## Middleware

Middleware runs before the route component is rendered. It receives a `context` object and a `next` function:

```javascript
const requireAuth = (context, next) => {
    const { path } = context;
    if (!isAuthenticated()) {
        Router.replace({ name: 'login', query: { redirect: path } });
        return; // stop - don't call next()
    }
    next();
};

const analytics = (context, next) => {
    trackPageView(context.path);
    next();
};
```

Apply middleware to a group or individual route:

```javascript
Router.create({ name: 'app', mode: 'history' }, (router) => {

    router.add('/', HomePage, { name: 'home' });

    router.group('/dashboard', { middlewares: [requireAuth, analytics] }, () => {
        router.add('/', Dashboard, { name: 'dashboard' });
        router.add('/settings', Settings, { name: 'settings' });
    });

    // Route-level middleware
    router.add('/admin', AdminPage, {
        name: 'admin',
        middlewares: [requireAuth, requireAdmin]
    });

});
```

---

## Multiple Routers

Always name your routers to avoid conflicts:

```javascript
Router.create({ name: 'main', mode: 'history' }, (router) => {
    router.add('/', HomePage);
    router.add('/products', ProductList);
});

Router.create({ name: 'admin', mode: 'history', entry: '/admin' }, (router) => {
    router.add('/', AdminDashboard);
    router.add('/users', AdminUsers);
});

// Access by name
const main  = Router.get('main');
const admin = Router.get('admin');

// Or via the routers object (plain object, not reactive)
Router.routers.main;
Router.routers.admin;

// Navigate in a specific router
Button('Go to admin').nd.onClick(() => Router.push('/admin/users', 'admin'));
```

> Two unnamed routers would both be stored as `Router.routers.default` - the second would overwrite the first.

---

## Current State

```javascript
const router = Router.get('app');

// Read current state
const { route, params, query, path, hash } = router.currentState();

// Subscribe to navigation changes
router.subscribe(state => {
    console.log('Navigated to:', state.path);
});
```

---

## Error Handling

```javascript
Router.create({ name: 'app', mode: 'history' }, (router) => {
    router.add('/', HomePage);

    // Catch-all - must be last
    router.add('{*}', ({ params }) =>
        Div([
            H1('Page not found'),
            Link({ href: '/' }, 'Go home')
        ])
    );
});
```

---

## Best Practices

1. Always name your routers - unnamed routers default to `'default'` and will conflict
2. Use named routes for all `Link` and `push` calls - avoids hardcoded paths
3. Use `router.group()` for shared middleware and layout
4. Use `Router.replace()` after login or form submission to avoid back-button issues
5. Define the catch-all `{*}` route last

---

## Next Steps

- **[State Management](./state-management.md)** - Global state patterns
- **[Lifecycle Events](./lifecycle-events.md)** - Lifecycle events
- **[NDElement](./native-document-element.md)** - Native Document Element
- **[Anchor](./anchor.md)** - Anchor

## Utilities

- **[Cache](./cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](./native-fetch.md)** - HTTP client with interceptors
- **[Filters](./filters.md)** - Data filtering helpers