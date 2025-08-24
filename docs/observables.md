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
The `.subscribe()` method allows you to listen to every change in an observable. The callback receives both the new value and the previous value.

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

## Value-Specific Watchers with .on()

The `.on()` method allows you to watch for specific values in an observable. The callback is triggered twice: once with `true` when the value is reached, and once with `false` when the value changes to something else.

```javascript
const status = Observable("idle");

// Watch for specific value - callback called twice:
// - once with true when value is reached
// - once with false when value changes away
status.on("loading", (isActive) => {
  console.log(`Loading state: ${isActive}`);
});

status.on("success", (isActive) => {
  console.log(`Success state: ${isActive}`);
});

// Test the watchers
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

// Scenario: 1000 components, each watching different states

// ❌ .subscribe() - ALL 1000 callbacks run on EVERY change
for (let i = 0; i < 1000; i++) {
  status.subscribe(value => {
    if (value === `state-${i}`) updateComponent(i); // Only 1 cares, all 1000 run
  });
}

// ✅ .on() - Only relevant callback runs
for (let i = 0; i < 1000; i++) {
  status.on(`state-${i}`, (isActive) => {
    if (isActive) updateComponent(i); // Only this one runs
  });
}
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
console.log(userProxy.$value); // { name: "Bob", age: 25 }
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
console.log(user.$value); // { name: "Bob", age: 30, email: "alice@example.com" }
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
    Button("-").nd.onClick(decrement),
    Span({ class: "count" }, count), // Automatic display
    Button("+").nd.onClick(increment)
]);
```

# Batching Operations

Batching is a performance optimization technique that delays notifications to **dependent observers** (like computed observables) until the end of a batch operation. Individual observable subscribers still receive their notifications immediately, but computed observables that depend on the batch function are only triggered once at the end.

### Understanding Batch Behavior

```javascript
const name = Observable("John");
const age = Observable(25);

// Direct subscribers always get immediate notifications
name.subscribe(value => console.log("Name changed to:", value));
age.subscribe(value => console.log("Age changed to:", value));

const updateProfile = Observable.batch(() => {
    name.set("Alice");  // Logs: "Name changed to: Alice" 
    age.set(30);        // Logs: "Age changed to: 30"
});

updateProfile(); // Individual subscribers are notified immediately
```

### Batching with Computed Dependencies

The real power of batching shows when computed observables depend on the batch function:

```javascript
const firstName = Observable("John");
const lastName = Observable("Doe");

// Direct subscribers get immediate notifications
firstName.subscribe(name => console.log("First name:", name));
lastName.subscribe(name => console.log("Last name:", name));

// Batch function for name updates
const updateName = Observable.batch((first, last) => {
    firstName.set(first); // Logs: "First name: Alice"
    lastName.set(last);   // Logs: "Last name: Smith"
});

// Computed that depends on the BATCH FUNCTION (not individual observables)
const fullName = Observable.computed(() => {
    return `${firstName.val()} ${lastName.val()}`;
}, updateName); // ← Depends on the batch function

fullName.subscribe(name => console.log("Full name:", name));

// When we call the batch:
updateName("Alice", "Smith");
// Logs:
// "First name: Alice"     ← immediate notification
// "Last name: Smith"      ← immediate notification  
// "Full name: Alice Smith" ← single notification at the end
```

### Comparison: Normal vs Batch Dependencies

```javascript
const score = Observable(0);
const lives = Observable(3);

// Method 1: Computed depends on individual observables
const gameStatus1 = Observable.computed(() => {
    return `Score: ${score.val()}, Lives: ${lives.val()}`;
}, [score, lives]); // ← Depends on individual observables

// Method 2: Computed depends on batch function
const updateGame = Observable.batch(() => {
    score.set(score.val() + 100);
    lives.set(lives.val() - 1);
});

const gameStatus2 = Observable.computed(() => {
    return `Score: ${score.val()}, Lives: ${lives.val()}`;
}, updateGame); // ← Depends on the batch function

// Without batching - gameStatus1 recalculates twice:
score.set(100);  // gameStatus1 recalculates
lives.set(2);    // gameStatus1 recalculates again

// With batching - gameStatus2 recalculates only once:
updateGame();    // gameStatus2 recalculates only at the end
```

### Practical Example: Shopping Cart

```javascript
const items = Observable.array([]);
const discount = Observable(0);
const shippingCost = Observable(0);

// Individual subscribers for immediate UI updates
items.subscribe(items => {
    console.log('Items count : '+items.length);
});

discount.subscribe(discount => {
    console.log(`Discount: ${discount}%`);
});

// Batch function for cart operations
const updateCart = Observable.batch((cartData) => {
    items.splice(0); // Clear current items
    cartData.items.forEach(item => items.push(item));
    discount.set(cartData.discount);
    shippingCost.set(cartData.shipping);
});

// Expensive calculation that should only run after complete cart updates
const cartTotal = Observable.computed(() => {
    const itemsTotal = items.val().reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = itemsTotal * (discount.val() / 100);
    return itemsTotal - discountAmount + shippingCost.val();
}, updateCart); // ← Only recalculates when updateCart() is called

// Example usage
updateCart({
    items: [
        { name: "Product A", price: 29.99, quantity: 2 },
        { name: "Product B", price: 19.99, quantity: 1 }
    ],
    discount: 10,
    shipping: 5.99
});
// Individual subscribers fire immediately, cartTotal calculates once at the end
```

### Async Batching

Batch functions handle asynchronous operations, delaying dependent notifications until the promise resolves:

```javascript
const isLoading = Observable(false);
const userData = Observable(null);
const error = Observable(null);

// These subscribe immediately to loading states
isLoading.subscribe(loading => {
    console.log('Loading.....');
});

const fetchUser = Observable.batch(async (userId) => {
    isLoading.set(true);    // Immediate notification
    error.set(null);        // Immediate notification
    
    try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        userData.set(data);   // Immediate notification
    } catch (err) {
        error.set(err.message); // Immediate notification
    } finally {
        isLoading.set(false);   // Immediate notification
    }
    // Dependent computed observables are notified HERE
});

// This computed depends on the batch function
const userDisplay = Observable.computed(() => {
    if (isLoading.val()) return "Loading...";
    if (error.val()) return `Error: ${error.val()}`;
    if (userData.val()) return `Hello ${userData.val().name}`;
    return "No user";
}, fetchUser); // ← Only updates when fetchUser() completes

await fetchUser(123);
```

### Single Batch Dependency Only

**Important**: Computed observables can only depend on **one batch function**, not multiple:

```javascript
const user = Observable.object({ name: "", email: "" });
const settings = Observable.object({ theme: "light", lang: "en" });

const updateProfile = Observable.batch((profileData) => {
    user.name.set(profileData.name);
    user.email.set(profileData.email);
    settings.theme.set(profileData.theme);
    settings.lang.set(profileData.lang);
});

// ✅ Correct: Single batch dependency
const profileSummary = Observable.computed(() => {
    return {
        user: user.$value,
        settings: settings.$value,
        lastUpdated: Date.now()
    };
}, updateProfile); // ← Single batch function

// ❌ This is NOT supported:
// Observable.computed(callback, [batch1, batch2])
```

### Performance Benefits

```javascript
const items = Observable.array([]);

// Expensive computed operation
const expensiveCalculation = Observable.computed(() => {
    console.log("🔄 Recalculating..."); // This helps visualize when it runs
    return items.val()
        .filter(item => item.active)
        .map(item => item.price * item.quantity)
        .reduce((sum, total) => sum + total, 0);
}, [items]); // ← Depends on individual observable

const batchUpdateItems = Observable.batch(() => {
    items.push({ active: true, price: 10, quantity: 2 });
    items.push({ active: true, price: 15, quantity: 1 });
    items.push({ active: false, price: 20, quantity: 3 });
});

const optimizedCalculation = Observable.computed(() => {
    console.log("✅ Optimized recalculation");
    return items.val()
        .filter(item => item.active)
        .map(item => item.price * item.quantity)
        .reduce((sum, total) => sum + total, 0);
}, batchUpdateItems); // ← Depends on batch function

// Without batching:
items.push({ active: true, price: 10, quantity: 2 });  // 🔄 Recalculating...
items.push({ active: true, price: 15, quantity: 1 });  // 🔄 Recalculating...
items.push({ active: false, price: 20, quantity: 3 }); // 🔄 Recalculating...

// With batching:
batchUpdateItems(); // ✅ Optimized recalculation (only once!)
```

### Best Practices

1. **Use batch dependencies for expensive computations**: When you have costly computed observables that shouldn't recalculate on every individual change

2. **Keep individual subscribers for immediate feedback**: UI feedback like input validation should use direct subscriptions

3. **Batch related operations**: Group logically connected updates that should trigger dependent computations together

4. **Don't over-batch**: Only use batching when you have computed observables that benefit from delayed updates

### Common Patterns

### State Machine with Batched Transitions
```javascript
const gameState = Observable.object({
    level: 1,
    score: 0,
    lives: 3
});

// Individual subscribers for immediate UI updates
gameState.score.subscribe(score => updateScoreDisplay(score));
gameState.lives.subscribe(lives => updateLivesDisplay(lives));

// Batch function for state transitions
const levelUp = Observable.batch(() => {
    gameState.level.set(gameState.level.val() + 1);
    gameState.score.set(gameState.score.val() + 1000);
    gameState.lives.set(gameState.lives.val() + 1);
});

// Complex computed that should only run after complete transitions
const gameStatusMessage = Observable.computed(() => {
    const state = gameState.$value;
    return `Level ${state.level}: ${state.score} points, ${state.lives} lives remaining`;
}, levelUp); // ← Only updates when levelUp() is called
```

### When NOT to Use Batch Dependencies

- **Real-time updates**: When computed observables need to update immediately
- **Simple computations**: When the computational cost is minimal
- **Debugging**: Batching can make the flow harder to debug
- **Single observable changes**: No benefit when only one observable changes

The key insight is that batching in NativeDocument is about **controlling when dependent computed observables recalculate**, not about suppressing individual observable notifications.

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