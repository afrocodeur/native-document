---
title: NDElement
description: The NDElement wrapper enhances native HTML elements with fluent event handling, lifecycle hooks, transitions, and DOM utilities
---

# NDElement

`NDElement` is a wrapper class that enhances native HTML elements with fluent event handling, lifecycle hooks, transitions, and DOM utilities - while preserving full access to the underlying native element.

## Accessing NDElement

Every element created with NativeDocument automatically has an `nd` property that returns its `NDElement` instance:

```javascript
const element = Div('Hello World');
const ndElement = element.nd; // NDElement instance

// Chain directly
Div('Hello').nd.onClick(() => console.log('Clicked!'));
```

Once you call `.nd`, subsequent methods chain directly, no need to repeat `.nd`:

```javascript
Button('Interactive')
    .nd
    .onClick(e => console.log('Clicked'))
    .onMouseEnter(e => e.target.style.background = 'blue')
    .onMouseLeave(e => e.target.style.background = '')
    .mounted(el => console.log('Button mounted'));
```

## Properties

### `$element`
The encapsulated native HTML element.

```javascript
const div = Div('Content');
const htmlElement = div.nd.$element; // Native HTMLDivElement
```

### `$observer`
Lifecycle observer, used internally for DOM monitoring.

---

## Event Handling

### Auto-generated event methods

NDElement generates methods for all standard DOM events in four variants:

```javascript
// Standard
element.nd.onClick(callback)

// Prevents default behavior
element.nd.onPreventClick(callback)

// Stops event propagation
element.nd.onStopClick(callback)

// Both preventDefault() and stopPropagation()
element.nd.onPreventStopClick(callback)
```

```javascript
// Standard usage
Button('Submit').nd.onClick(e => console.log('Clicked'));
Input().nd.onInput(e => console.log('Value:', e.target.value));

// Prevent default
Link({ href: '/page' })
    .nd
    .onPreventClick(e => {
        router.push('/page');
    });

// Stop propagation
Div([
    Button('Child').nd.onStopClick(e => console.log("Won't bubble"))
]).nd.onClick(() => console.log('Never called'));

// Prevent + stop
Form().nd.onPreventStopSubmit(handleFormSubmit);
```

### Supported events

**Mouse:** `Click`, `DblClick`, `MouseDown`, `MouseEnter`, `MouseLeave`, `MouseMove`, `MouseOut`, `MouseOver`, `MouseUp`, `Wheel`

**Keyboard:** `KeyDown`, `KeyPress`, `KeyUp`

**Form:** `Blur`, `Change`, `Focus`, `Input`, `Invalid`, `Reset`, `Search`, `Select`, `Submit`

**Drag & Drop:** `Drag`, `DragEnd`, `DragEnter`, `DragLeave`, `DragOver`, `DragStart`, `Drop`

**Media:** `Abort`, `CanPlay`, `CanPlayThrough`, `DurationChange`, `Emptied`, `Ended`, `LoadedData`, `LoadedMetadata`, `LoadStart`, `Pause`, `Play`, `Playing`, `Progress`, `RateChange`, `Seeked`, `Seeking`, `Stalled`, `Suspend`, `TimeUpdate`, `VolumeChange`, `Waiting`

**Window:** `AfterPrint`, `BeforePrint`, `BeforeUnload`, `Error`, `HashChange`, `Load`, `Offline`, `Online`, `PageHide`, `PageShow`, `Resize`, `Scroll`, `Unload`

### `.on(name, callback, options)` - Generic event

Registers any DOM event. Uses `AbortController` internally - listeners are **automatically removed when the element is unmounted**, no manual cleanup needed:

```javascript
element.nd.on('scroll', callback, { passive: true })
element.nd.on('customEvent', callback)
```

### `.off(name, callback)` - Remove a specific listener

```javascript
const handler = e => console.log(e);

element.nd.on('click', handler);
element.nd.off('click', handler);
```

### `.once(name, callback)` - One-time listener

Fires once then removes itself automatically:

```javascript
element.nd.once('click', () => console.log('First click only'));
```

### `.emit(name, detail?)` - Dispatch a custom event

```javascript
element.nd.emit('my-event', { value: 42 });

// Listen for it on a parent
parent.nd.on('my-event', e => console.log(e.detail.value)); // 42
```

---

## Attribute Methods

### `.attr(name, value)` - Set a single attribute

Accepts a plain value or an observable:

```javascript
element.nd.attr('aria-label', 'Close button');
element.nd.attr('aria-expanded', isOpen); // reactive
```

### `.attrs(attrs)` - Set multiple attributes

```javascript
element.nd.attrs({
    'aria-label':    'Close',
    'aria-expanded': isOpen,
    'data-id':       '123'
});
```

### `.class(classes)` - Bind class object

```javascript
element.nd.class({
    'active':   isActive,
    'disabled': isDisabled,
    'hidden':   isVisible.isFalsy()
});
```

### `.style(style)` - Bind style object

```javascript
element.nd.style({
    color:   theme.format(t => t === 'dark' ? '#fff' : '#333'),
    opacity: isVisible.format(v => v ? 1 : 0.5)
});
```

---

## Utility Methods

### `ref(target, name)` / `refSelf(target, name)`

Both store a reference on a target object but store different things:

- **`ref(target, name)`** - stores the **native HTML element** (`this.$element`) - use for direct DOM access
- **`refSelf(target, name)`** - stores the **`NDElement` instance** (`this`) - use to keep calling `.nd` methods

```javascript
const refs = {};

Div([
    Input({ type: 'text' }).nd.ref(refs, 'nameInput'),       // refs.nameInput -> HTMLInputElement
    Input({ type: 'text' }).nd.refSelf(refs, 'emailInput'),  // refs.emailInput -> NDElement instance

    Button('Actions')
        .nd
        .onClick(() => {
            refs.nameInput.focus();       // native DOM method
            refs.emailInput.onInput(e => console.log(e.target.value)); // nd method
        })
]);
```

### `htmlElement()` / `node()`

Returns the native HTML element, both are aliases for `$element`:

```javascript
const div = Div('Hello');
div.nd.htmlElement(); // HTMLDivElement
div.nd.node();        // same
```

### `remove()`

Removes the element from the DOM and cleans up its internal references:

```javascript
const element = Div('Temporary');
element.nd.remove();
```

### `unmountChildren()`

Unmounts all child elements and cleans up their references:

```javascript
const container = Div([Div('Child 1'), Div('Child 2')]);
container.nd.unmountChildren();
```

### `ghostDom(element)`

Appends an element to an internal `DocumentFragment` attached to the component. When the component is inserted into the DOM, both the main element and the ghost elements are injected together - but the user only interacts with the main element.

This is primarily useful when building components that need a companion element in the DOM. For example, a `Button` that controls a `Dropdown`: the button is the returned element, the dropdown lives in the ghost DOM. Both are rendered, but only the button is exposed to the parent:

```javascript
function DropdownButton(label, items) {
    const isOpen = Observable(false);

    const dropdown = Div({ class: 'dropdown' }, [
        ShowIf(isOpen, () => Ul(items.map(item => Li(item))))
    ]);

    return Button(label)
        .nd
        .onClick(() => isOpen.toggle())
        .ghostDom(dropdown); // dropdown is injected into DOM alongside the button
                             // but the parent only receives the button
}

// Usage - the parent only works with the button
const btn = DropdownButton('Options', ['Edit', 'Delete']);
document.body.appendChild(btn);
```

### `attach(methodName, bindingHydrator)`

Attaches a template binding hydrator to the element. Used internally by the `useCache` and `useSingleton` rendering systems:

```javascript
element.nd.attach('onClick', bindingHydrator);
```

See [Advanced Components](./advanced-components.md) for practical usage.

---

## Lifecycle Management

### `mounted(callback)`

Fires when the element is added to the DOM:

```javascript
Div('Content')
    .nd
    .mounted(element => {
        console.log('In the DOM');
    });
```

### `unmounted(callback)`

Fires when the element is removed from the DOM:

```javascript
Div('Content')
    .nd
    .unmounted(element => {
        console.log('Removed from DOM');
        // Only clean up external resources here (timers, websockets)
        // Do NOT clean up observables unless the element is permanently destroyed
    });
```

### `lifecycle({ mounted, unmounted })`

Configures both hooks at once:

```javascript
Div('Content')
    .nd
    .lifecycle({
        mounted:   el => console.log('Mounted'),
        unmounted: el => console.log('Unmounted')
    });
```

### `beforeUnmount(id, callback)`

Registers an async callback that runs before the element is removed. Useful for exit animations or data saving:

```javascript
Div('Content')
    .nd
    .beforeUnmount('save', async () => {
        await saveData();
    });
```

---

## Transitions

### `transition(name)`

Applies both enter and exit transitions via CSS classes:

```javascript
Div('Content').nd.transition('fade');
// On mount:   adds 'fade-enter-from', then 'fade-enter-to'
// On unmount: adds 'fade-exit'
```

### `transitionIn(name)` / `transitionOut(name)`

Apply only the enter or exit transition:

```javascript
Div('Content')
    .nd
    .transitionIn('slide-down')
    .transitionOut('slide-up');
```

### `animate(name)`

Triggers a one-shot CSS animation, adds the class then removes it automatically:

```javascript
Button('Click').nd.onClick(function() {
    this.nd.animate('bounce');
});
```

---

## Extending NDElement

### `.nd.with(methods)` - Exposing child component methods

`.with()` is designed for components that need to **expose internal control methods to their parent** without leaking their internal observables. The parent accesses these methods via `refSelf`.

A typical use case is a component like a media player or a counter that must expose `play`, `pause`, `reset` - letting the parent control it without knowing its internal state:

```javascript
function Counter(initialValue = 0) {
    const count = Observable(initialValue); // internal - never exposed
    let interval = null;

    return Div({ class: 'counter' }, [
        Div(['Count: ', count]),
    ])
    .nd
    .with({
        play() {
            if (interval) return this;
            interval = setInterval(() => count.$value++, 1000);
            return this;
        },
        pause() {
            clearInterval(interval);
            interval = null;
            return this;
        },
        reset() {
            this.pause();
            count.set(initialValue);
            return this;
        }
    });
}

// Parent controls the counter via refSelf - no internal state exposed
const refs = {};

Div([
    Counter(0).nd.refSelf(refs, 'counter'),
    Button('Play').nd.onClick(() => refs.counter.play()),
    Button('Pause').nd.onClick(() => refs.counter.pause()),
    Button('Reset').nd.onClick(() => refs.counter.reset())
]);
```

> `.with()` only affects the current instance. The methods are not available on other elements.

### `NDElement.extend(methods)` - App-wide methods

Adds methods to **all NDElement instances** via the prototype. Use for app-wide utilities:

```javascript
NDElement.extend({
    onEnter(callback) {
        this.$element.addEventListener('keyup', e => {
            if (e.key === 'Enter') callback(e);
        });
        return this;
    }
});

// Available on every element
Input().nd.onEnter(e => console.log('Enter pressed'));
```

### Protected methods

The following method names **cannot be overridden** via `NDElement.extend()` - attempting to do so throws a `NativeDocumentError`:

`constructor`, `valueOf`, `$element`, `$observer`, `ref`, `remove`, `cleanup`, `with`, `extend`, `attach`, `lifecycle`, `mounted`, `unmounted`, `unmountChildren`

---

## Shadow DOM

```javascript
// Open shadow DOM (inspectable in DevTools)
Div('Content')
    .nd
    .openShadow(`
        :host { display: block; padding: 20px; }
        p { color: blue; }
    `);

// Closed shadow DOM (private)
Div('Content').nd.closedShadow(`p { color: red; }`);

// Manual mode
Div('Content').nd.shadow('open', `/* scoped styles */`);
```

---

## Integration with Observables

```javascript
const isVisible = Observable(false);
const message   = Observable('Hello');

Div([
    Button('Toggle').nd.onClick(() => isVisible.toggle()),
    ShowIf(isVisible, () =>
        P(message).nd.onClick(() => message.set('Clicked!'))
    )
]);
```

---

## Next Steps

- **[Extending NDElement](./extending-native-document-element.md)** - Adding custom methods
- **[Lifecycle Events](./lifecycle-events.md)** - Mounted, unmounted, beforeUnmount in depth
- **[Advanced Components](./advanced-components.md)** - Template caching and singleton views
- **[Memory Management](./memory-management.md)** - Cleanup and auto-cleanup
- **[Observables](./observables.md)** - Reactive state management
- **[Anchor](./anchor.md)** - Anchor

## Utilities

- **[Cache](./cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](./native-fetch.md)** - HTTP client with interceptors
- **[Filters](./filters.md)** - Data filtering helpers