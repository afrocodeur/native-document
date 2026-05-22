---
title: NativeDocument
description: A reactive JavaScript framework that preserves native DOM simplicity without sacrificing modern features
---

# NativeDocument

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](#)
[![Version](https://img.shields.io/badge/Version-1.0.161-orange.svg)](#)
[![Bundle Size](https://img.shields.io/badge/Bundle%20Size-~25kb-green.svg)](#)

> **A reactive JavaScript framework that preserves native DOM simplicity without sacrificing modern features**

NativeDocument combines the familiarity of vanilla JavaScript with the power of modern reactivity. No compilation, no virtual DOM, just pure JavaScript with an intuitive API.

## Why NativeDocument?

> **Note**: NativeDocument works best with a bundler (Vite, Webpack, Rollup) for tree-shaking and optimal bundle size. The CDN version includes all features.

### **Instant Start**
```html
<script src="https://cdn.jsdelivr.net/gh/afrocodeur/native-document/dist/native-document.min.js"></script>
```

### **Familiar API**
```javascript
import { Div, Button } from 'native-document/elements';
import { Observable } from 'native-document';

// CDN
// const { Div, Button } = NativeDocument.elements;
// const { Observable } = NativeDocument;

const count = Observable(0);

const App = Div({ class: 'app' }, [
    Div(['Count ', count]),
    Button('Increment').nd
        .onClick(() => count.$value++)
]);

document.body.appendChild(App);
```

### **Complete Features**
- **Native reactivity** with observables, computed values, and batched updates
- **Global store** for state management with groups, persistence, and computed stores
- **Built-in conditional rendering** (`ShowIf`, `Match`, `Switch`, `When`)
- **Full-featured router** (hash, history, memory modes) with layouts and middlewares
- **Headless UI components** with an optional rendering system (50+ components)
- **Built-in i18n** via `tr()`, locale-aware `Observable.format()`, and `Formatters`
- **Advanced data filtering** with composable filter helpers
- **Official CLI** for scaffolding projects, pages, components, and services
- **Advanced debugging system**
- **Automatic memory management** via `FinalizationRegistry`
- **Tree-shaking** support — only bundle what you use

## Quick Installation

### Option 1: CLI (Recommended)

The fastest way to start a complete project:

```bash
npm install -g @native-document/cli

nd create MyApp            # default structure
nd create MyApp --feature  # feature-based architecture

cd MyApp
npm install
npm start
```

> The CLI source is available at [github.com/afrocodeur/native-document-cli](https://github.com/afrocodeur/native-document-cli).

See the **[CLI guide](./cli.md)** for all available commands (`nd create:page`, `nd create:component`, `nd create:service` and more).

### Option 2: CDN (No build step)
```html
<script src="https://cdn.jsdelivr.net/gh/afrocodeur/native-document@latest/dist/native-document.min.js"></script>
<script>
  const { Div } = NativeDocument.elements;
  const { Observable } = NativeDocument;
  // Your code here
</script>
```

### Option 3: NPM/Yarn
```bash
npm install native-document
# or
yarn add native-document
```

## Quick Example

```javascript
import { Div, Input, Button, ShowIf, ForEach } from 'native-document/elements';
import { Observable } from 'native-document';

// CDN
// const { Div, Input, Button, ShowIf, ForEach } = NativeDocument.elements;
// const { Observable } = NativeDocument;

// Reactive state
const todos = Observable.array([]);
const newTodo = Observable('');

// Todo Component
const TodoApp = Div({ class: 'todo-app' }, [

    // Input for new todo
    Input({ placeholder: 'Add new task...', value: newTodo }),

    // Add button
    Button('Add Todo').nd
    .onClick(() => {
        if (newTodo.val().trim()) {
            todos.push({ id: Date.now(), text: newTodo.val(), done: false });
            newTodo.set('');
        }
    }),

    // Todo list
    ForEach(todos, (todo, index) =>
        Div({ class: 'todo-item' }, [
            Input({ type: 'checkbox', checked: todo.done }),
            `${todo.text}`,
            Button('Delete').nd
    .onClick(() => todos.splice(index.val(), 1))
        ]),
        (item) => item.id // Key function — use unique identifier
    ),

    // Empty state
    ShowIf(todos.isEmpty(),
        Div({ class: 'empty' }, 'No todos yet!')
    )
]);

document.body.appendChild(TodoApp);
```

## Core Concepts

### Observables
Reactive data that automatically updates the DOM:
```javascript
import { Div } from 'native-document/elements';
import { Observable } from 'native-document';

// CDN
// const { Div } = NativeDocument.elements;
// const { Observable } = NativeDocument;

const user = Observable({ name: 'John', age: 25 });
const greeting = Observable.computed(() => `Hello ${user.val().name}!`, [user]);

document.body.appendChild(Div(greeting));

// Direct mutation won't trigger updates
// user.name = 'Fausty'; // Wrong!

// These will trigger updates:
user.$value = { ...user.$value, name: 'Hermes!' };
user.set(data => ({ ...data, name: 'Hermes!' }));
user.set({ ...user.val(), name: 'Hermes!' });
```

### Formatting & i18n
Format observable values reactively with built-in locale awareness.
You must set a locale observable before using `Observable.format()`:

```javascript
import { Observable } from 'native-document';
import { tr } from 'native-document/i18n';

// Set the locale first — formats react to it automatically
const $locale = Observable('fr');
Observable.setLocale($locale);

const price = Observable(4999);
const date  = Observable(Date.now());

export function PriceDisplay() {
    return Div([
        Div(price.format('currency', { currency: 'USD' })),
        Div(date.format('date', { dateStyle: 'long' })),
        Button('Switch to English').nd
    .onClick(() => $locale.set('en'))
    ]);
}

// Built-in format types: currency, number, percent, date, time, datetime, relative, plural

// Translation helper
P(tr('welcome_message'))
```

### Elements
Familiar HTML element creation with reactive bindings:
```javascript
import { Div, Button } from 'native-document/elements';
import { Observable } from 'native-document';

// CDN
// const { Div, Button } = NativeDocument.elements;
// const { Observable } = NativeDocument;

const App = function() {
    const isVisible = Observable(true);

    return Div([
        Div({
            class: { 'hidden': isVisible.isFalsy() },
            style: { opacity: isVisible.format(v => v ? 1 : 0.2) }
        }, 'Content'),
        Button('Toggle').nd
    .onClick(() => isVisible.toggle()),
    ]);
};

document.body.appendChild(App());
```

### Conditional Rendering
Built-in components for dynamic content:
```javascript
import { ShowIf, Match, Switch, When } from 'native-document/elements';

ShowIf(user.is(u => u.isLoggedIn),
    Div('Welcome back!')
)

Match(theme, {
    'dark':  Div({ class: 'dark-mode' }),
    'light': Div({ class: 'light-mode' })
})

Switch(condition, onTrue, onFalse)

When(condition)
    .show(onTrue)
    .otherwise(onFalse)
```

### List Rendering
Efficient rendering of lists with automatic updates:
```javascript
import { ForEach, Div } from 'native-document/elements';
import { Observable } from 'native-document';

const items = Observable.array(['Apple', 'Banana', 'Cherry']);

ForEach(items, (item, index) =>
    Div([index, '. ', item])
)

// With object arrays — use a key function for efficient updates
const users = Observable.array([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
]);

ForEach(users, (user) =>
    Div(user.name),
    (user) => user.id  // Key for efficient updates
)
```

### Routing
Full-featured router with hash, history, and memory modes.
Use `to` with a route name (string) or `{ name, params }` object. Use `href` for direct path links:

```javascript
import { Router, Link } from 'native-document/router';

Router.create({ name: 'default', mode: 'history' }, (router) => {
    router.group('', { layout: DefaultLayout }, () => {
        router.add('/', HomePage);
        router.add('/user/{id}', UserPage);
        router.add('{*}', NotFoundPage);
    });
});

// Named route link
Link({ to: 'home' }, 'Home')

// Named route with params
Link({ to: { name: 'user', params: { id: 42 } } }, 'User Profile')

// Direct path link
Link({ href: '/about' }, 'About')
```

### State Management
Global state with groups, persistence, and computed stores:
```javascript
import { Store } from 'native-document';

// Simple store
Store.create('theme', 'light');

// Persistent store — survives page reloads
Store.createPersistent('settings', { lang: 'en', darkMode: false });

// Grouped stores — isolated namespaces
const CartStore = Store.group('cart', (group) => {
    group.create('items', []);
    group.createComposed('total', () => {
        return CartStore.get('items').val()
            .reduce((sum, item) => sum + item.price * item.qty, 0);
    }, ['items']);
});

// Access in components
const items = CartStore.use('items');    // two-way reactive
const total = CartStore.follow('total'); // read-only reactive
```

### Data Filters
Composable filter helpers for `ObservableArray` only:

```javascript
import { Observable } from 'native-document';
import { equals, greaterThan, lessThan, and, or, not } from 'native-document/filters';

const users = Observable.array([
    { name: 'Alice', age: 17, role: 'user'  },
    { name: 'Bob',   age: 25, role: 'admin' },
    { name: 'Carol', age: 32, role: 'user'  },
]);

// and — field must pass ALL conditions
const youngAdults = users.where({
    age: and(greaterThan(18), lessThan(30))
});
// → Bob (25)

// or — field must pass AT LEAST ONE condition
const adminOrEditor = users.where({
    role: or(equals('admin'), equals('editor'))
});
// → Bob

// not — inverts a filter
const nonAdmins = users.where({
    role: not(equals('admin'))
});
// → Alice, Carol

// Cross-field logic — use the _ key with a plain function
const adminsOrMinors = users.where({
    _: (item) => item.role === 'admin' || item.age < 18
});
// → Alice (minor), Bob (admin)
```

> `and`, `or`, and `not` work on **filter result objects** — they operate on a single field.
> For cross-field logic use the `_` key with a plain function.
> `.where()` returns a new live `ObservableArray` that re-filters automatically when the source changes.

## Documentation

- **[Getting Started](./getting-started.md)** — Installation and first steps
- **[CLI](./cli.md)** — Scaffolding projects, pages, and components
- **[Core Concepts](./core-concepts.md)** — Understanding the fundamentals
- **[Observables](./observables.md)** — Reactive state management
- **[Observable Resource](./observable-resource.md)** — Async data fetching
- **[Elements](./elements.md)** — Creating and composing UI
- **[Conditional Rendering](./conditional-rendering.md)** — Dynamic content
- **[List Rendering](./list-rendering.md)** — ForEach and dynamic lists
- **[Routing](./routing.md)** — Navigation and URL management
- **[State Management](./state-management.md)** — Global state patterns
- **[Lifecycle Events](./lifecycle-events.md)** — Lifecycle events
- **[NDElement](./native-document-element.md)** — Native Document Element
- **[Extending NDElement](./extending-native-document-element.md)** — Custom Methods Guide
- **[Advanced Components](./advanced-components.md)** — Template caching and singleton views
- **[Args Validation](./validation.md)** — Function Argument Validation
- **[Memory Management](./memory-management.md)** — Memory management
- **[Anchor](./anchor.md)** — Anchor
- **[SVG Elements](./svg-elements.md)** — SVG wrapper functions
- **[i18n & Formatting](./i18n.md)** — Locale-aware formatting and translations

### Components

- **[Components Overview](./components/index.md)** — Headless UI component system
- **[Getting Started](./components/getting-started.md)** — First component and renderer setup
- **[Traits](./components/traits.md)** — Draggable, Resizable, EventEmitter
- **[Layout](./components/layout.md)** — Stack, Row, Col, Divider
- **[Accordion](./components/accordion.md)**
- **[Alert, Badge, Spinner, Skeleton, Progress](./components/alert.md)**
- **[Avatar](./components/avatar.md)**
- **[Breadcrumb](./components/breadcrumb.md)**
- **[Button](./components/button.md)**
- **[Context Menu](./components/context-menu.md)**
- **[Data Table](./components/data-table.md)**
- **[Dropdown](./components/dropdown.md)**
- **[File Upload](./components/file.md)**
- **[Form Fields](./components/form-fields.md)**
- **[Checkbox & Radio](./components/checkbox-radio.md)**
- **[Select](./components/select.md)**
- **[Menu](./components/menu.md)**
- **[Modal & Popover](./components/modal.md)**
- **[Slider & Stepper](./components/slider-stepper.md)**
- **[Splitter](./components/splitter.md)**
- **[Switch](./components/switch.md)**
- **[Tabs](./components/tabs.md)**
- **[Toast](./components/toast.md)**
- **[Tooltip](./components/tooltip.md)**

### Utilities

- **[Cache](./utils/cache.md)** — Lazy initialization and singleton patterns
- **[NativeFetch](./utils/native-fetch.md)** — HTTP client with interceptors
- **[Filters](./utils/filters.md)** — Data filtering helpers

## Key Features Deep Dive

### Performance Optimized
- Direct DOM manipulation (no virtual DOM overhead)
- Automatic batching of updates
- Lazy evaluation of computed values
- Efficient list rendering with keyed updates
- Tree-shaking — only bundle what you use

### Developer Experience
```javascript
import { ArgTypes } from 'native-document';

// Built-in debugging
Observable.debug.enable();

// Argument validation
const createUser = (function(name, age) {
    // Auto-validates argument types in development
}).args(ArgTypes.string('name'), ArgTypes.number('age'));

// Error boundaries
const SafeApp = App.errorBoundary((error, { caller, args }) => {
    return Div({ class: 'error' }, [
        'An error occurred: ',
        error.message
    ]);
});

document.body.appendChild(SafeApp());
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](./contributing.md) for details.

### Development Setup
```bash
git clone https://github.com/afrocodeur/native-document
cd native-document
npm install
npm run dev
```

## License

MIT © [AfroCodeur](https://github.com/afrocodeur)

## ❤️ Support the Project

NativeDocument is developed and maintained in my spare time.  
If it helps you build better applications, consider supporting its development:

[![Ko-fi](https://img.shields.io/badge/☕_Buy_me_a_coffee-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/native_document)

You can also support the project via crypto donations:

- **USDT (TRC20)**
- **USDT (BSC)**
- **USDC (Base)**

```
0xCe426776DDb07256aBd58c850dd57041BC85Ea7D
```

Your support helps me:

- Maintain and improve NativeDocument
- Write better documentation and examples
- Fix bugs and ship new features
- Produce tutorials and learning content

Thanks for your support! 🙏

## Acknowledgments

Thanks to all contributors and the JavaScript community for inspiration.

---

**Ready to build with native simplicity?** [Get Started ->](./getting-started.md)