# Lifecycle Events

NativeDocument provides lifecycle hooks that let you execute code when elements are added to or removed from the DOM. This is essential for setup, cleanup, and managing resources.

## Basic Lifecycle Hooks

### mounted() - Element Added to DOM

```javascript
const myComponent = Div("Hello World")
  .nd.mounted(element => {
    console.log("Element is now in the DOM!", element);
    // Setup code here
  });

document.body.appendChild(myComponent); // Triggers mounted callback
```

### unmounted() - Element Removed from DOM

```javascript
const myComponent = Div("Temporary content")
  .nd.unmounted(element => {
    console.log("Element removed from DOM!", element);
    // Cleanup external resources only
    // Element can be re-injected later
  });

// Later, when element is removed
myComponent.remove(); // Triggers unmounted callback
```

## Combined Lifecycle Management

```javascript
const timer = Div("Timer: 0")
  .nd.lifecycle({
    mounted(element) {
      console.log("Timer started");
      element.intervalId = setInterval(() => {
        element.textContent = `Timer: ${Date.now()}`;
      }, 1000);
    },
    unmounted(element) {
      console.log("Timer stopped");
      clearInterval(element.intervalId);
    }
  });
```

## Practical Examples

### Auto-focus Input Field

```javascript
const focusInput = Input({ placeholder: "Auto-focused" })
  .nd.mounted(input => {
    input.focus();
  });
```

### Event Listener Cleanup

```javascript

const MyButton = function() {
    const handler = () => console.log("Global click detected");
    return Button("Click me")
        .nd.mounted(button => {
            document.addEventListener('click', handler);
        })
        .nd.unmounted(button => {
            // Clean up external listeners, but keep observables intact
            document.removeEventListener('click', handler);
            // DON'T cleanup observables unless element won't be reused
        });
}
```

### Observable Management Warning

```javascript
const reusableComponent = Div()
  .nd.unmounted(element => {
    // AVOID: Don't cleanup observables if element might be re-injected
    // myObservable.cleanup(); // Only do this if element is permanently destroyed
    
    // GOOD: Only cleanup external resources
    clearInterval(element.timerId);
    element.websocket?.close();
  });

// Element can be safely re-appended later
document.body.appendChild(reusableComponent);
```

## Next Steps

Now that you understand lifecycle events, explore these related topics:

- **[Memory Management](docs/memory-management.md)** - Memory management
- **[Anchor](docs/anchor.md)** - Anchor




