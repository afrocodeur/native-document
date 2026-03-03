# State Management

NativeDocument's state management system provides tools for managing application-wide state that persists across components and route changes. The Store system enables shared state with reactive updates, while Observables handle local component state.

## Understanding State Management

State management in NativeDocument operates on two levels: local component state using Observables, and global application state using the Store system. The Store allows multiple components to share and react to the same state changes.

```javascript
import { Store, Observable } from 'native-document';

// Create global state
const userStore = Store.create('user', {
    id: null,
    name: '',
    email: '',
    isLoggedIn: false
});

// Components automatically update when store changes
const UserGreeting = () => {
    const user = Store.use('user');
    
    return ShowIf(user.check(u => u.isLoggedIn),
        () => Div(['Welcome back, ', user.$value.name, '!'])
    );
};
```

## Store Creation

Create named stores that can be accessed from anywhere in your application:

### Basic Store Creation

```javascript
// Create a simple store
const themeStore = Store.create('theme', 'light');

// Create an object store
const appStore = Store.create('app', {
    currentPage: 'home',
    sidebarOpen: false,
    notifications: []
});

// Create with initial complex data
const cartStore = Store.create('cart', {
    items: [],
    total: 0,
    currency: 'USD',
    discountCode: null
});
```

### Resettable Store

Use `createResettable()` when the store needs to return to its initial value — for example on logout or route change.
```javascript
const userStore = Store.createResettable('user', {
    id: null,
    name: '',
    email: '',
    isLoggedIn: false
});

// Reset to initial value at any time
Store.reset('user');
// -> { id: null, name: '', email: '', isLoggedIn: false }
// -> all subscribers are notified automatically

// Standard create() does not support reset
Store.reset('theme'); // ❌ throws : this store is not resettable
```

### Store with Computed Values

For a computed value that stays local, use `Observable.computed()` :
```javascript
const cartTotal = Observable.computed(() => {
    const cart = cartStore.val();
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return subtotal + (subtotal * cart.taxRate);
}, [cartStore]);
```

For a computed value that must be accessible globally via the Store registry, use `createComposed()` :
```javascript
Store.create('products', [{ id: 1, price: 10 }]);
Store.create('cart', [{ productId: 1, quantity: 2 }]);

Store.createComposed('total', () => {
    const products = Store.get('products').val();
    const cart     = Store.get('cart').val();
    return cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product.price * item.quantity);
    }, 0);
}, ['products', 'cart']);

// Access like any other store — read-only
const total = Store.follow('total');
total.val(); // -> 20

// Store.use('total') -> ❌ throws : composed stores are read-only
// Store.reset('total') -> ❌ throws : composed stores cannot be reset
```
### Store Groups

Use `Store.group()` to create an isolated store namespace. Each group is a fully independent `StoreFactory` instance — no key conflicts, no shared state with the parent store.
```javascript
const EventStore = Store.group('events', (group) => {
    group.create('catalog', []);
    group.create('filters', { category: null, date: null, city: null });
    
    group.createResettable('selected', null);
    
    group.createComposed('filtered', () => {
        const catalog = EventStore.get('catalog').val();
        const filters = EventStore.get('filters').val();
        return catalog.filter(event => {
            if (filters.category && event.category !== filters.category) return false;
            if (filters.city     && event.city     !== filters.city)     return false;
            return true;
        });
    }, ['catalog', 'filters']);
});

// Usage — same API as Store
EventStore.use('catalog');      // two-way follower
EventStore.follow('filtered');  // read-only follower
EventStore.get('filters');      // raw observable

// Direct property access — raw observable, always read-only
EventStore.catalog;
EventStore.filters;
```

Groups can reference each other in `createComposed()` for cross-group derived state:
```javascript
const CartStore = Store.group('cart', (group) => {
    group.create('items', []);
    
    group.createComposed('total', () => {
        return CartStore.get('items').val()
            .reduce((sum, item) => sum + item.price * item.qty, 0);
    }, ['items']);
});

const OrderStore = Store.group('orders', (group) => {
    group.createComposed('summary', () => {
        const items  = CartStore.get('items').val();
        const events = EventStore.get('catalog').val();
        return { items, events };
    }, [CartStore.get('items'), EventStore.get('catalog')]);
});
```

Groups can also be created without a name:
```javascript
const CartStore = Store.group((group) => {
    group.create('items', []);
});
```

### Use Groups to Organize Domain State
```javascript
// Good: domain-driven grouping
const UserStore  = Store.group('user',   (g) => { g.create('session', null); });
const EventStore = Store.group('events', (g) => { g.create('catalog', []); });
const CartStore  = Store.group('cart',   (g) => { g.create('items', []); });

// Avoid: flat global stores for everything
Store.create('userSession',   null);
Store.create('eventCatalog',  []);
Store.create('cartItems',     []);
```


## Using Stores

Access and react to store changes using Store.use() or Store.follow():

### Store.use() - Primary Access Method

```javascript
const UserProfile = () => {
    // Get reactive reference to store
    const user = Store.use('user');
    
    return Div([
        H1(['User Profile: ', user.name]),
        P(['Email: ', user.email]),
        P(['Status: ', user.check(u => u.isLoggedIn ? 'Online' : 'Offline')])
    ]);
};

// Multiple components can use the same store
const UserMenu = () => {
    const user = Store.use('user');
    
    return Nav([
        ShowIf(user.check(u => u.isLoggedIn), [
            Link({ to: '/profile' }, 'My Profile'),
            Button('Logout').nd.onClick(() => {
                user.set({ ...user.$value, isLoggedIn: false });
            })
        ])
    ]);
};
```

### Store.follow() - Read-only Access

```javascript
const NotificationBadge = () => {
    // Follow returns a read-only reference — any attempt to call
    // .set(), .toggle() or .reset() will throw a NativeDocumentError.
    // Use this when a component should only read from the store.
    const notifications = Store.follow('notifications');
    // notifications.set(...) -> ❌ throws NativeDocumentError
    
    return ShowIf(notifications.check(list => list.length > 0),
        () => Span({ class: 'badge' }, notifications.$value.length)
    );
};
```

### Store.get() - Raw Access

Returns the raw store observable directly — no follower, no cleanup contract. Use this for direct read access when you don't need to unsubscribe.

> **Warning:** mutations on this observer impact all subscribers immediately.
```javascript
const userStore = Store.get('user');

if (userStore.$value.isLoggedIn) {
    console.log('User is logged in');
}

userStore.subscribe(newUser => {
    console.log('User changed:', newUser);
});
```

### Direct Property Access

Stores and groups expose their observables as direct properties via a Proxy. Property access returns the raw observable — equivalent to calling `Store.get()`. Any attempt to assign or delete a property will throw.
```javascript
// Equivalent to Store.get('catalog')
EventStore.catalog;

// For a read-only follower, use follow() explicitly
EventStore.follow('catalog');

// Direct assignment is forbidden
EventStore.catalog = []; // ❌ throws : Store structure is immutable
delete EventStore.catalog; // ❌ throws : Store keys cannot be deleted
```

## Updating Store State

Modify store state using the returned observable's methods:

### Direct Updates

```javascript
const ThemeToggle = () => {
    const theme = Store.use('theme');
    
    return Button('Toggle Theme').nd.onClick(() => {
        const current = theme.$value;
        theme.set(current === 'light' ? 'dark' : 'light');
    });
};
```

### Object Store Updates

```javascript
const LoginForm = () => {
    const user = Store.use('user');
    const email = Observable('');
    const password = Observable('');
    
    const handleLogin = () => {
        // Update multiple properties
        user.set({
            ...user.$value,
            email: email.$value,
            isLoggedIn: true,
            name: 'User Name' // ...
        });
    };
    
    return Form([
        Input({ type: 'email', value: email, placeholder: 'Email' }),
        Input({ type: 'password', value: password, placeholder: 'Password' }),
        Button('Login').nd.onClick(handleLogin)
    ]);
};
```

### Partial Updates

```javascript
const UserSettings = () => {
    const user = Store.use('user');
    
    const updateName = (newName) => {
        // Only update specific fields
        user.set({
            ...user.$value,
            name: newName
        });
    };
    
    const updatePreferences = (prefs) => {
        user.set({
            ...user.$value,
            preferences: {
                ...user.$value.preferences,
                ...prefs
            }
        });
    };
    
    return Div([
        Input({ 
            value: user.check(u => u.name),
            placeholder: 'Name'
        }).nd.onInput(e => updateName(e.target.value)),
        
        Button('Dark Mode').nd.onClick(() => 
            updatePreferences({ theme: 'dark' })
        )
    ]);
};
```

## Store Access Patterns

### Direct Store Access

```javascript
// Get store reference without reactivity
const userStore = Store.get('user');

// Check current value
if (userStore.$value.isLoggedIn) {
    console.log('User is logged in');
}

// Subscribe to changes manually
userStore.subscribe(newUser => {
    console.log('User changed:', newUser);
});
```

### Checking Store Existence
```javascript
// Check if a store exists before accessing it
if (Store.has('cart')) {
    const cart = Store.use('cart');
    // ...
}

// Typical use case : dynamic module initialization
if (!Store.has('cart')) {
    Store.create('cart', { items: [], total: 0 });
}
```

### Store Composition

```javascript
// Combine multiple stores for complex state
const createAppState = () => {
    const auth = Store.create('auth', defaultAuth);
    const cart = Store.create('cart', defaultCart);
    const settings = Store.create('settings', defaultSettings);
    
    // Computed store that combines others
    Store.createComposed('appStatus', () => ({
        isLoggedIn: Store.get('auth').val().user !== null,
        cartItems:  Store.get('cart').val().items.length,
        theme:      Store.get('settings').val().theme
    }), ['auth', 'cart', 'settings']);
    
    return { auth, cart, settings, appStatus };
};
```

## Next Steps

Now that you understand state management, explore these related topics:

- **[Lifecycle Events](lifecycle-events.md)** - Lifecycle events
- **[NDElement](native-document-element.md)** - Native Document Element
- **[Extending NDElement](extending-native-document-element.md)** - Custom Methods Guide
- **[Args Validation](validation.md)** - Function Argument Validation
- **[Memory Management](memory-management.md)** - Memory management
- **[Anchor](anchor.md)** - Anchor

## Utilities

- **[Cache](docs/utils/cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](docs/utils/native-fetch.md)** - HTTP client with interceptors
- **[Filters](docs/utils/filters.md)** - Data filtering helpers
