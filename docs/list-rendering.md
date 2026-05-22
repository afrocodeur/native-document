---
title: List Rendering
description: Efficiently render dynamic collections with ForEach and ForEachArray - automatic DOM updates, keyed diffing, and reactive filtering
---

# List Rendering

NativeDocument provides two functions for rendering dynamic collections: `ForEach` for generic iteration over arrays and objects, and `ForEachArray` for high-performance array-specific operations.

```javascript
import { ForEach, ForEachArray } from 'native-document/elements';
```

---

## `ForEach` - Generic Collection Rendering

`ForEach` works with both observable arrays and observable objects.

```javascript
ForEach(data, callback, key?, options?)
```

### Array iteration

```javascript
const fruits = Observable.array(['Apple', 'Banana', 'Cherry']);

Ul(
    ForEach(fruits, fruit => Li(fruit))
)

// All array operations trigger DOM updates
fruits.push('Orange');
fruits.splice(1, 1);
fruits.sort();
```

### Object iteration

```javascript
const roles = Observable({
    admin:  'Administrator',
    editor: 'Content Editor',
    viewer: 'Read Only'
});

Ul(
    ForEach(roles, (roleName, roleKey) =>
        Li([Strong(roleKey), ': ', roleName])
    )
)
```

### Index parameter

The second callback argument is an **observable** tracking the item's current index:

```javascript
const tasks = Observable.array(['Review PRs', 'Update docs', 'Fix bugs']);

Ol(ForEach(tasks, (task, index) =>
    Li([
        Strong(index.transform(i => i + 1)), '. ',
        task,
        Button('Remove').nd.onClick(() => tasks.remove(index.val()))
    ])
))
```

### Key function

Use a key to help NativeDocument identify items for efficient reordering. Pass a property name string or a function:

```javascript
const users = Observable.array([
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob',   role: 'user' }
]);

// Property name shorthand
ForEach(users, user => Div(user.name), 'id')

// Function
ForEach(users, user => Div(user.name), item => item.id)
```

### Options

```javascript
ForEach(data, callback, key, { shouldKeepItemsInCache: true })
```

`shouldKeepItemsInCache` - when `true`, rendered items stay in cache even when removed. Useful when items toggle frequently:

```javascript
// Items are cached - re-adding won't re-render them
ForEach(items, renderItem, 'id', { shouldKeepItemsInCache: true })
```

---

## `ForEachArray` - High-Performance Array Rendering

`ForEachArray` is specifically optimized for arrays of objects. Use it when performance matters.

```javascript
ForEachArray(data, callback, configs?)
```

```javascript
const messages = Observable.array([
    { id: 1, text: 'Hello!',    timestamp: Date.now() },
    { id: 2, text: 'How are you?', timestamp: Date.now() + 1000 }
]);

Div({ class: 'chat' },
    ForEachArray(messages, message =>
        Div({ class: 'message' }, [
            Div(message.text),
            Div(new Date(message.timestamp).toLocaleTimeString())
        ])
    )
)
```

### Index in `ForEachArray`

The index is a **computed observable** derived from the array - always reactive, no need to call `.val()` to use it in the DOM:

```javascript
ForEachArray(playlist, (song, index) =>
    Div([
        index.transform(i => i + 1), '. ',
        song.title,
        Button('Up').nd.onClick(() => {
            const i = index.$value;
            if (i > 0) {
                playlist.swap(i, i - 1);
            }
        }),
        Button('Down').nd.onClick(() => {
            const i = index.$value;
            if (i < playlist.val().length - 1) {
                playlist.swap(i, i + 1);
            }
        }),
        Button('Remove').nd.onClick(() => playlist.remove(index.$value))
    ])
)
```

### Configs

```javascript
ForEachArray(data, callback, {
    shouldKeepItemsInCache: false, // same as ForEach
    pushDelay: (items) => items.length > 100 ? 50 : 0 // throttle large batch inserts
})
```

---

## Choosing Between `ForEach` and `ForEachArray`

| | `ForEach` | `ForEachArray` |
|---|---|---|
| Arrays of objects | yes | yes (optimized) |
| Arrays of primitives | yes | yes |
| Object (non-array) iteration | yes | no |
| Index is observable | yes | yes (computed) |
| Key argument | third arg (string/fn) | inside configs |
| Best for | objects, primitives, small lists | large or frequently updated arrays |

---

## Filtering with `.where()`

`.where()` is available on `ObservableArray` only. It returns a new live `ObservableArray` that re-filters automatically. See [Observables](./observables.md) for the full `.where()` reference.

```javascript
import { equals, greaterThan, lessThan, between, includes, match,
         startsWith, endsWith, inArray, notIn, custom,
         and, or, not } from 'native-document/filters';

const products = Observable.array([
    { id: 1, name: 'Phone',  price: 599, inStock: true,  category: 'electronics' },
    { id: 2, name: 'Laptop', price: 999, inStock: false, category: 'electronics' },
    { id: 3, name: 'Book',   price: 29,  inStock: true,  category: 'books' }
]);
```

### Comparison

```javascript
products.where({ price: greaterThan(500) })
products.where({ price: lessThan(100) })
products.where({ price: between(200, 800) })
products.where({ inStock: equals(true) })
products.where({ name: notEquals('Phone') })
```

### String

```javascript
products.where({ name: includes('phone') })     // case-insensitive by default
products.where({ name: startsWith('P') })
products.where({ name: endsWith('book') })
products.where({ name: match(/^[A-Z]/) })        // regex
products.where({ name: match('lap', false) })    // plain string, no regex
```

### Array membership

```javascript
const allowed = Observable.array(['electronics', 'books']);

products.where({ category: inArray(allowed) })   // reactive
products.where({ category: notIn(['clothing']) })
```

### Reactive filters

Pass an observable as the filter value - re-filters automatically when it changes:

```javascript
const search   = Observable('');
const minPrice = Observable(0);
const maxPrice = Observable(1000);

const filtered = products.where({
    name:  includes(search),
    price: between(minPrice, maxPrice)
});
```

### Custom filter

```javascript
const minRating = Observable(4);

products.where({
    _: custom((product, min) => {
        return product.rating >= min && product.reviews > 10;
    }, minRating) // observables passed as extra args
})
```

### Combining

```javascript
// and - field must pass ALL conditions
products.where({ price: and(greaterThan(100), lessThan(500)) })

// or - field must pass AT LEAST ONE
products.where({ category: or(equals('electronics'), equals('books')) })

// not - invert
products.where({ inStock: not(equals(true)) })

// cross-field - use _ key with plain function
products.where({
    _: item => item.inStock && item.price < 500
})
```

### Date and time filters

```javascript
import { dateEquals, dateBefore, dateAfter, dateBetween,
    timeBefore, timeBetween } from 'native-document/filters';

const events = Observable.array([
    { name: 'Meeting',    date: '2024-03-15' },
    { name: 'Conference', date: '2024-06-20' }
]);

events.where({ date: dateAfter(new Date()) })
events.where({ date: dateBetween('2024-06-01', '2024-08-31') })
events.where({ date: timeBetween(
        new Date('2024-01-01 09:00:00'),
        new Date('2024-01-01 17:00:00')
    )})
```

---

## Common Patterns

### Empty state

```javascript
const items = Observable.array([]);

Div([
    ShowIf(items.isEmpty(), Div({ class: 'empty' }, 'No items yet')),
    ForEachArray(items, item => ItemComponent(item))
])
```

### Search + filter

```javascript
const search   = Observable('');
const category = Observable('all');

const filtered = products.where({
    name:     includes(search),
    category: or(equals('all'), equals(category))
});

Div([
    Input({ placeholder: 'Search...', value: search }),
    ForEachArray(filtered, product => ProductCard(product))
])
```

### Drag-and-drop reordering

```javascript
let draggedIndex = null;

ForEachArray(items, (item, index) =>
    Div({ class: 'item', draggable: true }, item.text)
        .nd
        .onDragStart(() => { draggedIndex = index.$value; })
        .onDragOver(e => e.preventDefault())
        .onDrop(e => {
            e.preventDefault();
            const dropIndex = index.$value;
            if (draggedIndex !== null && draggedIndex !== dropIndex) {
                items.swap(draggedIndex, dropIndex);
            }
            draggedIndex = null;
        })
)
```

### Infinite scroll

```javascript
const items     = Observable.array([]);
const isLoading = Observable(false);
const hasMore   = Observable(true);

const loadMore = async () => {
    if (isLoading.val()) return;
    isLoading.set(true);
    const next = await fetchItems(items.val().length);
    next.length ? items.merge(next) : hasMore.set(false);
    isLoading.set(false);
};

Div([
    ForEachArray(items, item => ItemComponent(item)),
    ShowIf(isLoading.isTruthy(), Div('Loading...')),
    ShowIf(hasMore.isTruthy(),
        Button('Load more').nd.onClick(loadMore)
    )
])
```

---

## Best Practices

1. Use `ForEachArray` for arrays of objects - it's optimized for that case
2. Use `ForEach` for objects (non-array) and arrays of primitives
3. Always pass a key when items can be reordered - avoids unnecessary re-rendering
4. Use `.where()` for filtering instead of filtering inside the callback
5. Use `shouldKeepItemsInCache: true` when items toggle in and out frequently
6. Never mutate `.val()` directly - use observable array methods (`push`, `splice`, `swap`, etc.)

---

## Next Steps

- **[Conditional Rendering](./conditional-rendering.md)** - ShowIf, Match, Switch
- **[Observables](./observables.md)** - Observable arrays and `.where()` in depth
- **[Advanced Components](./advanced-components.md)** - `ForEachArray` with `useCache`
- **[Filters](./filters.md)** - Full filter reference

## Utilities

- **[Cache](./cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](./native-fetch.md)** - HTTP client with interceptors
- **[Filters](./filters.md)** - Data filtering helpers