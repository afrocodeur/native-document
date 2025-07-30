# Observables

Observables are the reactive core of NativeDocument. They allow you to create values that automatically update in the user interface when they change.

## Creating Simple Observables

```javascript
// Create an observable with an initial value
const count = Observable(0);
const message = Observable("Hello World");
const isVisible = Observable(true);
```

## Reading and Modifying Values

```javascript
const name = Observable("John");

// Read the current value
console.log(name.val()); // "John"

// Using the proxy syntax (shorthand)
console.log(name.$value); // "John"

// Update the value
name.set("Jane");
console.log(name.val()); // "Jane"

// Update using proxy syntax
name.$value = "Bob";
console.log(name.val()); // "Bob"

// Update with a function
name.set(currentName => currentName.toUpperCase());
console.log(name.val()); // "BOB"
```

## Listening to Changes

```javascript
const counter = Observable(0);

// Subscribe to changes
counter.subscribe(newValue => {
  console.log("Counter is now:", newValue);
});

// Function will be called on every change
counter.set(1); // Logs: "Counter is now: 1"
counter.set(2); // Logs: "Counter is now: 2"
```

## Observable Objects vs Simple Objects

**Important distinction:**

```javascript
// Observable.object() creates a PROXY with reactive properties
const userProxy = Observable.object({
  name: "Alice",
  age: 25
});

// Each property is an individual observable
console.log(userProxy.name.val()); // "Alice"
userProxy.name.set("Bob");

// Get all values as plain object
console.log(userProxy.$val()); // { name: "Bob", age: 25 }
console.log(Observable.value(userProxy)); // { name: "Bob", age: 25 }

// Observable(object) creates a SINGLE observable containing the whole object
const userSingle = Observable({
  name: "Alice", 
  age: 25
});

// The entire object is the observable value
console.log(userSingle.val()); // { name: "Alice", age: 25 }
userSingle.set({ name: "Bob", age: 30 }); // Replace entire object
```

**Observable.object is an alias:**
```javascript
// These are identical
Observable.object(data) === Observable.json(data) === Observable.init(data)
```

## Working with Observable Proxies

```javascript
const user = Observable.object({
  name: "Alice",
  age: 25,
  email: "alice@example.com"
});

// Access individual properties (each is an observable)
console.log(user.name.val()); // "Alice"
console.log(user.name.$value); // "Alice" (proxy syntax)

// Update individual properties
user.name.set("Bob");
user.age.$value = 30; // Using proxy syntax

// Get the complete object value
console.log(user.$val()); // { name: "Bob", age: 30, email: "alice@example.com" }
console.log(Observable.value(user)); // Same as above

// Listen to individual property changes
user.name.subscribe(newName => {
  console.log("New name:", newName);
});

// Update multiple properties
Observable.update(user, {
  name: "Charlie",
  age: 35
});
```

```javascript
const todos = Observable.array([
  "Buy groceries",
  "Call doctor"
]);

// Add elements
todos.push("Clean house");

// Remove last element
todos.pop();

// Use array methods
const completed = todos.filter(todo => todo.includes("✓"));
```

## Computed Observables

Computed observables automatically recalculate when their dependencies change.

```javascript
const firstName = Observable("John");
const lastName = Observable("Doe");

// Updates automatically
const fullName = Observable.computed(() => {
  return `${firstName.val()} ${lastName.val()}`;
}, [firstName, lastName]);

console.log(fullName.val()); // "John Doe"

firstName.set("Jane");
console.log(fullName.val()); // "Jane Doe"
```

## Practical Example: Simple Counter

```javascript
const count = Observable(0);

const increment = () => count.set(count.val() + 1);
const decrement = () => (count.$value--);

// Reactive interface
const app = Div({ class: "counter" }, [
    Button("-").nd.on.click(decrement),
    Span({ class: "count" }, count), // Automatic display
    Button("+").nd.on.click(increment)
]);
```

## String Templates with Observables

### The .use() Method

```javascript
const name = Observable("Alice");
const age = Observable(25);

const template = "Hello ${name}, you are ${age} years old";
const message = template.use({ name, age });

console.log(message.val()); // "Hello Alice, you are 25 years old"

name.set("Bob");
console.log(message.val()); // "Hello Bob, you are 25 years old"
```

### Automatic Template Resolution

```javascript
const greeting = Observable("Hello");
const user = Observable("Marie");

// Observables are automatically integrated
const element = Div(null, `${greeting} ${user}!`);
// Updates when greeting or user changes
```

## Observable Checkers

Create derived observables with conditions:

```javascript
const age = Observable(17);
const isAdult = age.check(value => value >= 18);

console.log(isAdult.val()); // false

age.set(20);
console.log(isAdult.val()); // true
```

## Memory Management

```javascript
const data = Observable("test");

// Create a subscription
const unsubscribe = data.subscribe(value => console.log(value));

// Clean up manually if needed
unsubscribe();

// Complete observable cleanup
data.cleanup(); // Removes all listeners and prevents new subscriptions

// Manual trigger (useful for forcing updates)
data.trigger(); // Notifies all subscribers without changing the value

// Get original value (useful for reset functionality)
console.log(data.originalValue()); // Returns the initial value

// Extract values from any observable structure
const complexData = Observable.object({
    user: "John",
    items: [1, 2, 3]
});
console.log(Observable.value(complexData)); // Plain object with extracted values
```

## Best Practices

1. **Use descriptive names** for your observables
2. **Understand the difference**: `Observable(object)` vs `Observable.object(object)`
3. **Use proxies for convenience**: `obs.$value` instead of `obs.val()`
4. **Group related data** with `Observable.object()` for individual property reactivity
5. **Use `Observable.value()`** to extract plain values from complex structures
6. **Prefer computed** for derived values
7. **Clean up** unused observables to prevent memory leaks
8. **Use `trigger()`** when you need to force updates without value changes
9. **Avoid** direct modifications in subscription callbacks

## Next Steps

Now that you understand NativeDocument's observable, explore these advanced topics:

- **[Elements](docs/elements.md)** - Creating and composing UI
- **[Conditional Rendering](docs/conditional-rendering.md)** - Dynamic content
- **[Routing](docs/routing.md)** - Navigation and URL management
- **[State Management](docs/state-management.md)** - Global state patterns
- **[Lifecycle Events](docs/lifecycle-events.md)** - Lifecycle events
- **[Memory Management](docs/memory-management.md)** - Memory management
- **[Anchor](docs/anchor.md)** - Anchor