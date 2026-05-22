---
title: Lifecycle Events
description: Execute code when elements are added to or removed from the DOM using mounted, unmounted, beforeUnmount, destroyOnUnmount, and destroy hooks
---

# Lifecycle Events

NativeDocument provides lifecycle hooks that let you execute code when elements are added to or removed from the DOM. This is essential for setup, cleanup, and managing external resources.

---

## `mounted(callback)`

Fires when the element is added to the DOM:

```javascript
const myComponent = Div('Hello World')
    .nd
    .mounted(element => {
        console.log('In the DOM:', element);
    });

document.body.appendChild(myComponent); // triggers mounted
```

### Auto-focus example

```javascript
const searchInput = Input({ placeholder: 'Search...' })
    .nd
    .mounted(element => {
        element.focus();
    });
```

---

## `unmounted(callback)`

Fires when the element is removed from the DOM. Only clean up **external resources** here - do not clean up observables unless the element is permanently destroyed:

```javascript
const myComponent = Div('Content')
    .nd
    .unmounted(element => {
        clearInterval(element.timerId);
        element.websocket?.close();

        // Do NOT call observable.cleanup() here
        // unless the element will never be re-injected
    });
```

### External event listener cleanup

```javascript
function MyButton() {
    const handler = () => console.log('Global click');

    return Button('Click me')
        .nd
        .mounted(el => {
            document.addEventListener('click', handler);
        })
        .unmounted(el => {
            document.removeEventListener('click', handler);
        });
}
```

---

## `lifecycle({ mounted, unmounted })`

Configure both hooks at once:

```javascript
const timer = Div('Timer: 0')
    .nd
    .lifecycle({
        mounted(element) {
            element.intervalId = setInterval(() => {
                element.textContent = `Timer: ${Date.now()}`;
            }, 1000);
        },
        unmounted(element) {
            clearInterval(element.intervalId);
        }
    });
```

---

## `beforeUnmount(id, callback)`

Registers an async callback that runs **before** the element is removed from the DOM. Useful for exit animations or saving data before removal.

Multiple callbacks can be registered using different IDs - they all run sequentially before the element is removed:

```javascript
Div('Content')
    .nd
    .beforeUnmount('save', async el => {
        await saveData();
    })
    .beforeUnmount('animate', async el => {
        await playExitAnimation(el);
    });
```

The element's `remove()` method is patched to be async when `beforeUnmount` is used - all callbacks are awaited before the element is actually removed:

```javascript
const modal = Div({ class: 'modal' }, 'Content')
    .nd
    .beforeUnmount('fade-out', async el => {
        el.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 300));
    });

await modal.nd.remove();
```

> The `id` parameter lets you register multiple `beforeUnmount` callbacks and also allows replacing a specific one by re-using the same id.

---

## `destroyOnUnmount()`

Registers an `unmounted` callback that calls `destroy()` automatically. Use when the element will **never** be re-injected into the DOM:

```javascript
const widget = Div('Content')
    .nd
    .mounted(el => {
        el.intervalId = setInterval(() => doWork(), 1000);
    })
    .destroyOnUnmount();
```

> Do not use `destroyOnUnmount()` on elements that may be temporarily removed and re-appended (e.g. inside `ShowIf` with `shouldKeepInCache: true`). Use explicit `unmounted()` + `mounted()` pairs in that case.

---

## `destroy()`

Aborts the element's internal `AbortController`, clears all lifecycle observers, and removes all `beforeUnmount` callbacks. The element's `$element` reference is set to `null`:

```javascript
const el = Div('Temporary content')
    .nd
    .beforeUnmount('animate', async () => { /* ... */ });

el.nd.destroy();
```

`destroy()` is called internally by `destroyOnUnmount()`. You rarely need to call it directly.

---

## Element Reuse

Elements can be removed and re-appended safely. Observables bound to the element remain intact through remove/re-append cycles:

```javascript
const reusable = Div('Content')
    .nd
    .mounted(el => console.log('Mounted'))
    .unmounted(el => {
        clearInterval(el.timerId);
    });

document.body.appendChild(reusable); // "Mounted"
reusable.nd.remove();                // "Unmounted"
document.body.appendChild(reusable); // "Mounted" again
```

---

## Next Steps

- **[NDElement](./native-document-element.md)** - Full `.nd` API reference
- **[Memory Management](./memory-management.md)** - When and how to clean up observables
- **[Extending NDElement](./extending-native-document-element.md)** - Custom methods guide
- **[Advanced Components](./advanced-components.md)** - Template caching and singleton views
