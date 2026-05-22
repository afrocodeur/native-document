---
title: Conditional Rendering
description: Dynamically show, hide, or switch between content based on reactive state - ShowIf, Switch, Match, When, and more
---

# Conditional Rendering

NativeDocument's conditional rendering utilities automatically update the DOM when observable values change. All functions work with observables and manage DOM updates for you.

```javascript
import { ShowIf, HideIf, ShowWhen, Switch, Match, When } from 'native-document/elements';
```

---

## `ShowIf` - Basic Conditional Display

Renders content only when the condition is truthy. When false, the content is removed from the DOM.

```javascript
const isVisible = Observable(false);

ShowIf(isVisible, Div('Hello!'))

// With a boolean (non-reactive)
ShowIf(true, Div('Always visible'))
```

### Function children

Pass a function to create content that reflects current observable values:

```javascript
const notifications = Observable.array([]);

ShowIf(notifications.isNotEmpty(),
    () => Span({ class: 'badge' }, notifications.toLength())
)
```

### Options

```javascript
ShowIf(condition, content, {
    comment:          'my-component', // label visible in DOM comments (debug)
    shouldKeepInCache: false          // default true - set to false to recreate on each show
})
```

### Practical example

```javascript
const user = Observable({ name: 'Alice', isLoggedIn: false });

Div([
    Button('Login').nd.onClick(() =>
        user.set({ ...user.val(), isLoggedIn: true })
    ),
    ShowIf(user.is(u => u.isLoggedIn),
        () => Div(['Welcome back, ', user.select(u => u.name), '!'])
    )
]);
```

---

## `HideIf` / `HideIfNot` - Inverse Conditions

Convenient inverses of `ShowIf`:

```javascript
const isLoading = Observable(true);

// Hide content while loading
HideIf(isLoading, Div('Data is ready'))

// Show content only while loading (equivalent to ShowIf)
HideIfNot(isLoading, Div('Loading...'))
```

Equivalences:

```javascript
ShowIf(condition, content)    // same as HideIfNot(condition, content)
HideIf(condition, content)    // same as ShowIf(condition.isFalsy(), content)
```

---

## `ShowWhen` - Value Matching

Shows content when an observable matches a specific value.

**Two-argument form** - pass an `ObservableWhen` result from `.when()`:

```javascript
const theme = Observable('light');
const isDark = theme.when('dark'); // ObservableWhen result

ShowWhen(isDark, Div('Dark mode active'))
```

**Three-argument form** - pass the observable, the target value, and the content:

```javascript
ShowWhen(theme, 'dark', Div('Dark mode active'))
```

### Practical example

```javascript
const status = Observable('disconnected');

Div({ class: 'status-bar' }, [
    ShowWhen(status, 'connecting',   Span('Connecting...')),
    ShowWhen(status, 'connected',    Span('Connected')),
    ShowWhen(status, 'disconnected', Span('Disconnected')),
    ShowWhen(status, 'error',        Span('Connection Error'))
]);
```

---

## `Switch` - Binary Content

Toggles between exactly two pieces of content based on a boolean observable:

```javascript
const isDarkMode = Observable(false);

Switch(isDarkMode,
    Div('Dark mode'),   // when true
    Div('Light mode')   // when false
)
```

With function children:

```javascript
const user = Observable({ name: 'Guest', isLoggedIn: false });

Switch(user.is(u => u.isLoggedIn),
    () => Div(['Welcome back, ', user.select(u => u.name)]),
    () => Div('Please sign in')
)
```

> `Switch` is built on top of `Match` using `.toBoolean()`.

---

## `Match` - Multiple States

Handles multiple states like a switch-case. Each key maps to a content value or function:

```javascript
const status = Observable('idle');

Match(status, {
    idle:    Div('Ready'),
    loading: Div('Loading...'),
    success: Div('Done!'),
    error:   Div('Something went wrong'),
    default: Div('Unknown state')
})
```

With function values for access to current observable state:

```javascript
const phase = Observable('menu');

Match(phase, {
    menu: () => Div([
        H1('Welcome'),
        Button('Start').nd.onClick(() => phase.set('playing'))
    ]),
    playing: () => Div([
        Div(['Score: ', score]),
        Button('Pause').nd.onClick(() => phase.set('paused'))
    ]),
    paused: () => Div([
        H2('Paused'),
        Button('Resume').nd.onClick(() => phase.set('playing'))
    ])
})
```

### Dynamic add / remove

`Match` exposes `.add()` and `.remove()` methods to update the available states at runtime:

```javascript
const view = Match(status, {
    idle:    Div('Ready'),
    loading: Div('Loading...')
});

// Add a new state
view.nd.add('success', Div('Done!'));
view.nd.add('success', Div('Done!'), true); // third arg: immediately switch to this state

// Remove a state
view.nd.remove('idle');
```

### `shouldKeepInCache`

By default, `Match` caches each rendered state. Pass `false` to recreate content on every switch:

```javascript
Match(status, { loading: Div('...'), success: Div('Done') }, false)
```

---

## `When` - Fluent Builder

A chainable interface for conditional rendering:

```javascript
const score = Observable(85);

When(score.isGreaterThanOrEqualTo(90))
    .show(() => Div('Excellent!'))
    .otherwise(() => Div('Keep going'))
```

Convert to a DOM element explicitly with `.toNdElement()`:

```javascript
const greeting = When(isLoggedIn)
    .show(() => Div('Welcome back!'))
    .otherwise(() => Div('Please sign in'));

// .otherwise() already returns the element
// .toNdElement() is available if you build the chain without calling .otherwise()
const el = greeting.toNdElement();
```

---

## Choosing the Right Tool

| Situation | Use |
|---|---|
| Simple show / hide | `ShowIf` |
| Inverse show / hide | `HideIf` / `HideIfNot` |
| Show when value matches | `ShowWhen` |
| Two options (true / false) | `Switch` |
| Multiple named states | `Match` |
| Fluent chaining style | `When` |

---

## Best Practices

**Use functions for dynamic content** - static values are evaluated once at creation time:

```javascript
// Good - content reflects current value when shown
ShowIf(isAdmin, () => Div(user.select(u => u.name)))

// Risky - name captured at creation, won't update
ShowIf(isAdmin, Div(user.val().name))
```

**Use `Observable.computed()` for complex conditions:**

```javascript
const canEdit = Observable.computed((u, p) =>
    u.isLoggedIn && (u.role === 'admin' || u.id === p.authorId),
    [user, post]
);

ShowIf(canEdit, editButton)
```

**Use shorthand checkers instead of manual conditions:**

```javascript
// Good
ShowIf(list.isEmpty(), Div('No items'))
ShowIf(name.isTruthy(), Div(['Hello, ', name]))

// Avoid
ShowIf(list.check(l => l.length === 0), Div('No items'))
```

---

## Next Steps

- **[List Rendering](./list-rendering.md)** - ForEach and dynamic lists
- **[Observables](./observables.md)** - Reactive state management
- **[Elements](./elements.md)** - Creating and composing UI
- **[State Management](./state-management.md)** - Global state patterns
- **[Anchor](./anchor.md)** - How conditional rendering works under the hood

## Utilities

- **[Cache](./cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](./native-fetch.md)** - HTTP client with interceptors
- **[Filters](./filters.md)** - Data filtering helpers