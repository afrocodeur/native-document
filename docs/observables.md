# Observables

Observables are the reactive core of NativeDocument. They allow you to create values that automatically update in the user interface when they change.

## Creating Simple Observables

```javascript
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

The `.subscribe()` method allows you to listen to every change in an observable. The callback receives both the new value and the previous value.

```javascript
const counter = Observable(0);

counter.subscribe(newValue => {
    console.log("Counter is now:", newValue);
});

counter.set(1); // Logs: "Counter is now: 1"
counter.set(2); // Logs: "Counter is now: 2"
```

## Value-Specific Watchers with .on()

The `.on()` method allows you to watch for specific values in an observable. The callback is triggered twice: once with `true` when the value is reached, and once with `false` when the value changes to something else.

```javascript
const status = Observable("idle");

status.on("loading", (isActive) => {
    console.log(`Loading state: ${isActive}`);
});

status.on("success", (isActive) => {
    console.log(`Success state: ${isActive}`);
});

status.set("loading"); // Logs: "Loading state: true"
status.set("success"); // Logs: "Loading state: false", "Success state: true"
status.set("idle");    // Logs: "Success state: false"
```

**Key Features:**
- Works with all value types (string, number, boolean...)
- Can use an observable as callback (will be set to true/false automatically)
- Returns an unsubscribe function for cleanup
- More efficient than `.subscribe()` when only watching specific values

**Comparison with .subscribe():**
- `.subscribe()`: called on EVERY change with old/new values
- `.on()`: called when **entering** a specific value (true) and when **leaving** it (false)

## .on() vs .subscribe() Comparison

| Aspect | `.on(value, callback)` | `.subscribe(callback)` |
|--------|------------------------|------------------------|
| **When Called** | Only when entering/leaving specific values | On every value change |
| **Callback Signature** | `(isActive: boolean) => void` | `(newValue, oldValue) => void` |
| **Performance** | ✅ Efficient with many watchers | ❌ Slow with many subscribers |
| **Use Case** | Watching specific states/values | General change detection |
| **Example** | `status.on("loading", show => ...)` | `status.subscribe((new, old) => ...)` |

### Performance Impact Example

```javascript
const status = Observable("idle");

// ❌ .subscribe() — ALL 1000 callbacks run on EVERY change
for (let i = 0; i < 1000; i++) {
    status.subscribe(value => {
        if (value === `state-${i}`) updateComponent(i);
    });
}

// ✅ .on() — Only relevant callback runs
for (let i = 0; i < 1000; i++) {
    status.on(`state-${i}`, (isActive) => {
        if (isActive) updateComponent(i);
    });
}
```

## Observable .when() Method

The `.when()` method creates a transitive object that passes the observable and target value without creating additional observables. It's memory-efficient for conditional operations like CSS class binding.

```javascript
observable.when(targetValue)
```

Returns an object with `{$target: targetValue, $observer: observable}` that can be used with conditional operations.

### Primary Use Case: CSS Class Binding

```javascript
const status = Observable("loading");

const element = Div({
    class: {
        "spinner": status.when("loading"),
        "success": status.when("success"),
        "error":   status.when("error")
    }
});
```

### Benefits

- **Zero memory overhead**: No new observables created
- **Optimized for class binding**: Works seamlessly with NativeDocument's class system
- **Simple API**: Just pass the value to watch for

## Method Comparison

| Method | Memory Impact | Use Case | Return Value               |
|--------|---------------|----------|----------------------------|
| `.when(value)` | ✅ Zero — transitive object | CSS classes, conditional checks | `{$target, $observer}`     |
| `.on(value, callback)` | ✅ Minimal — single listener per value | Specific value watching | void                       |
| `.check(callback)` | ❌ Creates new ObservableChecker | Complex conditions | ObservableChecker instance |
| `.subscribe(callback)` | ❌ Creates listener for all changes | General change detection | void                       |

## Observable Checkers

Create derived observables with conditions or transformations. All aliases point to the same underlying `ObservableChecker` — use whichever reads most naturally for your use case.

```javascript
const age = Observable(17);

// check — canonical name
const isAdult = age.check(value => value >= 18);
console.log(isAdult.val()); // false

age.set(20);
console.log(isAdult.val()); // true
```

### Available Aliases

| Alias | Best suited for |
|-------|-----------------|
| `.check(fn)` | General conditions |
| `.is(fn)` | Boolean / state checks |
| `.select(fn)` | Extracting a field |
| `.pluck(fn)` | Extracting a field (Lodash style) |
| `.transform(fn)` | Explicit value transformation |

```javascript
// All return an ObservableChecker — pick what reads best
ShowIf(user.is(u => u.isAdmin), AdminPanel())

const email = user.select(u => u.email);
const label = status.transform(s => s.toUpperCase());
const name  = user.pluck(u => u.name);
```

## Observable Objects vs Simple Objects

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
console.log(userProxy.$value);           // { name: "Bob", age: 25 }
console.log(Observable.value(userProxy)); // { name: "Bob", age: 25 }

// Observable(object) creates a SINGLE observable containing the whole object
const userSingle = Observable({
    name: "Alice",
    age: 25
});

console.log(userSingle.val()); // { name: "Alice", age: 25 }
userSingle.set({ name: "Bob", age: 30 });
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

// Access individual properties
console.log(user.name.val());    // "Alice"
console.log(user.name.$value);   // "Alice"

// Update individual properties
user.name.set("Bob");
user.age.$value = 30;

// Get the complete object value
console.log(user.$value);             // { name: "Bob", age: 30, email: "alice@example.com" }
console.log(Observable.value(user));  // Same as above

// Listen to individual property changes
user.name.subscribe(newName => {
    console.log("New name:", newName);
});

// Update multiple properties at once
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

todos.push("Clean house");
todos.pop();

const completed = todos.filter(todo => todo.includes("✓"));
```

## Computed Observables

Computed observables automatically recalculate when their dependencies change.

```javascript
const firstName = Observable("John");
const lastName  = Observable("Doe");

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

const app = Div({ class: "counter" }, [
    Button("-").nd.onClick(decrement),
    Span({ class: "count" }, count),
    Button("+").nd.onClick(increment)
]);
```

## Batching Operations

Batching is a performance optimization technique that delays notifications to **dependent computed observables** until the end of a batch operation. Individual observable subscribers still receive their notifications immediately.

### Understanding Batch Behavior

```javascript
const name = Observable("John");
const age  = Observable(25);

name.subscribe(value => console.log("Name changed to:", value));
age.subscribe(value  => console.log("Age changed to:", value));

const updateProfile = Observable.batch(() => {
    name.set("Alice"); // Logs: "Name changed to: Alice"
    age.set(30);       // Logs: "Age changed to: 30"
});

updateProfile(); // Individual subscribers are notified immediately
```

### Batching with Computed Dependencies

```javascript
const firstName = Observable("John");
const lastName  = Observable("Doe");

firstName.subscribe(name => console.log("First name:", name));
lastName.subscribe(name  => console.log("Last name:", name));

const updateName = Observable.batch((first, last) => {
    firstName.set(first); // Logs: "First name: Alice"
    lastName.set(last);   // Logs: "Last name: Smith"
});

const fullName = Observable.computed(() => {
    return `${firstName.val()} ${lastName.val()}`;
}, updateName); // ← Depends on the batch function

fullName.subscribe(name => console.log("Full name:", name));

updateName("Alice", "Smith");
// Logs:
// "First name: Alice"      ← immediate
// "Last name: Smith"       ← immediate
// "Full name: Alice Smith" ← single notification at the end
```

### Comparison: Normal vs Batch Dependencies

```javascript
const score = Observable(0);
const lives = Observable(3);

// Method 1: depends on individual observables — recalculates twice
const gameStatus1 = Observable.computed(() => {
    return `Score: ${score.val()}, Lives: ${lives.val()}`;
}, [score, lives]);

// Method 2: depends on batch function — recalculates once
const updateGame = Observable.batch(() => {
    score.set(score.val() + 100);
    lives.set(lives.val() - 1);
});

const gameStatus2 = Observable.computed(() => {
    return `Score: ${score.val()}, Lives: ${lives.val()}`;
}, updateGame);

score.set(100); // gameStatus1 recalculates
lives.set(2);   // gameStatus1 recalculates again

updateGame();   // gameStatus2 recalculates only once
```

### Practical Example: Shopping Cart

```javascript
const items        = Observable.array([]);
const discount     = Observable(0);
const shippingCost = Observable(0);

items.subscribe(items       => console.log('Items count: ' + items.length));
discount.subscribe(discount => console.log(`Discount: ${discount}%`));

const updateCart = Observable.batch((cartData) => {
    items.splice(0);
    cartData.items.forEach(item => items.push(item));
    discount.set(cartData.discount);
    shippingCost.set(cartData.shipping);
});

const cartTotal = Observable.computed(() => {
    const itemsTotal      = items.val().reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount  = itemsTotal * (discount.val() / 100);
    return itemsTotal - discountAmount + shippingCost.val();
}, updateCart);

updateCart({
    items: [
        { name: "Product A", price: 29.99, quantity: 2 },
        { name: "Product B", price: 19.99, quantity: 1 }
    ],
    discount: 10,
    shipping: 5.99
});
```

### Async Batching

```javascript
const isLoading = Observable(false);
const userData  = Observable(null);
const error     = Observable(null);

isLoading.subscribe(loading => console.log('Loading.....'));

const fetchUser = Observable.batch(async (userId) => {
    isLoading.set(true);
    error.set(null);

    try {
        const response = await fetch(`/api/users/${userId}`);
        const data     = await response.json();
        userData.set(data);
    } catch (err) {
        error.set(err.message);
    } finally {
        isLoading.set(false);
    }
});

const userDisplay = Observable.computed(() => {
    if (isLoading.val()) return "Loading...";
    if (error.val())     return `Error: ${error.val()}`;
    if (userData.val())  return `Hello ${userData.val().name}`;
    return "No user";
}, fetchUser);

await fetchUser(123);
```

### Single Batch Dependency Only

Computed observables can only depend on **one batch function**, not multiple:

```javascript
const updateProfile = Observable.batch((profileData) => {
    user.name.set(profileData.name);
    user.email.set(profileData.email);
    settings.theme.set(profileData.theme);
});

// ✅ Single batch dependency
const profileSummary = Observable.computed(() => ({
    user:        user.$value,
    settings:    settings.$value,
    lastUpdated: Date.now()
}), updateProfile);

// ❌ Not supported
// Observable.computed(callback, [batch1, batch2])
```

### Best Practices

- Use batch dependencies for expensive computations that shouldn't recalculate on every individual change
- Keep individual subscribers for immediate feedback (input validation, UI updates)
- Group logically connected updates that should trigger dependent computations together
- Don't over-batch — only use when computed observables benefit from delayed updates

### When NOT to Use Batch Dependencies

- Real-time updates where computed observables need to update immediately
- Simple computations where the cost is minimal
- Debugging contexts — batching can make the flow harder to trace
- Single observable changes — no benefit when only one observable changes

## String Templates with Observables

### The .use() Method

```javascript
const name = Observable("Alice");
const age  = Observable(25);

const template = "Hello ${name}, you are ${age} years old";
const message  = template.use({ name, age });

console.log(message.val()); // "Hello Alice, you are 25 years old"

name.set("Bob");
console.log(message.val()); // "Hello Bob, you are 25 years old"
```

### Automatic Template Resolution

```javascript
const greeting = Observable("Hello");
const user     = Observable("Marie");

const element = Div(null, `${greeting} ${user}!`);
// Updates when greeting or user changes
```

## Memory Management

```javascript
const data = Observable("test");

const handler = value => console.log(value);
data.subscribe(handler);

// Remove specific subscription
data.unsubscribe(handler);

// Complete observable cleanup
data.cleanup(); // Removes all listeners and prevents new subscriptions

// Manual trigger — forces update without changing the value
data.trigger();

// Extract values from any observable structure
const complexData = Observable.object({ user: "John", items: [1, 2, 3] });
console.log(Observable.value(complexData)); // Plain object with extracted values
```

## Utility Methods

### `off(value, callback?)` — Remove Watchers

```javascript
const status = Observable("idle");

const loadingHandler = (isActive) => console.log("Loading:", isActive);
status.on("loading", loadingHandler);

status.off("loading", loadingHandler); // Remove specific callback
status.off("loading");                 // Remove all watchers for this value
```

### `once(predicate, callback)` — Single-Time Listener

```javascript
const count = Observable(0);

count.once(5, (value) => {
    console.log("Reached 5!"); // Only called once
});

count.once(val => val > 10, (value) => {
    console.log("Greater than 10!"); // Only called once
});

count.set(5); // Callback fires and unsubscribes
count.set(5); // Callback doesn't fire again
```

### `toggle()` — Boolean Toggle

```javascript
const isVisible = Observable(false);

isVisible.toggle(); // true
isVisible.toggle(); // false

Button("Toggle").nd.onClick(() => isVisible.toggle());
```

### `reset()` — Reset to Initial Value

```javascript
const name = Observable("Alice", { reset: true });

name.set("Bob");
name.reset();
console.log(name.val()); // "Alice"

const user = Observable({ name: "Alice", age: 25 }, { reset: true });
user.set({ name: "Bob", age: 30 });
user.reset(); // Back to { name: "Alice", age: 25 }
```

### `equals(other)` — Value Comparison

```javascript
const num1 = Observable(5);
const num2 = Observable(5);
const num3 = Observable(10);

console.log(num1.equals(num2)); // true
console.log(num1.equals(5));    // true
console.log(num1.equals(num3)); // false
```

### `toBool()` — Boolean Conversion

```javascript
const text = Observable("");
console.log(text.toBool()); // false

text.set("Hello");
console.log(text.toBool()); // true
```

### `intercept(callback)` — Value Interception

```javascript
const age = Observable(0);

age.intercept((newValue, oldValue) => {
    if (newValue < 0)   return 0;
    if (newValue > 120) return 120;
    return newValue;
});

age.set(-5);  // Sets 0
age.set(150); // Sets 120
age.set(25);  // Sets 25

const username = Observable("");
username.intercept((value) => value.toLowerCase().trim());

username.set("  JohnDoe  ");
console.log(username.val()); // "johndoe"
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

- **[Elements](elements.md)** - Creating and composing UI
- **[Conditional Rendering](conditional-rendering.md)** - Dynamic content
- **[List Rendering](list-rendering.md)** - (ForEach | ForEachArray) and dynamic lists
- **[Routing](routing.md)** - Navigation and URL management
- **[State Management](state-management.md)** - Global state patterns
- **[Lifecycle Events](lifecycle-events.md)** - Lifecycle events
- **[NDElement](native-document-element.md)** - Native Document Element
- **[Extending NDElement](extending-native-document-element.md)** - Custom Methods Guide
- **[Args Validation](validation.md)** - Function Argument Validation
- **[Memory Management](memory-management.md)** - Memory management
- **[Anchor](anchor.md)** - Anchor

## Utilities

- **[Cache](docs/utils/cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](docs/utils/native-fetch.md)** - HTTP client with interceptors
- **[Filters](docs/utils/filters.md)** - Data filtering helpers