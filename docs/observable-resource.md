---
title: Observable Resource
description: Manage async data fetching with built-in states, AbortController cancellation, reactive dependencies, and debouncing
---

# Observable Resource

`Observable.resource()` manages async data fetching with built-in lifecycle states, automatic AbortController cancellation, reactive dependency tracking, and debounce support.

---

## Basic Usage

```javascript
import { Observable } from 'native-document';

const user = Observable.resource(
    async () => {
        const res = await fetch('/api/user');
        return res.json();
    },
    [],
    { auto: true }
);
```

---

## Signature

```javascript
Observable.resource(fn, deps, options)
```

| Parameter | Type | Description |
|---|---|---|
| `fn` | `async function` | Async function that returns the data. Receives dependency values as arguments. If the function declares more parameters than there are dependencies, the last parameter receives an `AbortSignal` |
| `deps` | `Observable[]` | Reactive dependencies - resource re-fetches when any of these change |
| `options` | `object` | Configuration object |

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `auto` | `boolean` | `false` | Fetch immediately on creation, and re-fetch when deps change |
| `lazy` | `boolean` | `false` | With deps, skip the initial fetch - only re-fetch when deps change |
| `debounce` | `number` | `0` | Debounce re-fetches by N milliseconds |
| `into` | `Observable` | `Observable(null)` | Observable to use as `data`. Pass `$.array()` for list results, or an existing observable to reuse |
| `apply` | `function` | `null` | Custom function to apply the fetch result to `data`: `(result, data) => void` |

---

## Resource Properties

| Property | Type | Description |
|---|---|---|
| `data` | `Observable` | The fetched data. Starts as `null` unless `into` is provided |
| `error` | `Observable` | The error if the last fetch failed, otherwise `null` |
| `state` | `Observable<string>` | Current state |
| `loading` | `Observable<boolean>` | `true` when state is `'pending'` or `'refreshing'` |

### States

| State | When |
|---|---|
| `unresolved` | Created but not yet fetched |
| `pending` | First fetch in progress, no data yet |
| `ready` | Data available |
| `refreshing` | Re-fetching while previous data is still shown |
| `errored` | Last fetch failed |

---

## State Checkers

All return an `ObservableChecker<boolean>`:

```javascript
user.isUnresolved()
user.isPending()
user.isReady()
user.isRefreshing()
user.isErrored()
```

---

## Methods

### `fetch()` - Trigger first fetch

```javascript
const user = Observable.resource(fetchUser, []);
user.fetch();
```

### `refetch()` - Re-fetch (shows `'refreshing'` state)

```javascript
Button('Refresh').nd.onClick(() => user.refetch())
```

### `mutate(value)` - Update data optimistically

Updates `data` directly and sets state to `'ready'` without a network request:

```javascript
user.mutate({ ...user.data.val(), name: 'Alice Updated' });
```

### `into($observable)` - Set or change the data observable

Can be passed as an option or as a chained method after creation.

> **Warning:** When `auto: true`, the fetch starts immediately in the constructor - before any chained method calls. If you call `.into()` or `.apply()` as chained methods, the first fetch may already be in progress and will use the default `data` observable, causing an async conflict. **Always pass `into` and `apply` as options when using `auto: true`.**
>
> When `auto: false`, chaining is safe - the fetch has not started yet:

```javascript
// Safe - auto: false, chain .into() then trigger manually
Observable.resource(fetchUsers, [])
    .into($.array())
    .fetch();

// Safe - into passed as option with auto: true
const users = Observable.resource(fetchUsers, [], {
    auto: true,
    into: $.array()
});

// Unsafe - fetch may start before .into() is called
const users = Observable.resource(fetchUsers, [], { auto: true })
    .into($.array()); // race condition!
```

### `apply(fn)` - Custom result application

By default the result is applied via `data.set(result)`. Use `apply` when you need custom merge logic.

> **Warning:** Same async conflict as `into()` - always pass `apply` as an option when `auto: true`. When `auto: false`, chaining is safe:

```javascript
// Safe - auto: false, chain .apply() then trigger manually
Observable.resource(fetchUsers, [])
    .into($.array())
    .apply((result, data) => data.merge(result))
    .fetch();

// Safe - apply passed as option with auto: true
const users = Observable.resource(fetchUsers, [], {
    auto: true,
    into:  $.array(),
    apply: (result, data) => data.merge(result)
});

// Unsafe - apply may not be set before first fetch completes
const users = Observable.resource(fetchUsers, [], { auto: true })
    .apply((result, data) => data.merge(result)); // race condition!
```

### `onSuccess(callback)`

Fires when a fetch completes successfully:

```javascript
user.onSuccess(data => console.log('Loaded:', data));
```

### `onError(callback)`

Fires when a fetch fails:

```javascript
user.onError(err => console.error('Failed:', err.message));
```

### `destroy()` - Cleanup

Aborts any in-flight request and unsubscribes from all dependencies:

```javascript
user.destroy();
```

---

## Rendering Patterns

### With `Match`

```javascript
import { Match, Div } from 'native-document/elements';

const user = Observable.resource(
    async () => {
        const res = await fetch('/api/user');
        return res.json();
    },
    [],
    { auto: true }
);

Match(user.state, {
    unresolved: Div('Not started'),
    pending:    Div('Loading...'),
    refreshing: () => Div([
        Div({ class: 'opacity-50' }, user.data.select(u => u.name)),
        Div('Refreshing...')
    ]),
    ready:   () => Div(user.data.select(u => u.name)),
    errored: () => Div(['Error: ', user.error.select(e => e.message)])
})
```

### With `ShowIf`

```javascript
Div([
    ShowIf(user.loading,     () => Div('Loading...')),
    ShowIf(user.isReady(),   () => P(user.data.select(u => u.name))),
    ShowIf(user.isErrored(), () => Div(['Error: ', user.error.select(e => e.message)])),
    Button('Refresh').nd.onClick(() => user.refetch())
])
```

---

## Reactive Dependencies

When deps change, the resource re-fetches. Dependency values are passed as arguments to `fn` in order:

```javascript
const userId   = Observable(1);
const language = Observable('en');

const profile = Observable.resource(
    async (id, lang) => {
        const res = await fetch(`/api/users/${id}?lang=${lang}`);
        return res.json();
    },
    [userId, language],
    { auto: true }
);

// Triggers a re-fetch automatically
userId.set(2);
language.set('fr');
```

---

## AbortController Support

If `fn` declares **more parameters than there are dependencies**, the last parameter receives an `AbortSignal`. Previous requests are aborted automatically when a new fetch starts:

```javascript
const userId = Observable(1);

const user = Observable.resource(
    async (id, signal) => {
        // fn.length (2) > deps.length (1) -> AbortController enabled
        const res = await fetch(`/api/users/${id}`, { signal });
        return res.json();
    },
    [userId],
    { auto: true }
);

// Rapid changes abort in-flight requests
userId.set(2);
userId.set(3); // request for id=2 is aborted
```

If `fn.length === deps.length`, no AbortController is used.

---

## Debouncing

```javascript
const search = Observable('');

const results = Observable.resource(
    async (query) => {
        const res = await fetch(`/api/search?q=${query}`);
        return res.json();
    },
    [search],
    { auto: true, debounce: 300 }
);

Input({ value: search, placeholder: 'Search...' })
```

---

## Lazy Loading

With `lazy: true` and deps, the initial fetch is skipped. The resource only fetches when a dependency changes:

```javascript
const isOpen = Observable(false);

const data = Observable.resource(
    async (open) => {
        if (!open) return null;
        const res = await fetch('/api/data');
        return res.json();
    },
    [isOpen],
    { auto: true, lazy: true } // no fetch on creation
);

// First fetch triggered when isOpen changes
isOpen.set(true);
```

---

## `into` - Control the Data Observable

Use `into` as an **option** to control the type of `data` or reuse an existing observable. Always pass it as an option when `auto: true` - not as a chained method call:

```javascript
import { $ } from 'native-document';

// Default - plain Observable(null)
const user = Observable.resource(fetchUser, [], { auto: true });

// ObservableArray - useful for list results
const users = Observable.resource(fetchUsers, [], {
    auto: true,
    into: $.array()
});

// Existing observable - e.g. a cached Store value shown immediately
const cachedUser = Store.follow('user');
const user = Observable.resource(fetchUser, [], {
    auto: true,
    into: cachedUser
});
// user.data === cachedUser, shown immediately, updated when fetch completes
```

---

## vs `Observable.batch()`

| | `Observable.resource()` | `Observable.batch()` |
|---|---|---|
| **Purpose** | Async data fetching | Batching multiple state changes |
| **States** | Built-in (pending, ready, errored...) | None |
| **AbortController** | Automatic | Manual |
| **Deps tracking** | Auto re-fetch | Manual call |
| **Best for** | API calls, remote data | Complex local state updates |

---

## Next Steps

- **[Observables](./observables.md)** - Reactive state management
- **[NativeFetch](./native-fetch.md)** - HTTP client with interceptors
- **[State Management](./state-management.md)** - Global state with Store
- **[Memory Management](./memory-management.md)** - Cleanup with `destroy()`