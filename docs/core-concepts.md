---
title: Core Concepts
description: The fundamental concepts and philosophy behind NativeDocument - observables, elements, reactivity, and component patterns
---

# Core Concepts

This guide covers the fundamental concepts and philosophy behind NativeDocument.

---

## Philosophy

### Native-First

NativeDocument embraces the DOM rather than abstracting it away. Every element you create is a real DOM node, and every interaction uses native browser APIs:

- No virtual DOM overhead
- Direct access to all browser APIs
- Familiar debugging in DevTools
- Better performance for DOM-heavy applications

### Reactive by Design

Reactivity is built into the core through observables. When data changes, the UI updates automatically:

```javascript
const message = Observable('Hello World');
const display = Div(message);

message.set('Hello NativeDocument!'); // UI updates automatically
```

### Zero Build Requirement

NativeDocument works without a build step - load from CDN and start immediately:

```html
<script src="https://cdn.jsdelivr.net/gh/afrocodeur/native-document@latest/dist/native-document.min.js"></script>
<script>
    const { Div, Button } = NativeDocument.elements;
    const { Observable } = NativeDocument;
</script>
```

For production, use the CLI for optimal bundle size via tree-shaking:

```bash
nd create MyApp
```

---

## Observables

Observables wrap values and notify the UI when they change. They are the reactive foundation of NativeDocument.

```javascript
import { Observable } from 'native-document';

const count = Observable(0);

count.set(5);              // triggers update
count.$value = 5;          // same thing
count.set(v => v + 1);    // function form

count.val();   // read current value
count.$value;  // same
```

### Object observables

```javascript
const user = Observable({ name: 'John', age: 25 });

user.set({ ...user.val(), name: 'Jane' });
user.set(data => ({ ...data, name: 'Jane' }));

// user.name = 'Jane' -- wrong, won't trigger update
```

For per-property reactivity:

```javascript
const user = Observable.object({ name: 'John', age: 25 });
user.name.set('Jane'); // only name updates
user.$value;           // { name: 'Jane', age: 25 }
```

### Array observables

```javascript
const todos = Observable.array([]);

todos.push({ id: 1, text: 'Buy milk', done: false });
todos.splice(0, 1);
todos.sort((a, b) => a.text.localeCompare(b.text));
```

### Computed observables

The callback receives dependency values as arguments in order:

```javascript
const firstName = Observable('John');
const lastName  = Observable('Doe');

const fullName = Observable.computed((first, last) => {
    return `${first} ${last}`;
}, [firstName, lastName]);

firstName.set('Jane'); // fullName -> "Jane Doe"
```

See [Observables](./observables.md) for the full reference.

---

## Elements

Elements are functions that create and return real DOM nodes:

```javascript
import { Div, Button, Input, H1, P } from 'native-document/elements';

// No attributes
const simple = Div('Hello World');

// With attributes
const styled = Div({ class: 'card', id: 'main' }, 'Content');

// With reactive attributes
const isVisible = Observable(true);
const box = Div({
    class: { 'hidden': isVisible.isFalsy() },
    style: { opacity: isVisible.format(v => v ? 1 : 0.5) }
}, 'Content');

// Children - text, numbers, observables, elements, closures, or arrays
const mixed = Div([
    H1('Title'),
    'Some text',
    P(count),
    () => Button('Dynamic')
]);
```

### Event handling

```javascript
Button('Click me').nd.onClick(() => console.log('Clicked'));

// Multi-line callback
Button('Submit')
    .nd
    .onClick(e => {
        e.preventDefault();
        submitForm();
    });

// Multiple events - chain after first .nd
Input({ type: 'text' })
    .nd
    .onFocus(() => console.log('Focused'))
    .onBlur(() => console.log('Blurred'))
    .onInput(e => console.log('Value:', e.target.value));
```

See [Elements](./elements.md) for the full reference.

---

## Reactivity Model

Data flows in one direction:

1. **State change** - an observable is updated
2. **Notification** - all subscribers are notified
3. **DOM update** - UI elements update automatically
4. **Event handling** - user interactions trigger new state changes

```javascript
const items = Observable.array(['Apple', 'Banana']);

Ul(
    ForEach(items, item =>
        Li([
            item,
            Button('Remove')
                .nd.onClick(() => items.removeItem(item))
        ])
    )
)
```

### Reactive chains

```javascript
const price    = Observable(100);
const quantity = Observable(2);
const tax      = Observable(0.2);

const subtotal = Observable.computed((p, q) => p * q, [price, quantity]);
const total    = Observable.computed((sub, t) => sub * (1 + t), [subtotal, tax]);

price.set(150); // subtotal and total both update
```

---

## Component Patterns

### Functional components

```javascript
function UserCard({ name, email }) {
    return Div({ class: 'user-card' }, [
        Div({ class: 'name' },  name),
        Div({ class: 'email' }, email),
        Button('Edit').nd.onClick(() => editUser(name))
    ]);
}

document.body.appendChild(UserCard({ name: 'John', email: 'john@example.com' }));
```

### Stateful components

```javascript
function Counter(initialValue = 0) {
    const count = Observable(initialValue);

    return Div({ class: 'counter' }, [
        Div(['Count: ', count]),
        Button('-').nd.onClick(() => count.$value--),
        Button('+').nd.onClick(() => count.$value++),
        Button('Reset').nd.onClick(() => count.set(initialValue))
    ]);
}
```

### Exposing methods to parent via `.nd.with()`

```javascript
function Timer() {
    const count    = Observable(0);
    let   interval = null;

    return Div(['Time: ', count])
        .nd.with({
            start() {
                if (interval) return this;
                interval = setInterval(() => count.$value++, 1000);
                return this;
            },
            stop() {
                clearInterval(interval);
                interval = null;
                return this;
            },
            reset() {
                this.stop();
                count.set(0);
                return this;
            }
        });
}

const refs = {};
Div([
    Timer().nd.refSelf(refs, 'timer'),
    Button('Start').nd.onClick(() => refs.timer.start()),
    Button('Stop').nd.onClick(() => refs.timer.stop()),
    Button('Reset').nd.onClick(() => refs.timer.reset())
]);
```

---

## State Management Patterns

### Local state

Use observables directly for component-specific state:

```javascript
function SearchBox(onSearch) {
    const query   = Observable('');
    const isValid = query.isNotEmpty();

    return Div([
        Input({ placeholder: 'Search...', value: query }),
        Button('Search')
            .nd.onClick(() => {
                if (isValid.val()) {
                    onSearch(query.val());
                }
            })
    ]);
}
```

### Global state with Store

```javascript
import { Store } from 'native-document';

Store.create('theme', 'light');

const UserStore = Store.group('user', g => {
    g.createResettable('session', { id: null, name: '', isLoggedIn: false });
});

function Header() {
    const theme   = Store.use('theme');
    const session = UserStore.use('session');

    return Div({ class: theme.format(t => `theme-${t}`) }, [
        ShowIf(session.is(s => s.isLoggedIn),
            () => Div(['Welcome, ', session.select(s => s.name)])
        )
    ]);
}
```

---

## Error Handling

```javascript
// Error boundary on a component function
const SafeWidget = Widget.errorBoundary((error, { caller, args }) => {
    console.error('Widget error:', error);
    return Div({ class: 'error' }, 'Something went wrong');
});
```

---

## Next Steps

- **[Observables](./observables.md)** - Full reactive state reference
- **[Elements](./elements.md)** - Creating and composing UI
- **[Conditional Rendering](./conditional-rendering.md)** - ShowIf, Match, Switch
- **[List Rendering](./list-rendering.md)** - ForEach and dynamic lists
- **[Routing](./routing.md)** - Navigation and URL management
- **[State Management](./state-management.md)** - Global state with Store
- **[NDElement](./native-document-element.md)** - Full `.nd` API reference
- **[CLI](./cli.md)** - Project scaffolding

## Utilities

- **[Cache](./cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](./native-fetch.md)** - HTTP client with interceptors
- **[Filters](./filters.md)** - Data filtering helpers