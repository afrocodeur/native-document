# Routing

NativeDocument's routing system enables building single-page applications with client-side navigation. The router automatically manages URL changes, renders appropriate components, and maintains application state without full page reloads.

## Understanding Routing

The routing system works by matching URL patterns against registered routes and rendering corresponding components. When users navigate, the router updates the view while preserving application state and providing smooth transitions.

```javascript
import { Router } from 'native-document/router';

// Create router and define routes
const router = Router.create({ mode: 'history' }, (router) => {
    router.add('/', HomePage);
    router.add('/about', AboutPage);
    router.add('/users/{id}', UserProfile);
});

// Mount to DOM
router.mount('#app');
```

## Router Modes

NativeDocument supports three routing modes for different deployment scenarios:

### History Mode (Recommended)

Uses HTML5 History API for clean URLs without hash symbols:

```javascript
const router = Router.create({ mode: 'history' }, (router) => {
    router.add('/', () => Div('Home Page'));
    router.add('/products', () => Div('Product List'));
    router.add('/contact', () => Div('Contact Us'));
});

// URLs: /products, /contact, /users/123
```

### Hash Mode

Uses URL fragments for compatibility with static hosting:

```javascript
const router = Router.create({ mode: 'hash' }, (router) => {
    router.add('/', () => Div('Home Page'));
    router.add('/dashboard', () => Div('Dashboard'));
});

// URLs: #/dashboard, #/users/456
```

### Memory Mode

Keeps routing state in memory without URL changes (useful for testing):

```javascript
const router = Router.create({ mode: 'memory' }, (router) => {
    router.add('/', () => Div('Test Home'));
    router.add('/test', () => Div('Test Page'));
});

// URLs don't change, navigation happens programmatically
```

## Basic Route Definition

Routes map URL patterns to component functions that receive navigation data:

```javascript
const router = Router.create({ mode: 'history' }, (router) => {
    // Static routes
    router.add('/', () => Div('Welcome to our site'));
    router.add('/about', () => Div('About our company'));
    
    // Routes with parameters
    router.add('/users/{id}', ({ params }) => 
        Div(['User Profile for ID: ', params.id])
    );
    
    // Multiple parameters
    router.add('/posts/{category}/{slug}', ({ params }) => 
        Div([
            'Category: ', params.category,
            ', Post: ', params.slug
        ])
    );
});
```

## Route Parameters

Extract dynamic values from URLs using parameter syntax:

### Basic Parameters

```javascript
router.add('/users/{userId}', ({ params }) => {
    const user = getUserById(params.userId);
    return UserProfileComponent(user);
});

router.add('/blog/{year}/{month}', ({ params }) => {
    return BlogArchive({
        year: parseInt(params.year),
        month: parseInt(params.month)
    });
});
```

### Parameter Validation

Define custom patterns for parameter validation:

```javascript
// Define global patterns
RouteParamPatterns.number = '[0-9]+';

const router = Router.create({ mode: 'history' }, (router) => {
    // Only numeric IDs - inline pattern
    router.add('/users/{id}', ({ params }) => 
        UserProfile(params.id), 
        { with: { id: '[0-9]+' }}
    );
    
    // OR using global pattern
    router.add('/users/{id:number}', ({ params }) => 
        UserProfile(params.id)
    );
    
    // Custom patterns - inline
    router.add('/posts/{slug}', ({ params }) => 
        BlogPost(params.slug),
        { with: { slug: '[a-z0-9-]+' }}
    );
    
    // OR define and use pattern
    RouteParamPatterns.slug = '[a-z0-9-]+';
    router.add('/posts/{slug:slug}', ({ params }) => 
        BlogPost(params.slug)
    );
});
```

## Query Parameters

Access URL query strings through the query object:

```javascript
router.add('/search', ({ query }) => {
    const { term, category, page = 1 } = query;
    
    return SearchResults({
        searchTerm: term,
        category: category,
        currentPage: parseInt(page)
    });
});

// URL: /search?term=javascript&category=tutorials&page=2
// query = { term: 'javascript', category: 'tutorials', page: '2' }
```

## Navigation

Navigate programmatically using router methods:

### Push Navigation

Add new entries to browser history. **Specify router name** when using multiple routers:

```javascript
const NavigationExample = Div([
    Button('Go to About').nd.on.click(() => {
        Router.push('/about'); // Uses default router
    }),
    
    Button('Go to About (Main Router)').nd.on.click(() => {
        Router.push('/about', 'main'); // Uses named router
    }),
    
    Button('View User 123').nd.on.click(() => {
        // Navigate in specific router
        Router.push('/users/123', 'app');
    }),
    
    Button('Search Products').nd.on.click(() => {
        Router.push('/search?term=laptop&category=electronics', 'main');
    })
]);
```

### Replace Navigation

Replace current history entry without adding to stack:

```javascript
const LoginRedirect = () => {
    // Redirect after login without allowing back navigation
    Router.replace('/dashboard'); // Default router
    
    // Or specify router
    Router.replace('/dashboard', 'main');
    
    return Div('Redirecting...');
};
```

### History Navigation

Navigate through browser history:

```javascript
const HistoryControls = Div([
    Button('Go Back').nd.on.click(() => Router.back()), // Default router
    Button('Go Forward').nd.on.click(() => Router.forward()), // Default router
    
    // Navigate specific router's history
    Button('Back in Main').nd.on.click(() => Router.back('main')),
    Button('Forward in Admin').nd.on.click(() => Router.forward('admin'))
]);
```

## Named Routes

Name routes for easier URL generation and maintenance:

```javascript
const router = Router.create({ mode: 'history' }, (router) => {
    router.add('/', HomePage, { name: 'home' });
    router.add('/users/{id}', UserProfile, { name: 'user.profile' });
    router.add('/posts/{category}/{slug}', BlogPost, { name: 'blog.post' });
});

// Generate URLs by name
const userUrl = router.generateUrl('user.profile', { id: 123 });
// Result: '/users/123'

const blogUrl = router.generateUrl('blog.post', { category: 'javascript', slug: 'getting-started' }, { ref: 'newsletter' });
// Result: '/posts/javascript/getting-started?ref=newsletter'
```

### Navigation with Named Routes

```javascript
const navigation = Div([
    Button('Home').nd.on.click(() => 
        Router.push({ name: 'home' }) // Uses router containing this route
    ),
    
    Button('My Profile').nd.on.click(() => 
        Router.push({ 
            name: 'user.profile', 
            params: { id: currentUser.id } 
        }, 'main') // Specify router if needed
    ),
    
    Button('Latest Post').nd.on.click(() => 
        Router.push({
            name: 'blog.post',
            params: { category: 'news', slug: 'latest-update' },
            query: { highlight: 'new-features' }
        }, 'blog') // Navigate in blog router
    )
]);
```

## Route Groups

Organize related routes with shared configuration:

```javascript
const router = Router.create({ mode: 'history' }, (router) => {
    // Admin routes with auth middleware
    router.group('/admin', { middlewares: [requireAuth, requireAdmin] }, () => {
        router.add('/', AdminDashboard, { name: 'admin.dashboard' });
        router.add('/users', AdminUsers, { name: 'admin.users' });
        router.add('/settings', AdminSettings, { name: 'admin.settings' });
    });
    
    // User dashboard with nested naming
    router.group('/dashboard', { name: 'dashboard' }, () => {
        router.add('/', UserDashboard, { name: 'home' }); // dashboard.home
        router.add('/profile', UserProfile, { name: 'profile' }); // dashboard.profile
        router.add('/settings', UserSettings, { name: 'settings' }); // dashboard.settings
    });
});
```

## Middleware

Add logic that runs before route components are rendered:

### Authentication Middleware

```javascript
const requireAuth = (context, next) => {
    const { route, params, query, path } = context;
    
    if (!isUserAuthenticated()) {
        // Redirect to login with return path
        Router.replace({
            name: 'auth.login',
            query: { redirect: path }
        });
        return;
    }
    
    // Continue to route component
    next();
};

const requireAdmin = (context, next) => {
    if (!isUserAdmin()) {
        Router.replace({ name: 'errors.forbidden' });
        return;
    }
    next();
};
```

### Loading States

```javascript
const loadingMiddleware = (context, next) => {
    // Show loading indicator
    showGlobalLoader();
    
    // Continue to route component
    next();
    
    // Hide loading indicator
    setTimeout(() => hideGlobalLoader(), 100);
};
```

### Analytics Tracking

```javascript
const analyticsMiddleware = (context, next) => {
    const { route, params, path } = context;
    
    // Track page view
    analytics.track('page_view', {
        path: path,
        route_name: route.name(),
        timestamp: Date.now()
    });
    
    next();
};
```

## Link Component

Create navigational links that integrate with the router:

### Basic Links

```javascript
import { Link } from 'native-document/router';

const Navigation = Nav([
    Link({ to: '/' }, 'Home'),
    Link({ to: '/about' }, 'About'),
    Link({ to: '/contact' }, 'Contact'),
    
    // External links open in new tab
    Link.blank({ href: 'https://example.com' }, 'External Site')
]);
```

### Links with Router Specification

```javascript
const UserMenu = Div([
    Link({ 
        to: { 
            name: 'user.profile', 
            params: { id: currentUser.id },
            router: 'main' // Specify which router to use
        } 
    }, 'My Profile'),
    
    Link({
        to: {
            name: 'user.settings',
            params: { id: currentUser.id },
            query: { tab: 'preferences' },
            router: 'main'
        }
    }, 'Settings'),
    
    // Cross-router navigation
    Link({
        to: {
            name: 'admin.dashboard',
            router: 'admin'
        }
    }, 'Admin Panel')
]);
```

### Active Link Styling

```javascript
const NavItem = (path, text, routerName = null) => {
    const router = Router.get(routerName);
    const isActive = Observable(router.currentState().path === path);
    router.subscribe((state) => {
        isActive.set(state.path === path);
    });

    return Link({
        to: path,
        class: { 'nav-link': true, 'active': isActive }
    }, text);
};

const MainNav = Nav([
    NavItem('/', 'Home', 'main'),
    NavItem('/products', 'Products', 'main'),
    NavItem('/services', 'Services', 'main')
]);

// Multi-router navigation
const AppNav = Nav([
    NavItem('/', 'Main App', 'main'),
    NavItem('/admin', 'Admin', 'admin'),
    NavItem('/blog', 'Blog', 'blog')
]);

```

## Multiple Routers

Create separate router instances for different application areas. **Always name your routers** to avoid conflicts and enable proper navigation.

```javascript
// Main application router (named)
const mainRouter = Router.create(
    { mode: 'history', name: 'main' },
    (router) => {
        router.add('/', HomePage);
        router.add('/products', ProductList);
        router.add('/admin', AdminApp);
    }
);

// Admin-specific router (named)
const adminRouter = Router.create(
    { mode: 'history', name: 'admin', entry: '/admin' },
    (router) => {
        router.add('/', AdminDashboard);
        router.add('/users', AdminUsers);
        router.add('/reports', AdminReports);
    }
);

// Access routers by name
const mainRouter = Router.get('main');
const adminRouter = Router.get('admin');

// Or access via routers object
const mainRouter = Router.routers.main;
const adminRouter = Router.routers.admin;

// Cross-router navigation
Button('Go to Admin').nd.on.click(() => {
    Router.push('/admin/users', 'admin'); // Specify router name
});

Button('Back to Main').nd.on.click(() => {
    Router.push('/', 'main'); // Navigate in main router
});
```

### Router Naming Best Practices

**Always name your routers** to prevent conflicts and enable reliable navigation:

```javascript
// ❌ BAD: Unnamed router (becomes default)
const router1 = Router.create({ mode: 'history' }, (router) => {
    // This becomes the default router
});

// ❌ BAD: Multiple unnamed routers cause conflicts
const router2 = Router.create({ mode: 'history' }, (router) => {
    // This overwrites the default router!
});

// ✅ GOOD: Named routers
const appRouter = Router.create({ mode: 'history', name: 'app' }, (router) => {
    router.add('/', HomePage);
});

const modalRouter = Router.create({ mode: 'memory', name: 'modal' }, (router) => {
    router.add('/confirm', ConfirmDialog);
});
```

### Default Router Access

When no name is specified, Router.get() returns the router named "default":

```javascript
// Create default router
Router.create({ mode: 'history' }, (router) => {
    router.add('/', HomePage);
});

// Access default router (named "default" internally)
const defaultRouter = Router.get(); // Returns router named "default"
const defaultRouter = Router.get('default'); // Same as above
const defaultRouter = Router.routers.default; // Direct access

// Navigate using default router
Router.push('/'); // Uses "default" router
Router.push('/', 'default'); // Explicitly use default router
```

### Router Naming Best Practices

**Always name your routers explicitly** to avoid relying on the default:

```javascript
// ❌ BAD: Unnamed router (becomes "default")
const router1 = Router.create({ mode: 'history' }, (router) => {
    // This is stored as Router.routers.default
});

// ❌ BAD: Multiple unnamed routers cause conflicts
const router2 = Router.create({ mode: 'history' }, (router) => {
    // This overwrites Router.routers.default!
});

// ✅ GOOD: Named routers
const appRouter = Router.create({ mode: 'history', name: 'app' }, (router) => {
    router.add('/', HomePage);
    // Stored as Router.routers.app
});

const modalRouter = Router.create({ mode: 'memory', name: 'modal' }, (router) => {
    router.add('/confirm', ConfirmDialog);
    // Stored as Router.routers.modal
});
```

## Route Guards and Data Loading

Implement route guards and data preloading:

### Route-Specific Data Loading

```javascript
const UserProfile = ({ params }) => {
    const userId = params.id;
    const user = Observable(null);
    const loading = Observable(true);
    const error = Observable(null);
    
    // Load user data
    fetchUser(userId)
        .then(userData => {
            user.set(userData);
            loading.set(false);
        })
        .catch(err => {
            error.set(err.message);
            loading.set(false);
        });
    
    return Match(loading, {
        true: LoadingSpinner,
        false: () => Switch(error, ErrorMessage(error), UserProfileView(user) )
    });
};

router.add('/users/{id}', UserProfile, { name: 'user.profile' });
```

### Global Route Guards

```javascript
const authGuard = (context, next) => {
    const { route } = context;
    const protectedRoutes = ['dashboard', 'profile', 'settings'];
    
    if (protectedRoutes.includes(route.name()) && !isAuthenticated()) {
        Router.replace({ 
            name: 'login', 
            query: { redirect: context.path } 
        });
        return;
    }
    
    next();
};

// Add to all routes that need protection
router.group('/', { middlewares: [authGuard] }, () => {
    router.add('/dashboard', Dashboard, { name: 'dashboard' });
    router.add('/profile', Profile, { name: 'profile' });
    router.add('/settings', Settings, { name: 'settings' });
});
```

## Error Handling

Handle routing errors gracefully:

### 404 - Route Not Found

```javascript
const router = Router.create({ mode: 'history' }, (router) => {
    router.add('/', HomePage);
    router.add('/about', AboutPage);
    
    // Catch-all route for 404s (must be last)
    router.add('.*', ({ params }) => 
        NotFoundPage({ attemptedPath: params.path })
    );
});

const NotFoundPage = ({ attemptedPath }) => Div([
    H1('Page Not Found'),
    P(['The page "', attemptedPath, '" could not be found.']),
    Link({ to: '/' }, 'Return Home')
]);
```

### Error Boundaries

```javascript
const errorHandler = (context, next) => {
    try {
        next();
    } catch (error) {
        console.error('Route error:', error);
        
        // Navigate to error page
        Router.replace({
            name: 'error',
            query: { message: error.message }
        });
    }
};

router.add('/error', ({ query }) => 
    ErrorPage({ message: query.message })
);
```

## Real-World Examples

### E-commerce Application

```javascript
const ecommerceRouter = Router.create({ mode: 'history' }, (router) => {
    // Public routes
    router.add('/', HomePage, { name: 'home' });
    router.add('/products', ProductCatalog, { name: 'products' });
    router.add('/products/{category}', CategoryPage, { name: 'category' });
    router.add('/products/{category}/{id}', ProductDetail, { name: 'product' });
    
    // User account routes
    router.group('/account', { middlewares: [requireAuth] }, () => {
        router.add('/', AccountDashboard, { name: 'account.dashboard' });
        router.add('/orders', OrderHistory, { name: 'account.orders' });
        router.add('/profile', UserProfile, { name: 'account.profile' });
        router.add('/addresses', AddressBook, { name: 'account.addresses' });
    });
    
    // Shopping cart
    router.add('/cart', ShoppingCart, { name: 'cart' });
    router.add('/checkout', CheckoutProcess, { name: 'checkout', middlewares: [requireAuth] });
    
    // Search and filters
    router.add('/search', SearchResults, { name: 'search' });
    // URL: /search?q=laptop&category=electronics&price_min=100&price_max=1000
});

// Product component with category navigation
const ProductDetail = ({ params, query }) => {
    const { category, id } = params;
    const product = Observable(null);
    
    loadProduct(id).then(data => product.set(data));
    
    return ShowIf(product, () => {
        const p = product.val();
        return Div([
            // Breadcrumb navigation
            Nav([
                Link({ to: { name: 'home' } }, 'Home'),
                ' > ',
                Link({ to: { name: 'category', params: { category } } }, category),
                ' > ',
                Span(p.name)
            ]),
            
            // Product details
            H1(p.name),
            Div({ class: 'price' }, p.price),
            P(p.description),
            
            // Add to cart with redirect to login if needed
            Button('Add to Cart').nd.on.click(() => {
                if (!isAuthenticated()) {
                    Router.push({
                        name: 'login',
                        query: { 
                            redirect: Router.get().currentState().path 
                        }
                    });
                } else {
                    addToCart(p.id);
                    Router.push({ name: 'cart' });
                }
            })
        ]);
    });
};
```

### Multi-Step Form with Navigation

```javascript
const formRouter = Router.create({ mode: 'hash' }, (router) => {
    const formData = Observable.object({
        step1: { name: '', email: '' },
        step2: { address: '', city: '' },
        step3: { payment: '', terms: false }
    });
    
    router.add('/form/personal', () => 
        PersonalInfoStep(formData), 
        { name: 'form.personal' }
    );
    
    router.add('/form/address', () => 
        AddressStep(formData), 
        { name: 'form.address', middlewares: [validateStep1] }
    );
    
    router.add('/form/payment', () => 
        PaymentStep(formData), 
        { name: 'form.payment', middlewares: [validateStep1, validateStep2] }
    );
    
    router.add('/form/review', () => 
        ReviewStep(formData), 
        { name: 'form.review', middlewares: [validateAllSteps] }
    );
});

const FormNavigation = (currentStep, formData) => {
    const steps = ['personal', 'address', 'payment', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    
    return Div({ class: 'form-navigation' }, [
        // Step indicator
        Div({ class: 'step-indicator' }, 
            steps.map((step, index) => 
                Span({ 
                    class: index <= currentIndex ? 'step active' : 'step'
                }, step)
            )
        ),
        
        // Navigation buttons
        Div({ class: 'nav-buttons' }, [
            ShowIf(Observable(currentIndex > 0), 
                Button('Previous').nd.on.click(() => {
                    const prevStep = steps[currentIndex - 1];
                    Router.push({ name: `form.${prevStep}` });
                })
            ),
            
            ShowIf(Observable(currentIndex < steps.length - 1),
                Button('Next').nd.on.click(() => {
                    const nextStep = steps[currentIndex + 1];
                    Router.push({ name: `form.${nextStep}` });
                })
            ),
            
            ShowIf(Observable(currentIndex === steps.length - 1),
                Button('Submit').nd.on.click(() => {
                    submitForm(formData.$val());
                })
            )
        ])
    ]);
};
```

## Best Practices

1. **Use named routes** for maintainable URL generation
2. **Group related routes** with shared middleware
3. **Validate parameters** to prevent runtime errors
4. **Handle loading states** in data-dependent routes
5. **Implement proper error boundaries** for robust navigation
6. **Use middleware** for cross-cutting concerns like authentication
7. **Keep route components focused** - extract complex logic to separate modules
8. **Test navigation flows** with different router modes

## Next Steps

Explore these related topics to build complete applications:

- **[State Management](docs/state-management.md)** - Global state patterns
- **[Lifecycle Events](docs/lifecycle-events.md)** - Lifecycle events
- **[Memory Management](docs/memory-management.md)** - Memory management
- **[Anchor](docs/anchor.md)** - Anchor