---
title: Observables
description: Reactive state management at the core of NativeDocument - create values that automatically update the UI when they change
---

# Observables

Observables are the reactive core of NativeDocument. They wrap values and automatically update the UI when those values change.

## Creating Observables

```javascript
const count     = Observable(0);
const message   = Observable('Hello World');
const isVisible = Observable(true);
```

## Reading and Modifying Values

```javascript
const name = Observable('John');

// Read the current value
console.log(name.val());    // "John"
console.log(name.$value);   // "John" - proxy shorthand

// Update the value
name.set('Jane');
console.log(name.val());    // "Jane"

// Update with proxy syntax
name.$value = 'Bob';
console.log(name.val());    // "Bob"

// Update with a function
name.set(current => current.toUpperCase());
console.log(name.val());    // "BOB"
```

## Listening to Changes

`.subscribe()` runs on every value change, receiving the new and old values:

```javascript
const counter = Observable(0);

counter.subscribe((newValue, oldValue) => {
    console.log(`Counter: ${oldValue} -> ${newValue}`);
});

counter.set(1); // "Counter: 0 -> 1"
counter.set(2); // "Counter: 1 -> 2"
```

## Value-Specific Watchers - `.on()`

`.on()` fires only when a specific value is entered (passes `true`) or left (passes `false`). More efficient than `.subscribe()` when you only care about specific states:

```javascript
const status = Observable('idle');

status.on('loading', (isActive) => {
    console.log(`Loading state: ${isActive}`);
});

status.on('success', (isActive) => {
    console.log(`Success state: ${isActive}`);
});

status.set('loading'); // "Loading state: true"
status.set('success'); // "Loading state: false", "Success state: true"
status.set('idle');    // "Success state: false"
```

| | `.on(value, callback)` | `.subscribe(callback)` |
|---|---|---|
| **When called** | Entering / leaving a specific value | Every change |
| **Signature** | `(isActive: boolean) => void` | `(newValue, oldValue) => void` |
| **Performance** | Only relevant callbacks run | All callbacks run on every change |
| **Use case** | Specific states | General change detection |

## `.when()` - Lightweight Conditional

`.when()` creates a lightweight transitive object (no new observable) - ideal for CSS class binding:

```javascript
const status = Observable('loading');

const element = Div({
    class: {
        'spinner': status.when('loading'),
        'success': status.when('success'),
        'error':   status.when('error')
    }
});
```

## Observable Checkers

Observable checkers are derived observables that transform or evaluate the current value. The aliases `.check()`, `.is()`, `.select()`, `.pluck()`, and `.transform()` all create the same `ObservableChecker` - they exist purely to make code more expressive and readable:

```javascript
const age = Observable(17);

const isAdult = age.check(value => value >= 18);
console.log(isAdult.val()); // false

age.set(20);
console.log(isAdult.val()); // true
```

| Alias | Best suited for |
|---|---|
| `.check(fn)` | General conditions |
| `.is(fn \| value)` | Boolean / state checks |
| `.select(fn)` | Extracting a field |
| `.pluck(property)` | Extracting a field (Lodash-style) |
| `.transform(fn)` | Explicit value transformation |

```javascript
ShowIf(user.is(u => u.isAdmin), AdminPanel)

const email  = user.select(u => u.email);
const label  = status.transform(s => s.toUpperCase());
const name   = user.pluck('name');
```

## Utility Methods

### `toggle()` - Boolean toggle

```javascript
const isVisible = Observable(false);

isVisible.toggle(); // true
isVisible.toggle(); // false

Button('Toggle').nd.onClick(() => isVisible.toggle());
```

### `equals()` / `toBool()`

```javascript
const num = Observable(5);

console.log(num.equals(5));             // true
console.log(num.equals(Observable(5))); // true

const text = Observable('');
console.log(text.toBool()); // false
text.set('Hello');
console.log(text.toBool()); // true
```

### Convenience checkers - `is...()`

All `is...()` methods return an `ObservableChecker<boolean>` and accept an observable or a plain value where noted:

| Method | Returns `true` when... |
|---|---|
| `isTruthy()` | value is truthy |
| `isFalsy()` | value is falsy |
| `isNull()` | value is `null` or `undefined` |
| `isEmpty()` | value is `null`, `''`, or an empty array |
| `isNotEmpty()` | value is not `null`, not `''`, and not an empty array |
| `isEqualTo(value)` | value equals `value` (observable-aware) |
| `isNotEqualTo(value)` | value does not equal `value` (observable-aware) |
| `isGreaterThan(value)` | value > `value` (observable-aware) |
| `isGreaterThanOrEqualTo(value)` | value >= `value` (observable-aware) |
| `isLessThan(value)` | value < `value` (observable-aware) |
| `isLessThanOrEqualTo(value)` | value <= `value` (observable-aware) |
| `isBetween(min, max)` | min <= value <= max (observable-aware) |
| `isStartingWith(str)` | string starts with `str` (observable-aware) |
| `isEndingWith(str)` | string ends with `str` (observable-aware) |
| `isMatchingPattern(regex)` | string matches `regex` (observable-aware) |
| `isIncludes(value)` | array includes `value`, or string contains `value` (observable-aware) |
| `isIncludedIn(array)` / `isOneOf(array)` | value is in `array` (observable-aware) |
| `isHaving(key)` | object has property `key` (observable-aware) |

```javascript
const score  = Observable(72);
const list   = Observable.array([]);
const name   = Observable('');
const status = Observable('active');
const user   = Observable({ role: 'admin' });
const minAge = Observable(18);

ShowIf(list.isEmpty(),                         Div('No items yet'))
ShowIf(name.isFalsy(),                         Div('Name is required'))
ShowIf(name.isTruthy(),                        Div(['Hello, ', name]))
ShowIf(score.isGreaterThan(50),                Div('Passing grade'))
ShowIf(score.isBetween(0, 100),                Div('Valid score'))
ShowIf(score.isBetween(minAge, 100),           Div('Reactive min'))
ShowIf(name.isStartingWith('A'),               Div('Starts with A'))
ShowIf(status.isOneOf(['active', 'pending']),  Div('In progress'))
ShowIf(user.isHaving('role'),                  Div('Has a role'))
```

### Convenience transformers - `to...()`

All `to...()` methods return an `ObservableChecker<any>` - a derived observable with the transformed value:

| Method | Returns... |
|---|---|
| `toUpperCase()` | uppercased string |
| `toLowerCase()` | lowercased string |
| `toTrimmed()` | trimmed string |
| `toBoolean()` | `!!value` |
| `toLiteral(template, placeholder?)` / `toFormatted(...)` | string with value interpolated into template |
| `toProperty(key)` | deep property via dot-path (e.g. `'address.city'`) |
| `toLength()` | length of string or array (`0` if null) |
| `toClamped(min, max)` | value clamped between min and max (observable-aware) |
| `toPercent(total)` | `(value / total) * 100` (observable-aware) |

```javascript
const name     = Observable('  Alice  ');
const score    = Observable(72);
const progress = Observable(350);
const user     = Observable({ address: { city: 'Paris' } });

name.toTrimmed()                          // "Alice"
name.toUpperCase()                        // "  ALICE  "
score.toClamped(0, 100)                   // 72
score.toClamped(Observable(0), 100)       // reactive min
progress.toPercent(500)                   // 70
user.toProperty('address.city')           // "Paris"

name.toLiteral('Hello ${v}!')             // "Hello   Alice  !"
name.toTrimmed().toLiteral('Hello ${v}!') // "Hello Alice!"

name.toLiteral('Hello [name]!', '[name]') // custom placeholder
```

### `reset()` - Reset to initial value

```javascript
const name = Observable('Alice', { reset: true });

name.set('Bob');
name.reset();
console.log(name.val()); // "Alice"
```

### `intercept(callback)` - Transform or abort before setting

The interceptor runs before every `.set()` call. Return a new value to replace it, or return `undefined` to abort the assignment entirely:

```javascript
const age = Observable(0);

age.intercept((newValue, currentValue) => {
    if (newValue < 0)   return 0;   // clamp minimum
    if (newValue > 120) return 120; // clamp maximum
    return newValue;
});

age.set(-5);  // sets 0
age.set(150); // sets 120
age.set(25);  // sets 25

// Abort example - reject the value without changing anything
const username = Observable('alice');

username.intercept((newValue, currentValue) => {
    if (newValue.trim() === '') return undefined; // abort - keeps 'alice'
    return newValue.toLowerCase().trim();
});

username.set('');        // aborted - still 'alice'
username.set('  Bob  '); // sets 'bob'
```

### `interceptMutations(callback)` - Intercept array/object mutations

Intercepts mutations (push, splice, etc.) on arrays and objects separately from `.intercept()`:

```javascript
const items = Observable.array([]);

items.interceptMutations((operations) => {
    console.log('Mutation:', operations);
});

items.push('apple'); // logs mutation details
```

### `once(predicate, callback)` - Single-time listener

```javascript
const count = Observable(0);

count.once(5, () => console.log('Reached 5!'));           // fires once when value === 5
count.once(val => val > 10, () => console.log('Over 10!')); // fires once on condition

count.set(5);  // "Reached 5!"
count.set(5);  // nothing - already fired
```

### `off(value, callback?)` - Remove watchers

```javascript
const status = Observable('idle');
const handler = (isActive) => console.log('Loading:', isActive);

status.on('loading', handler);

status.off('loading', handler); // remove specific callback
status.off('loading');          // remove all watchers for this value
```

### `onCleanup(callback)` - Register cleanup callback

Registers a callback that runs when the observable is cleaned up:

```javascript
const data = Observable('test');

data.onCleanup(() => {
    console.log('Observable cleaned up');
});

data.cleanup(); // triggers the cleanup callback
```

### `persist(key, options?)` - Bind to localStorage

Automatically saves on every change and restores on load:

```javascript
const theme = Observable('light').persist('theme');
theme.set('dark'); // saved to localStorage

// On next page load
const theme = Observable('light').persist('theme');
theme.val(); // "dark" - restored
```

With transform options:

```javascript
const selectedDate = Observable(new Date()).persist('event:date', {
    get: value => new Date(value),    // transform on load
    set: value => value.toISOString() // transform on save
});
```

### `clone()` - Create a copy

Creates a deep clone of the observable's current value:

```javascript
const original = Observable({ name: 'Alice', scores: [1, 2, 3] });
const copy = original.clone();

copy.set({ ...copy.val(), name: 'Bob' });
original.val().name; // still "Alice"
```

### `resolve()` - Extract plain value

Recursively extracts plain values from observables, arrays, and proxies:

```javascript
const name = Observable('Alice');
name.resolve(); // "Alice" - same as Observable.value(name)

const user = Observable.object({ name: Observable('Bob') });
Observable.value(user); // { name: 'Bob' } - deeply resolved
```

### `trigger()` - Force update without value change

```javascript
const data = Observable('test');
data.trigger(); // notifies all subscribers without changing the value
```

### `cleanup()` - Remove all listeners

```javascript
const data = Observable('test');
data.cleanup(); // removes all listeners and prevents new subscriptions
```

### `deepSubscribe(callback)` - Deep change detection

Reacts to changes at any depth - array mutations and property changes on nested observables:

```javascript
const tags = Observable.array([{ label: Observable('admin') }]);

const unsub = tags.deepSubscribe(value => console.log('changed:', value));

tags.push({ label: Observable('editor') }); // triggers
tags.at(0).label.set('superadmin');         // triggers
tags.splice(0, 1);                          // triggers + cleans up listener

unsub(); // manual cleanup
```

---

## Observable Static Methods

### `Observable.setLocale(locale)`

Sets the locale observable used by `.format()`. Accepts an observable or a plain string:

```javascript
Observable.setLocale(I18nService.current); // observable (recommended)
Observable.setLocale(Observable('fr'));     // plain observable
Observable.setLocale('fr');                // plain string - wrapped automatically
```

### `Observable.value(data)`

Recursively extracts plain values from observables, arrays, and proxies:

```javascript
Observable.value(Observable(42));                    // 42
Observable.value(Observable.array([Observable(1)])); // [1]
Observable.value(Observable.object({ n: Observable('x') })); // { n: 'x' }
Observable.value('plain string');                    // 'plain string'
```

### `Observable.cleanup(observable)`

Static alias for `observable.cleanup()`:

```javascript
Observable.cleanup(myObservable);
```

### `Observable.autoCleanup(enable, options?)`

Enables automatic cleanup on page unload and via a periodic interval:

```javascript
Observable.autoCleanup(true, {
    interval:  60000, // run cleanup every 60s (default)
    threshold: 100    // clean up when > 100 unreferenced observables (default)
});
```

### `Observable.getById(id)`

Retrieves a registered observable by its internal memory ID. Useful for debugging:

```javascript
const obs = Observable(42);
const id  = obs.toString(); // "{{#ObItem::(N)}}"

Observable.getById(N); // returns obs
```

### `Observable.useValueProperty(propertyName?)`

Defines a property name as an alias for `$value`. Default is `'value'`, but you can pass any name:

```javascript
Observable.useValueProperty();          // enables .value
Observable.useValueProperty('val');     // enables .val (overrides the method!)
Observable.useValueProperty('current'); // enables .current

const count = Observable(0);

// With default
Observable.useValueProperty();
count.value;      // 0 - same as count.$value
count.value = 5;  // same as count.$value = 5

// With custom name
Observable.useValueProperty('current');
count.current;     // 0
count.current = 5; // sets to 5
```

> Be careful not to pick a name that conflicts with an existing method - for example `'val'` would shadow the `.val()` method.

---

## Observable Objects

### `Observable(object)` vs `Observable.object(object)`

```javascript
// Observable(object) - single observable wrapping the whole object
const userSingle = Observable({ name: 'Alice', age: 25 });
userSingle.val();
userSingle.set({ name: 'Bob', age: 30 });

// Observable.object() - proxy with each property as its own observable
const userProxy = Observable.object({ name: 'Alice', age: 25 });
userProxy.name.val();  // "Alice"
userProxy.name.set('Bob');
userProxy.$value;      // { name: 'Bob', age: 25 }
```

`Observable.object` has aliases:

```javascript
Observable.object(data) // same as:
Observable.json(data)
Observable.init(data)
```

### Subscribing to an object observable

Subscribing to `Observable.object()` reacts to any property change:

```javascript
const user = Observable.object({ name: 'Alice', age: 25 });

user.subscribe(value => {
    console.log('User changed:', value);
});

user.name.set('Bob'); // triggers the parent subscribe
user.age.set(30);     // triggers the parent subscribe
```

---

## Observable Arrays

```javascript
const todos = Observable.array(['Buy groceries', 'Call doctor']);

todos.push('Clean house');
todos.pop();
todos.splice(0, 1);

console.log(todos.val().length); // 1
```

### Array-specific methods

| Method | Description |
|---|---|
| `push(item)` | Add item at the end |
| `pop()` | Remove last item |
| `splice(index, count)` | Remove items at index |
| `at(index)` | Get observable at index |
| `merge(values)` | Merge new values |
| `clear()` | Empty the array |
| `empty()` | Alias for `clear()` |
| `count(condition?)` | Count items matching a condition |
| `swap(indexA, indexB)` | Swap two items by index |
| `swapItems(itemA, itemB)` | Swap two items by reference |
| `insertAfter(data, target)` | Insert after a target item |
| `remove(index)` | Remove item at index |
| `removeItem(item)` | Remove item by reference |
| `clone()` | Deep clone the array |
| `isEmpty()` | Returns an `ObservableChecker` |

### Filtering with `.where()`

> `.where()`, `.whereSome()`, and `.whereEvery()` are available on **`ObservableArray` only** - not on plain observables. They return a new live `ObservableArray` that re-filters automatically when the source or any reactive predicate changes.

**Function predicate** - full item passed to the callback:

```javascript
const users = Observable.array([
    { name: 'Alice', age: 17, role: 'user'  },
    { name: 'Bob',   age: 25, role: 'admin' },
    { name: 'Carol', age: 32, role: 'user'  },
    { name: 'Dave',  age: 28, role: 'admin' },
]);

const adults = users.where(item => item.age >= 18);
// -> Bob, Carol, Dave
```

**Object predicate** - filter per field:

```javascript
const activeAdmins = users.where({
    role: 'admin',         // shorthand for equals
    age:  val => val >= 18 // plain function on the field value
});
// -> Bob, Dave
```

**Reactive predicate** - re-filters when an observable changes:

```javascript
import { match } from 'native-document/filters';

const search = Observable('');

const results = users.where({
    name: match(search) // re-filters every time search changes
});

search.set('ali'); // -> Alice
search.set('');    // -> all users
```

**`and` / `or` / `not`** - composable per-field filters:

> `and`, `or`, and `not` operate on filter result objects (the kind returned by `equals`, `greaterThan`, `match`, etc.) **within a single field**. For cross-field logic, use the `_` key with a plain function.

```javascript
import { equals, greaterThan, lessThan, and, or, not } from 'native-document/filters';

// and - field must pass ALL conditions
const youngAdults = users.where({
    age: and(greaterThan(18), lessThan(30))
});
// -> Bob (25), Dave (28)

// or - field must pass AT LEAST ONE condition
const adminOrEditor = users.where({
    role: or(equals('admin'), equals('editor'))
});
// -> Bob, Dave

// not - inverts a filter
const nonAdmins = users.where({
    role: not(equals('admin'))
});
// -> Alice, Carol

// Cross-field OR - use the _ key with a plain function
const adminsOrMinors = users.where({
    _: item => item.role === 'admin' || item.age < 18
});
// -> Alice (minor), Bob (admin), Dave (admin)
```

**`whereSome(fields, filter)`** - at least one field matches (OR across fields):

```javascript
import { match } from 'native-document/filters';

const search = Observable('car');

const results = products.whereSome(['name', 'category'], match(search));
// matches if name OR category contains 'car'
```

**`whereEvery(fields, filter)`** - all fields match (AND across fields):

```javascript
import { equals } from 'native-document/filters';

const verified = items.whereEvery(['status', 'verified'], equals('active'));
// matches only if both status AND verified equal 'active'
```

---

## Computed Observables

Computed observables automatically recalculate when their dependencies change. The callback receives the current value of each dependency **as arguments, in the order they are declared**:

```javascript
const firstName = Observable('John');
const lastName  = Observable('Doe');

const fullName = Observable.computed((first, last) => {
    return `${first} ${last}`;
}, [firstName, lastName]);

console.log(fullName.val()); // "John Doe"

firstName.set('Jane');
console.log(fullName.val()); // "Jane Doe"
```

Another example with more dependencies:

```javascript
const price    = Observable(100);
const quantity = Observable(2);
const tax      = Observable(0.2);

const total = Observable.computed((p, q, t) => {
    return p * q * (1 + t);
}, [price, quantity, tax]);

console.log(total.val()); // 240

quantity.set(3);
console.log(total.val()); // 360
```

---

## Batching Updates

`Observable.batch()` delays notifications to **dependent computed observables** until all changes are done. Individual subscribers still fire immediately.

```javascript
const firstName = Observable('John');
const lastName  = Observable('Doe');

const updateName = Observable.batch((first, last) => {
    firstName.set(first);
    lastName.set(last);
});

const fullName = Observable.computed((first, last) => {
    return `${first} ${last}`;
}, updateName); // depends on the batch - recalculates once

fullName.subscribe(name => console.log('Full name:', name));

updateName('Alice', 'Smith');
// "Full name: Alice Smith" - single notification
```

Async batching is also supported:

```javascript
const isLoading = Observable(false);
const userData  = Observable(null);
const error     = Observable(null);

const fetchUser = Observable.batch(async (userId) => {
    isLoading.set(true);
    error.set(null);
    try {
        const data = await fetch(`/api/users/${userId}`).then(r => r.json());
        userData.set(data);
    } catch (err) {
        error.set(err.message);
    } finally {
        isLoading.set(false);
    }
});

const userDisplay = Observable.computed((loading, data, err) => {
    if (loading) return 'Loading...';
    if (err)     return `Error: ${err}`;
    if (data)    return `Hello ${data.name}`;
    return 'No user';
}, fetchUser);

await fetchUser(123);
```

> A computed observable can depend on **one batch function** only, not multiple.

---

## Observable Resources

`Observable.resource()` manages async data fetching with built-in states, `AbortController` support, and reactive dependencies. See **[Observable Resource](./observable-resource.md)** for the full guide.

```javascript
const userId = Observable(1);

const user = Observable.resource(
    async (id, signal) => {
        const res = await fetch(`/api/users/${id}`, { signal });
        return res.json();
    },
    [userId],
    { auto: true }
);

Div([
    ShowIf(user.loading,  () => Div('Loading...')),
    ShowIf(user.isReady(), () => Div(user.data.select(u => u.name))),
    ShowIf(user.isErrored(), () => Div(['Error: ', user.error]))
]);
```

---

## Observable.format()

Creates a derived observable that formats the current value using `Intl`. You must set a locale observable before using `format()`. When using the CLI template, pass `I18nService.current` as the locale:

```javascript
import { Observable } from 'native-document';
import { I18nService } from '@/core/services';

// Using the CLI template i18n service (recommended)
Observable.setLocale(I18nService.current);

// Or with a plain observable
const $locale = Observable('fr');
Observable.setLocale($locale);

const price = Observable(15000);
const date  = Observable(new Date());
const count = Observable(3);

price.format('currency')                            // "15 000 FCFA"
price.format('currency', { currency: 'EUR' })       // "15 000,00 €"
price.format('currency', { notation: 'compact' })   // "15 K FCFA"

price.format('number')                              // "15 000"

Observable(0.15).format('percent')                  // "15,0 %"
Observable(0.15).format('percent', { decimals: 2 }) // "15,00 %"

date.format('date')                                 // "3 mars 2026"
date.format('date', { dateStyle: 'full' })          // "mardi 3 mars 2026"
date.format('date', { format: 'DD/MM/YYYY' })       // "03/03/2026"

date.format('time')                                 // "20:30"
date.format('time', { second: '2-digit' })          // "20:30:00"

date.format('datetime')                             // "3 mars 2026, 20:30"

date.format('relative')                             // "dans 11 jours"
date.format('relative', { unit: 'month' })          // "dans 1 mois"

count.format('plural', { singular: 'billet', plural: 'billets' }) // "3 billets"

// Custom formatter - works like transform()
price.format(value => `${value.toLocaleString()} FCFA`)
```

Formatted observables react to locale changes automatically:

```javascript
Observable.setLocale(I18nService.current);

const label = Observable(15000).format('currency', { currency: 'XOF' });
label.val(); // "15 000 FCFA"

I18nService.current.set('en-US');
label.val(); // "$15,000.00"
```

### Available format types

| Type | Input | Key options |
|---|---|---|
| `currency` | `number` | `currency`, `notation`, `minimumFractionDigits`, `maximumFractionDigits` |
| `number` | `number` | `notation`, `minimumFractionDigits`, `maximumFractionDigits` |
| `percent` | `number` | `decimals` |
| `date` | `Date \| number` | `dateStyle`, `format` |
| `time` | `Date \| number` | `hour`, `minute`, `second`, `format` |
| `datetime` | `Date \| number` | `dateStyle`, `hour`, `minute`, `second`, `format` |
| `relative` | `Date \| number` | `unit`, `numeric` |
| `plural` | `number` | `singular`, `plural` |

### Extending Formatters

```javascript
import { Formatters } from 'native-document';

Formatters.duration = (value, locale) => {
    const hours   = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    return `${hours}h${minutes < 10 ? '0' : ''}${minutes}`;
};

const duration = Observable(3661);
duration.format('duration'); // "1h01"
```

---

## Best Practices

1. Use descriptive names for your observables
2. Know the difference between `Observable(object)` (single observable) and `Observable.object(object)` (per-property observables)
3. Use `Observable.computed()` for derived values instead of manual subscriptions
4. Use `.persist()` for component-level localStorage binding instead of the global Store
5. Use `.intercept()` to sanitize, clamp, or abort values at the source
6. Use `.on()` instead of `.subscribe()` when you only care about specific values
7. Use `Observable.autoCleanup(true)` in long-running applications
8. Use `Observable.resource()` for async data instead of manual fetch + observable patterns

## Next Steps

- **[Elements](./elements.md)** - Creating and composing UI
- **[Conditional Rendering](./conditional-rendering.md)** - Dynamic content
- **[List Rendering](./list-rendering.md)** - ForEach and dynamic lists
- **[State Management](./state-management.md)** - Global state with Store
- **[Observable Resource](./observable-resource.md)** - Async data fetching
- **[i18n & Formatting](./i18n.md)** - Locale-aware formatting
- **[Filters](./filters.md)** - Data filtering helpers