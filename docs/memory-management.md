# Memory Management

NativeDocument includes an advanced automatic memory management system that prevents memory leaks and optimizes performance using modern browser APIs like FinalizationRegistry.

## Automatic Observable Cleanup

### How It Works

```javascript
const data = Observable("test");

// When 'data' goes out of scope and is garbage collected,
// NativeDocument automatically cleans up its internal listeners
// No manual cleanup required!

function createComponent() {
    const localObservable = Observable(42);
    return Div(localObservable); // Observable auto-cleaned when component is GC'd
}
```

### Memory Registry System

```javascript
// Each observable is automatically registered for cleanup
const count = Observable(0);
console.log(count.toString()); // "{{#ObItem::(1)}}" - Shows internal ID

// When count becomes unreachable, cleanup happens automatically
// via FinalizationRegistry
```

## Manual Memory Management

### Force Cleanup

```javascript
const obs = Observable("data");
const unsubscribe = obs.subscribe(console.log);

// Manual cleanup if needed
obs.cleanup(); // Removes all listeners immediately
// obs is now unusable - will warn on new subscriptions
```

### Global Cleanup

```javascript
// Clean all orphaned observables
Observable.cleanup(); // Force cleanup of all registered observables

// Auto-cleanup configuration
Observable.autoCleanup(true, {
    interval: 60000,    // Check every minute
    threshold: 100      // Clean when 100+ orphaned observables
});
```

## Performance Monitoring

### Debug Mode

```javascript
// Enable memory debugging
NativeDocument.debug.enable();

// Monitor cleanup events in console
const obs = Observable("test");
obs = null; // Will log cleanup when GC runs
```

### Memory Leak Detection

```javascript
// Check for potential leaks
window.addEventListener('beforeunload', () => {
    // Force cleanup on page unload
});
```

## Best Practices

1. **Trust the system** - Let automatic cleanup handle most cases
2. **Manual cleanup** only for critical resources or immediate needs
3. **Enable auto-cleanup** in long-running applications
4. **Use debug mode** during development to monitor memory usage

## Next Steps

- **[Anchor](anchor.md)** - Anchor