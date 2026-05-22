---
title: State Management
description: Manage application-wide state with NativeDocument's Store system - groups, persistence, computed stores, and reactive updates
---

# State Management

NativeDocument's state management operates on two levels: local component state using Observables, and global application state using the Store system. The Store allows multiple components to share and react to the same state changes.

```javascript
import { Store, Observable } from 'native-document';

const userStore = Store.create('user', {
    id: null,
    name: '',
    email: '',
    isLoggedIn: false
});

const UserGreeting = () => {
    const user = Store.use('user');
    return ShowIf(user.is(u => u.isLoggedIn),
        () => Div(['Welcome back, ', user.$value.name, '!'])
    );
};
```

---

## Store Creation

### `Store.create(name, initialValue)`

```javascript
Store.create('theme', 'light');

Store.create('app', {
    currentPage: 'home',
    sidebarOpen: false,
    notifications: []
});
```

### `Store.createResettable(name, initialValue)`

Use when the store needs to return to its initial value - for example on logout or route change:

```javascript
const userStore = Store.createResettable('user', {
    id: null,
    name: '',
    email: '',
    isLoggedIn: false
});

Store.reset('user');
// -> { id: null, name: '', email: '', isLoggedIn: false }
// -> all subscribers are notified automatically

// Standard create() does not support reset
Store.reset('theme'); // throws - this store is not resettable
```

### `Store.createComposed(name, fn, deps)`

For a computed value accessible globally via the Store registry:

```javascript
Store.create('products', [{ id: 1, price: 10 }]);
Store.create('cart',     [{ productId: 1, quantity: 2 }]);

Store.createComposed('total', () => {
    const products = Store.get('products').val();
    const cart     = Store.get('cart').val();
    return cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product.price * item.quantity);
    }, 0);
}, ['products', 'cart']);

const total = Store.follow('total');
total.val(); // 20

// Store.use('total')  -> throws - composed stores are read-only
// Store.reset('total') -> throws - composed stores cannot be reset
```

For a computed value that stays local to a component, use `Observable.computed()` instead - see [Observables](./observables.md).

### `Store.createPersistent(name, initialValue, storageKey?)`

Automatically saved to localStorage on every change and restored on page load:

```javascript
Store.createPersistent('theme', 'light');
Store.get('theme').set('dark'); // saved automatically

// On next page load
Store.get('theme').val(); // "dark" - restored

// Optional custom localStorage key
Store.createPersistent('theme', 'light', 'app:theme');
```

### `Store.createPersistentResettable(name, initialValue, storageKey?)`

Both persistent and resettable. Reset clears localStorage and restores the default:

```javascript
const session = Store.createPersistentResettable('session', { id: null, name: '' });
session.set({ id: 1, name: 'John' }); // saved

Store.reset('session');
// -> { id: null, name: '' }
// -> localStorage entry removed
```

---

## Store Groups

`Store.group()` creates an isolated namespace. Each group is a fully independent `StoreFactory` instance - no key conflicts, no shared state with the parent store:

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

// Same API as Store
EventStore.use('catalog');      // two-way follower
EventStore.follow('filtered');  // read-only follower
EventStore.get('filters');      // raw observable

// Direct property access - raw observable, always read-only
EventStore.catalog;
EventStore.filters;
```

Groups can reference each other in `createComposed()`:

```javascript
const CartStore = Store.group('cart', (group) => {
    group.create('items', []);
    group.createComposed('total', () => {
        return CartStore.get('items').val()
            .reduce((sum, item) => sum + item.price * item.qty, 0);
    }, ['items']);
});

const OrderStore = Store.group('orders', (group) => {
    group.createComposed('summary', () => ({
        items:  CartStore.get('items').val(),
        events: EventStore.get('catalog').val()
    }), [CartStore.get('items'), EventStore.get('catalog')]);
});
```

Groups can be created without a name:

```javascript
const CartStore = Store.group((group) => {
    group.create('items', []);
});
```

Use groups to organize state by domain:

```javascript
// Good - domain-driven grouping
const UserStore  = Store.group('user',   g => g.create('session', null));
const EventStore = Store.group('events', g => g.create('catalog', []));
const CartStore  = Store.group('cart',   g => g.create('items', []));

// Avoid - flat global stores for everything
Store.create('userSession',  null);
Store.create('eventCatalog', []);
Store.create('cartItems',    []);
```

---

## Accessing Stores

### `Store.use(name)` - Two-way reactive

Returns a reactive reference. The observable's `.set()` method is inherited from `Observable` - any change notifies all subscribers:

```javascript
const UserProfile = () => {
    const user = Store.use('user');

    return Div([
        H1(['User Profile: ', user.select(u => u.name)]),
        P(['Email: ', user.select(u => u.email)]),
        P(['Status: ', user.format(u => u.isLoggedIn ? 'Online' : 'Offline')])
    ]);
};
```

### `Store.follow(name)` - Read-only reactive

Any attempt to call `.set()`, `.toggle()`, or `.reset()` throws a `NativeDocumentError`:

```javascript
const NotificationBadge = () => {
    const notifications = Store.follow('notifications');
    // notifications.set(...) -> throws NativeDocumentError

    return ShowIf(notifications.isNotEmpty(),
        () => Span({ class: 'badge' }, notifications.toLength())
    );
};
```

### `Store.get(name)` - Raw observable

Returns the raw store observable directly - no follower, no cleanup contract:

```javascript
const userStore = Store.get('user');

if (userStore.$value.isLoggedIn) {
    console.log('User is logged in');
}

userStore.subscribe(newUser => {
    console.log('User changed:', newUser);
});
```

> Mutations on a raw observable from `Store.get()` impact all subscribers immediately.

### Direct property access

Stores and groups expose their observables as direct properties via a Proxy - equivalent to `Store.get()`:

```javascript
EventStore.catalog;  // same as EventStore.get('catalog')

// Assignment and deletion are forbidden
EventStore.catalog = [];    // throws - Store structure is immutable
delete EventStore.catalog;  // throws - Store keys cannot be deleted
```

---

## Updating Store State

`.set()` is inherited from `Observable` and works the same way:

```javascript
// Direct value
const theme = Store.use('theme');
theme.set('dark');
theme.toggle(); // for boolean stores

// Function update
const counter = Store.use('counter');
counter.set(current => current + 1);

// Object spread
const user = Store.use('user');
user.set({ ...user.$value, name: 'Alice', isLoggedIn: true });
```

---

## Other Store Methods

### `Store.has(name)`

Check if a store exists before accessing it:

```javascript
if (Store.has('cart')) {
    const cart = Store.use('cart');
}

// Typical use: dynamic module initialization
if (!Store.has('cart')) {
    Store.create('cart', { items: [], total: 0 });
}
```

### `Store.delete(name)`

Destroys a store - cleans up all followers and the observable, then removes it from the registry:

```javascript
Store.delete('session'); // cleans up all subscribers and removes the store
```

> After deletion, any existing follower references become stale. Always check with `Store.has()` before accessing a store that may have been deleted.

### `Store.reset(name)`

Resets a resettable store to its initial value:

```javascript
Store.reset('user');    // works - created with createResettable()
Store.reset('theme');   // throws - created with create()
```

---

## Next Steps

- **[Observables](./observables.md)** - Local state and reactive primitives
- **[Lifecycle Events](./lifecycle-events.md)** - Lifecycle events
- **[NDElement](./native-document-element.md)** - Native Document Element
- **[Args Validation](./validation.md)** - Function argument validation
- **[Memory Management](./memory-management.md)** - Memory management

## Utilities

- **[Cache](./cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](./native-fetch.md)** - HTTP client with interceptors
- **[Filters](./filters.md)** - Data filtering helpers