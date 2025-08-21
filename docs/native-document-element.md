# NDElement

`NDElement` is a wrapper class that enhances native HTML elements with utility methods and simplified event handlers. It enables fluent DOM manipulation while preserving access to the underlying HTML element.

## Accessing NDElement

Every HTML element created with NativeDocument automatically has an `nd` property that returns an `NDElement` instance:

```javascript
const element = Div("Hello World");
const ndElement = element.nd; // NDElement instance

// Or directly with method chaining
Div("Hello").nd.onClick(() => console.log("Clicked!"));
```

## Constructor

```javascript
new NDElement(element)
```

**Parameters:**
- `element`: The HTML element to wrap

## Properties

### `$element`
The encapsulated native HTML element.

```javascript
const div = Div("Content");
const htmlElement = div.nd.$element; // Native HTMLDivElement
```

### `$observer`
Lifecycle observer (used internally for DOM monitoring).

## Event Handling Methods

NDElement automatically generates methods for all standard DOM events with multiple variants:

### Basic Events

```javascript
// Standard event
element.nd.onClick(callback)
element.nd.onMouseOver(callback)
element.nd.onKeyDown(callback)

// Examples
Button("Click me").nd.onClick(e => console.log("Button clicked!"));
Input().nd.onInput(e => console.log("Input changed:", e.target.value));
```

### Prevention Variants

```javascript
// Prevents default behavior
element.nd.onPreventClick(callback) // preventDefault()
element.nd.onPreventSubmit(callback)

// Example
Link({ href: "/page" }).nd.onPreventClick(e => {
    // Link won't navigate, custom behavior
    router.push("/page");
});
```

### Propagation Stop Variants

```javascript
// Stops event propagation
element.nd.onStopClick(callback) // stopPropagation()
element.nd.onStopKeyDown(callback)

// Example
Div([
    Button("Child").nd.onStopClick(e => {
        console.log("Child clicked - won't bubble up");
    })
]).nd.onClick(() => console.log("This won't be called"));
```

### Combined Variants

```javascript
// Combines preventDefault() and stopPropagation()
element.nd.onPreventStopSubmit(callback)
element.nd.onPreventStopClick(callback)

// Example
Form().nd.onPreventStopSubmit(e => {
    // Prevents submission AND stops propagation
    handleFormSubmit(e);
});
```

### Supported Events List

All standard DOM events are supported with the 4 variants:

**Mouse:** Click, DblClick, MouseDown, MouseEnter, MouseLeave, MouseMove, MouseOut, MouseOver, MouseUp, Wheel

**Keyboard:** KeyDown, KeyPress, KeyUp

**Form:** Blur, Change, Focus, Input, Invalid, Reset, Search, Select, Submit

**Drag & Drop:** Drag, DragEnd, DragEnter, DragLeave, DragOver, DragStart, Drop

**Media:** Abort, CanPlay, CanPlayThrough, DurationChange, Emptied, Ended, LoadedData, LoadedMetadata, LoadStart, Pause, Play, Playing, Progress, RateChange, Seeked, Seeking, Stalled, Suspend, TimeUpdate, VolumeChange, Waiting

**Window:** AfterPrint, BeforePrint, BeforeUnload, Error, HashChange, Load, Offline, Online, PageHide, PageShow, Resize, Scroll, Unload

## Utility Methods

### `ref(target, name)`
Assigns the HTML element to a property of a target object.

```javascript
const refs = {};
Div("Content").nd.ref(refs, 'contentDiv');
console.log(refs.contentDiv); // HTMLDivElement
```

### `htmlElement()` / `node()`
Returns the native HTML element (alias for `$element`).

```javascript
const div = Div("Hello");
const htmlElement = div.nd.htmlElement(); // HTMLDivElement
const node = div.nd.node(); // Same thing, alias
```

### `remove()`
Removes the element and cleans up its internal references.

```javascript
const element = Div("To be removed");
element.nd.remove(); // Element removed and cleaned
```

### `unmountChildren()`
Unmounts all child elements and cleans up their references.

```javascript
const container = Div([
    Div("Child 1"),
    Div("Child 2")
]);
container.nd.unmountChildren(); // Children cleaned up
```

## Lifecycle Management

### `lifecycle(states)`
Configures lifecycle callbacks.

```javascript
element.nd.lifecycle({
    mounted: (element) => console.log("Element added to DOM"),
    unmounted: (element) => console.log("Element removed from DOM")
});
```

### `mounted(callback)`
Shortcut to define only the mount callback.

```javascript
Div("Content").nd.mounted(element => {
    console.log("Element is now in the DOM!");
});
```

## Practical Examples

### Custom Event Handler

```javascript
// Extending NDElement with a custom handler
NDElement.prototype.onEnter = function(callback) {
    this.$element.addEventListener('keyup', e => {
        if (e.key === 'Enter') {
            callback(e);
        }
    });
    return this;
};

// Usage
Input({ type: 'text' })
    .nd.onEnter(e => console.log("Enter pressed!"));
```

### Fluent Chaining

```javascript
const interactiveButton = Button("Interactive")
    .nd.onClick(e => console.log("Clicked"))
    .nd.onMouseEnter(e => e.target.style.background = "blue")
    .nd.onMouseLeave(e => e.target.style.background = "")
    .nd.mounted(el => console.log("Button mounted"));

// OR 

const interactiveButton = Button("Interactive")
    .nd.onClick(e => console.log("Clicked"))
    .onMouseEnter(e => e.target.style.background = "blue")
    .onMouseLeave(e => e.target.style.background = "")
    .mounted(el => console.log("Button mounted"));

```

### Form with Event Handling

```javascript
const todoForm = Form([
    Input({ type: 'text', value: newTodo })
        .nd.onEnter(addTodo),
    
    Button('Add', { type: 'submit' })
]).nd.onPreventSubmit(addTodo);
```

### Reference Management

```javascript
const components = {};

const app = Div([
    Input().nd.ref(components, 'input'),
    Button('Focus Input').nd.onClick(() => {
        components.input.focus();
    })
]);
```

## Integration with Observables

NDElement works seamlessly with NativeDocument's Observable system:

```javascript
const isVisible = Observable(false);
const message = Observable("Hello");

Div([
    Button("Toggle").nd.onClick(() => isVisible.set(!isVisible.val())),
    ShowIf(isVisible, () => 
        P(message).nd.onClick(() => 
            message.set("Clicked!")
        )
    )
]);
```

## Best Practices

1. **Fluent chaining**: Use method chaining for concise syntax
2. **Cleanup**: Call `remove()` to clean up dynamic elements
3. **Extensions**: Add your own methods to the prototype for specific needs
4. **Lifecycle**: Use `mounted`/`unmounted` for initialization/cleanup
5. **References**: Use `ref()` for direct element access when needed

## Limitations

- Event handlers are not automatically removed (manual management required if needed)
- Access to native HTML element is still necessary for advanced APIs

NDElement thus provides a practical abstraction layer while preserving the power and performance of native DOM.


## Next Steps

Explore these related topics to build complete applications:

- **[Extending NDElement](extending-native-document-element.md)** - Custom Methods Guide
- **[Args Validation](validation.md)** - Function Argument Validation
- **[Memory Management](memory-management.md)** - Memory management
- **[Anchor](anchor.md)** - Anchor