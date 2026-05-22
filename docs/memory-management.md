---
title: Memory Management
description: NativeDocument's automatic memory management system using WeakRef and FinalizationRegistry - how it works and how to control it
---

# Memory Management

NativeDocument includes an automatic memory management system that prevents memory leaks using modern browser APIs - `WeakRef` and `FinalizationRegistry`. In most cases you don't need to think about this at all.

---

## How It Works

Every observable is registered in the `MemoryManager` using a `WeakRef`. When an observable goes out of scope and is garbage collected, the `FinalizationRegistry` notifies the system and the entry is cleaned up automatically.

```javascript
function createComponent() {
    const localObservable = Observable(42);
    return Div(localObservable);
    // When the component is removed and localObservable goes out of scope,
    // MemoryManager cleans up its entry automatically via FinalizationRegistry
}
```

Each observable gets an internal numeric ID on creation, accessible via `Observable.getById()`. Note that `.toString()` now returns the current value as a string, not the internal ID:

```javascript
const count = Observable(42);
console.log(count.toString()); // "42" - current value as string
```

---

## Manual Cleanup

### `observable.cleanup()`

Removes all listeners from an observable immediately and prevents new subscriptions:

```javascript
const obs = Observable('data');
const unsubscribe = obs.subscribe(console.log);

obs.cleanup(); // removes all listeners
// obs is now unusable
```

### `observable.onCleanup(callback)`

Register a callback that runs when the observable is cleaned up:

```javascript
const obs = Observable('data');

obs.onCleanup(() => {
    console.log('Observable cleaned up');
});

obs.cleanup(); // triggers the callback
```

### `Observable.cleanup(observable)`

Static alias for `observable.cleanup()`:

```javascript
Observable.cleanup(myObservable);
```

---

## Auto-Cleanup

### `Observable.autoCleanup(enable, options?)`

Enables automatic periodic cleanup of orphaned observables (those that have been garbage collected but whose `WeakRef` entries remain in the registry):

```javascript
Observable.autoCleanup(true, {
    interval:  60000, // run cleanup every 60 seconds (default)
    threshold: 100    // only run when more than 100 entries exist (default)
});
```

Use this in long-running applications to prevent the registry from growing unbounded.

---

## MemoryManager API

`MemoryManager` is the internal registry that tracks all observables via `WeakRef`. It is not exported but its behavior is exposed through `Observable` static methods.

| Method | Description |
|---|---|
| `MemoryManager.register(observable)` | Registers an observable, returns its internal ID |
| `MemoryManager.unregister(id)` | Removes an observable from the registry |
| `MemoryManager.getObservableById(id)` | Retrieves an observable by ID (via `Observable.getById()`) |
| `MemoryManager.cleanup()` | Calls `.cleanup()` on all registered observables and clears the registry |
| `MemoryManager.cleanObservables(threshold)` | Removes entries for GC'd observables when registry size exceeds threshold |

Access `getObservableById` via the public API:

```javascript
// getById is useful for debugging - the ID is the internal MemoryManager key
// Access it via Observable.debug tools or the MemoryManager directly
Observable.getById(1); // returns the first observable registered
```

---

## Manual Subscriptions

The most common source of memory leaks is forgetting to clean up manual subscriptions. `.subscribe()` does not return an unsubscribe function - use `.cleanup()` to remove all listeners, or `.off()` to remove a specific watcher registered via `.on()`:

```javascript
const count = Observable(0);

// Remove all listeners at once
count.subscribe(value => console.log('Count:', value));
count.cleanup();

// Remove a specific .on() watcher
const handler = isActive => console.log('Loading:', isActive);
count.on('loading', handler);
count.off('loading', handler);
```

In element lifecycle hooks, only clean up **external resources**. Do not clean up observables unless the element is permanently destroyed:

```javascript
Div('Content')
    .nd
    .mounted(el => {
        el.intervalId = setInterval(() => doWork(), 1000);
    })
    .unmounted(el => {
        clearInterval(el.intervalId); // external resource - clean up
        // do NOT call observable.cleanup() here unless permanently destroying
    });
```

---

## Debug Mode

Enable debug mode during development to log memory-related events:

```javascript
Observable.debug.enable();

// MemoryManager will log when orphaned observables are cleaned:
// "🧹 Cleaned 3 orphaned observables"
```

---

## Best Practices

1. Trust the automatic system - `WeakRef` + `FinalizationRegistry` handles most cases
2. Always store and call the unsubscribe function for manual subscriptions
3. Use `Observable.autoCleanup(true)` in long-running SPAs
4. Only call `.cleanup()` manually when you need immediate release of resources
5. In `unmounted()` hooks, only clean up external resources (timers, websockets) - not observables
6. Use `Observable.resource()` for async data - it handles its own cleanup via `AbortController`

---

## Next Steps

- **[Observables](./observables.md)** - `cleanup()`, `onCleanup()`, `autoCleanup()`
- **[Lifecycle Events](./lifecycle-events.md)** - When to clean up in `unmounted()`
- **[Observable Resource](./observable-resource.md)** - Async data with built-in cleanup
- **[Anchor](./anchor.md)** - Anchor cleanup

## Utilities

- **[Cache](./cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](./native-fetch.md)** - HTTP client with interceptors
- **[Filters](./filters.md)** - Data filtering helpers