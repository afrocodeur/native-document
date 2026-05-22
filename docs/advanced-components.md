---
title: Advanced Components
description: Optimize rendering performance with useCache and useSingleton - template cloning and data binding for high-performance lists and layouts
---

# Advanced Components

NativeDocument provides advanced component patterns for optimizing rendering performance through template cloning and data binding. The `useCache()` utility creates reusable component templates with a binding system that efficiently updates only the dynamic parts.

## Overview

- **`useCache(fn)`** - Create cached components with data binding
- **`useSingleton(fn)`** - Create singleton views with updatable sections
- **Binder API** - Data binding system for templates

## Import

```javascript
import { useCache, useSingleton } from 'native-document';
import { ForEachArray } from 'native-document/elements';
```

---

## `useCache()` - Cached Components with Binding

`useCache()` creates a component template that is built once and then cloned efficiently. The component function receives a **binder** object (`$binder`) that creates bindings for dynamic data.

### Basic Concept

```javascript
import { useCache } from 'native-document';
import { Div, Span } from 'native-document/elements';

const UserCard = useCache(($binder) => {
    const name = $binder.value('name');
    const age  = $binder.value('age');

    return Div({ class: 'user-card' }, [
        Span('Name: '),
        Span(name),
        Span(' - Age: '),
        Span(age)
    ]);
});

const card1 = UserCard({ name: 'Alice', age: 25 });
const card2 = UserCard({ name: 'Bob',   age: 30 });
// card2 is cloned from the template - bindings update automatically
```

---

## Binder Methods

### `$binder.name` - Property shorthand (Proxy)

`$binder` is a Proxy. Any property access that is not a known method is automatically treated as `$binder.value('propertyName')`:

```javascript
const name  = $binder.name;   // same as $binder.value('name')
const price = $binder.price;  // same as $binder.value('price')
const stock = $binder.stock;  // same as $binder.value('stock')
```

> The shorthand only works for property names. For transform functions you still need `$binder.value(fn)`.

### `$binder.value(key | fn)` / `$binder.property(key | fn)` / `$binder.text(key | fn)`

Bind to a property by name, or use a transform function. `property()` and `text()` are aliases for `value()`:

```javascript
const ProductCard = useCache(($binder) => {
    // Shorthand via Proxy
    const name  = $binder.name;
    const stock = $binder.stock;

    // Transform function - receives the full data object
    const formattedPrice = $binder.value(product => `$${product.price.toFixed(2)}`);
    const status         = $binder.value(product => product.stock > 0 ? 'In Stock' : 'Out of Stock');

    return Div({ class: 'product-card' }, [
        Span({ class: 'name' },   name),
        Span({ class: 'price' },  formattedPrice),
        Span({ class: 'status' }, status)
    ]);
});

ProductCard({ name: 'Phone', price: 599, stock: 10 });
// -> Phone, $599.00, In Stock
```

### `$binder.class(fn)`

Bind CSS classes dynamically. The function returns a boolean:

```javascript
const TaskItem = useCache(($binder) => {
    const text          = $binder.value('text');
    const completedClass = $binder.class(task => task.completed);
    const priorityClass  = $binder.class(task => task.priority === 'high');

    return Div({
        class: {
            'task':          true,
            'completed':     completedClass,
            'high-priority': priorityClass
        }
    }, [Span(text)]);
});

TaskItem({ text: 'Fix bug', completed: true, priority: 'high' });
// -> <div class="task completed high-priority">...</div>
```

Combine with `Observable.when()` for reactive class binding:

```javascript
import { Observable } from 'native-document';
import { Tr, Td } from 'native-document/elements';

const selectedId = Observable(null);

const TableRow = useCache(($binder) => {
    const id   = $binder.value('id');
    const name = $binder.value('name');

    // Updates automatically when selectedId changes
    const isSelected = $binder.class(item => selectedId.when(item.id));

    return Tr({ class: { 'selected': isSelected } }, [
        Td(id),
        Td(name)
    ]);
});

selectedId.set(1); // row with id 1 gets 'selected' class
selectedId.set(2); // row 2 selected, row 1 loses the class
```

### `$binder.style(fn)`

Bind inline style values:

```javascript
const ProgressBar = useCache(($binder) => {
    const widthStyle = $binder.style(p => p.percentage + '%');
    const colorStyle = $binder.style(p => p.percentage >= 100 ? 'green' : 'blue');

    return Div({ class: 'progress-bar' }, [
        Div({
            class: 'progress-fill',
            style: {
                width:           widthStyle,
                backgroundColor: colorStyle
            }
        })
    ]);
});

ProgressBar({ percentage: 75 });
// -> <div style="width: 75%; background-color: blue"></div>
```

### `$binder.attr(fn)`

Bind element attributes. Takes only a function:

```javascript
import { Img, Link } from 'native-document/elements';

const ProductCard = useCache(($binder) => {
    const name       = $binder.value('name');
    const imageSrc   = $binder.attr(product => product.imageUrl);
    const detailHref = $binder.attr(product => `/products/${product.id}`);

    return Div({ class: 'product' }, [
        Img({ src: imageSrc }),
        Link({ href: detailHref }, name)
    ]);
});

ProductCard({ id: 123, name: 'Phone', imageUrl: '/images/phone.jpg' });
// -> <img src="/images/phone.jpg">
// -> <a href="/products/123">Phone</a>
```

### `$binder.attach(fn)` + `.nd.attach()`

Bind event handlers. The handler receives `(...userArguments, event)` - user data comes first, the DOM event is last. Use `.nd.attach()` on the element to connect it:

```javascript
import { Div, Button, Span } from 'native-document/elements';

const TodoItem = useCache(($binder) => {
    const text = $binder.value('text');

    const handleToggle = $binder.attach((todo, event) => {
        updateTodo(todo.id, { completed: !todo.completed });
    });

    const handleDelete = $binder.attach((todo, event) => {
        deleteTodo(todo.id);
    });

    return Div({ class: 'todo' }, [
        Span(text)
            .nd.attach('onClick', handleToggle),
        Button('Delete')
            .nd.attach('onClick', handleDelete)
    ]);
});

TodoItem({ id: 1, text: 'Buy milk', completed: false });
```

### Multiple Arguments

When calling a cached component with multiple arguments, binder functions receive all of them:

```javascript
const ArticleCard = useCache(($binder) => {
    const title = $binder.value((article, options) => {
        return options.uppercase ? article.title.toUpperCase() : article.title;
    });

    const excerpt = $binder.value((article, options) => {
        const length = options.excerptLength || 100;
        return article.content.substring(0, length) + '...';
    });

    return Div({ class: 'article' }, [H3(title), P(excerpt)]);
});

ArticleCard(
    { title: 'My Article', content: 'Long content...' },
    { uppercase: true, excerptLength: 150 }
);
```

---

## Binder API Reference

| Method | Parameters | Description |
|---|---|---|
| `$binder.name` | property name | Proxy shorthand for `$binder.value('name')` |
| `$binder.value(key)` | `key: string` | Bind to property by name |
| `$binder.value(fn)` | `fn: (...args) => any` | Bind with transform function |
| `$binder.property(key \| fn)` | same as `value` | Alias for `value()` |
| `$binder.text(key \| fn)` | same as `value` | Alias for `value()` |
| `$binder.class(fn)` | `fn: (...args) => boolean` | Bind CSS class toggle |
| `$binder.style(fn)` | `fn: (...args) => string` | Bind inline style value |
| `$binder.attr(fn)` | `fn: (...args) => string` | Bind attribute value |
| `$binder.attach(fn)` | `fn: (event, ...args) => void` | Bind event handler |
| `$binder.callback(fn)` | same as `attach` | Alias for `attach()` |

> All binder methods receive arguments exactly as passed by the caller. `attach` pre-binds user arguments first - the handler signature is `(...userArguments, event)`, so data comes before the DOM event.

---

## Complete Example

A cached table row using `ForEachArray`:

```javascript
import { useCache } from 'native-document';
import { ForEachArray, Tr, Td, Link, Button, TBody } from 'native-document/elements';
import { Observable } from 'native-document';

const AppService = {
    data:     Observable.array([
        { id: 1, label: 'Item 1' },
        { id: 2, label: 'Item 2' },
        { id: 3, label: 'Item 3' }
    ]),
    selected: Observable(null),

    select(id)  { this.selected.set(id); },
    remove(id)  {
        const index = this.data.val().findIndex(item => item.id === id);
        if (index > -1) this.data.remove(index);
    }
};

const TableRowBuilder = useCache(($binder) => {
    const isSelected = $binder.class(item => AppService.selected.when(item.id));
    const id    = $binder.id;
    const label = $binder.label;
    const rowClick    = $binder.attach((item, event) => AppService.select(item.id));
    const removeClick = $binder.attach((item, event) => AppService.remove(item.id));

    return Tr({ class: { 'selected': isSelected } }, [
        Td({ class: 'col-md-1' }, id),
        Td({ class: 'col-md-4' },
            Link(label).nd.attach('onClick', rowClick)
        ),
        Td({ class: 'col-md-1' },
            Button('x').nd.attach('onClick', removeClick)
        ),
        Td({ class: 'col-md-6' })
    ]);
});

const TableBody = TBody(ForEachArray(AppService.data, TableRowBuilder));
```

---

## `useSingleton()` - Singleton Views

`useSingleton()` returns a **function**. The first call (no args) renders and returns the cached DOM node. Subsequent calls accept an object with named section keys to update only the sections you want:

### Basic Usage

```javascript
import { useSingleton } from 'native-document';
import { Div, H1 } from 'native-document/elements';

const AppLayout = useSingleton((view) => {
    return Div({ class: 'dashboard' }, [
        H1('Dashboard'),
        view.createSection('content'),
        Div({ class: 'footer' }, 'Footer')
    ]);
});

// First call - renders the cached DOM node
const layout = AppLayout();
document.body.appendChild(layout);

// Update a specific section by name
AppLayout({ content: Div(['Updated at ', new Date().toLocaleTimeString()]) });
```

### `view.createSection(name, transformFn?)`

Creates a named section. An optional transform function wraps the content before insertion:

```javascript
import { useSingleton } from 'native-document';
import { Div, Header, Main, Section } from 'native-document/elements';

const AppLayout = useSingleton((view) => {
    return Div([
        Header([
            view.createSection('header')
        ]),
        Main([
            view.createSection('main', content =>
                Section({ class: 'main-section' }, content)
            )
        ])
    ]);
});

const layout = AppLayout();
document.body.appendChild(layout);

AppLayout({ header: H1('My App') });      // updates header only
AppLayout({ main: P('Main content') });   // updates main only - wrapped in Section
```

### Multiple Sections

```javascript
import { useSingleton } from 'native-document';
import { Div, Header, Main, Aside, H1, P, Ul, Li } from 'native-document/elements';

const AppLayout = useSingleton((view) => {
    return Div({ class: 'app' }, [
        Header([view.createSection('header')]),
        Div({ class: 'container' }, [
            Main([view.createSection('main')]),
            Aside([view.createSection('sidebar')])
        ])
    ]);
});

const app = AppLayout();
document.body.appendChild(app);

// Update sections individually
AppLayout({ header:  H1('My App') });
AppLayout({ main:    P('Main content') });
AppLayout({ sidebar: Ul([Li('Item 1')]) });

// Or update multiple sections at once
AppLayout({
    header: H1('New Title'),
    main:   P('New content')
});
```

---

## Best Practices

1. Use `$binder.attach()` with `.nd.attach()` for event handlers - direct `.nd.onClick()` won't receive the data object
2. Use `Observable.when()` inside `$binder.class()` for reactive class binding that responds to external state
3. Keep transform functions simple and free of side effects
4. Use `ForEachArray` (not `ForEach`) with `useCache` - it's designed for cached component cloning
5. Use `useSingleton` for layouts and shells that are rendered once but have dynamic inner regions

---

## Next Steps

- **[Elements](./elements.md)** - Creating and composing UI
- **[List Rendering](./list-rendering.md)** - ForEach and ForEachArray
- **[NDElement](./native-document-element.md)** - `.nd.attach()` reference
- **[Observables](./observables.md)** - Reactive state management
- **[State Management](./state-management.md)** - Global state patterns

## Utilities

- **[Cache](./cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](./native-fetch.md)** - HTTP client with interceptors
- **[Filters](./filters.md)** - Data filtering helpers