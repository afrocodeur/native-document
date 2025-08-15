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

### Store with Computed Values

```javascript
const cartStore = Store.create('cart', {
    items: [],
    taxRate: 0.08
});

// Computed total that updates automatically
const cartTotal = Observable.computed(() => {
    const cart = cartStore.$value;
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * cart.taxRate;
    return subtotal + tax;
}, [cartStore]);
```

## Using Stores

Access and react to store changes using Store.use() or Store.follow():

### Store.use() - Primary Access Method

```javascript
const UserProfile = () => {
    // Get reactive reference to store
    const user = Store.use('user');
    
    return Div([
        H1(['User Profile: ', user.check(u => u.name)]),
        P(['Email: ', user.check(u => u.email)]),
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

### Store.follow() - Alternative Access

```javascript
const NotificationBadge = () => {
    // Follow is alias for use
    const notifications = Store.follow('notifications');
    
    return ShowIf(notifications.check(list => list.length > 0),
        () => Span({ class: 'badge' }, notifications.$value.length)
    );
};
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
            name: 'User Name' // This would come from API
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

## Real-World Examples

## Store Cleanup

Properly clean up stores when they're no longer needed:

### Manual Cleanup

```javascript
// Remove store and all its subscribers
Store.delete('temporaryStore');

// Clean up specific subscriber
const userStore = Store.use('user');
userStore.destroy(); // Clean up this subscriber instance
```

## Performance Considerations

### Efficient Store Updates

```javascript
// Good: Batch related updates
const updateUserProfile = (name, email, preferences) => {
    const user = Store.use('user');
    user.set({
        ...user.$value,
        name,
        email,
        preferences: {
            ...user.$value.preferences,
            ...preferences
        }
    });
};

// Less efficient: Multiple separate updates
const updateUserProfileSlow = (name, email, preferences) => {
    const user = Store.use('user');
    user.set({ ...user.$value, name });        // Triggers update
    user.set({ ...user.$value, email });       // Triggers update
    user.set({ ...user.$value, preferences }); // Triggers update
};
```

### Selective Subscriptions

```javascript
// Subscribe to specific parts of store
const UserName = () => {
    const user = Store.use('user');
    
    // Only re-render when name changes
    const userName = user.check(u => u.name);
    
    return Span(userName);
};

// More efficient than re-rendering entire user profile
// when only name is needed
```

## Best Practices

### 1. Use Descriptive Store Names

```javascript
// Good: Clear, descriptive names
const userAuthStore = Store.create('userAuth', defaultUser);
const shoppingCartStore = Store.create('shoppingCart', defaultCart);
const appSettingsStore = Store.create('appSettings', defaultSettings);

// Less clear: Generic names
const store1 = Store.create('data', {});
const state = Store.create('state', {});
```

### 2. Initialize with Complete Data Structures

```javascript
// Good: Complete initial structure
const userStore = Store.create('user', {
    id: null,
    name: '',
    email: '',
    preferences: {
        theme: 'light',
        notifications: true
    },
    isLoggedIn: false
});

// Problematic: Incomplete structure
const userStore = Store.create('user', {});
// Later code might fail when accessing user.preferences.theme
```

### 3. Create Service Objects for Complex Operations

```javascript
// Good: Organized actions
const AuthService= (function() {
    const authUser = Store.create('user', {});
  
    return {
        login: (credentials) => { /* ... */ },
        logout: () => { /* ... */ },
        updateProfile: (data) => { /* ... */ },
        updatePreferences: (prefs) => { /* ... */ }
    };
}());

// Instead of scattered update logic throughout components
```

### 4. Use Store for Cross-Component State Only

```javascript
// Good: Local state for component-specific data
const ContactForm = () => {
    const name = Observable('');     // Local state
    const email = Observable('');    // Local state
    const user = Store.use('user');  // Global state
    
    return Form([/* ... */]);
};

// Avoid: Putting everything in stores
// Don't store form input state globally unless shared
```

## Debugging Stores

### Store State Inspection

```javascript
// Log current store state
console.log('Current user:', Store.get('user').$value);

// Monitor store changes
Store.get('user').subscribe(newUser => {
    console.log('User changed:', newUser);
});

// Check all followers of a store
const userData = Store.getWithSubscribers('user');
console.log('Store value:', userData.observer.$value);
console.log('Followers count:', userData.subscribers.size);
```

## Common Patterns

### Persistent Store

```javascript
const createPersistentStore = (name, defaultValue, storageKey) => {
    // Load from localStorage
    const saved = localStorage.getItem(storageKey);
    const initialValue = saved ? JSON.parse(saved) : defaultValue;
    
    const store = Store.create(name, initialValue);
    
    // Save changes to localStorage
    store.subscribe(newValue => {
        localStorage.setItem(storageKey, JSON.stringify(newValue));
    });
    
    return store;
};

// Usage
createPersistentStore('userPreferences', {
    theme: 'light',
    language: 'en'
}, 'app_preferences');
```

### Store Composition

```javascript
// Combine multiple stores for complex state
const createAppState = () => {
    const auth = Store.create('auth', defaultAuth);
    const cart = Store.create('cart', defaultCart);
    const settings = Store.create('settings', defaultSettings);
    
    // Computed store that combines others
    const appStatus = Observable.computed(() => {
        return {
            isLoggedIn: auth.$value.user !== null,
            cartItems: cart.$value.items.length,
            theme: settings.$value.theme
        };
    }, [auth, cart, settings]);
    
    return { auth, cart, settings, appStatus };
};
```

## Next Steps

Now that you understand state management, explore these related topics:

- **[Lifecycle Events](lifecycle-events.md)** - Lifecycle events
- **[Memory Management](memory-management.md)** - Memory management
- **[Anchor](anchor.md)** - Anchor