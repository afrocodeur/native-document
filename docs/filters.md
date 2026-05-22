---
title: Filters
description: Composable, reactive filter helpers for ObservableArray.where() - comparison, string, date, array, and logical operators
---

# Filters

Filter helpers enable reactive, composable filtering on `ObservableArray` via `.where()`, `.whereSome()`, and `.whereEvery()`. Filters update automatically when observable values change.

```javascript
import { utils } from 'native-document';
const { filters } = utils;

// Or
import { filters } from 'native-document/utils';

// Or named imports
import { equals, greaterThan, between, match, and, or, not } from 'native-document/filters';
```

> All filters are for **`ObservableArray` only** - see [Observables](./observables.md) for `.where()` usage.

---

## Comparison

```javascript
const products = Observable.array([
    { name: 'Phone',  price: 599, stock: 10 },
    { name: 'Laptop', price: 999, stock: 0  },
    { name: 'Tablet', price: 399, stock: 5  },
]);

products.where({ price: equals(599) })              // Phone
products.where({ name:  notEquals('Phone') })       // Laptop, Tablet
products.where({ price: greaterThan(500) })         // Phone, Laptop
products.where({ price: greaterThanOrEqual(399) })  // all
products.where({ price: lessThan(600) })            // Tablet
products.where({ price: lessThanOrEqual(399) })     // Tablet
products.where({ price: between(400, 700) })        // Phone
products.where({ stock: equals(0) })                // Laptop
```

All accept observables as arguments - filters update automatically when they change:

```javascript
const minPrice = Observable(300);
const maxPrice = Observable(800);

const filtered = products.where({
    price: between(minPrice, maxPrice)
});

minPrice.set(500); // filtered updates automatically
```

---

## String

```javascript
const users = Observable.array([
    { name: 'Alice Johnson' },
    { name: 'Bob Smith' },
    { name: 'Charlie Wilson' }
]);

users.where({ name: includes('alice') })      // Alice Johnson (case-insensitive)
users.where({ name: includes('smith', true) }) // Bob Smith (case-sensitive)
users.where({ name: startsWith('A') })         // Alice Johnson
users.where({ name: endsWith('son') })         // Alice Johnson, Charlie Wilson
users.where({ name: match(/^[A-C]/) })         // Alice, Bob, Charlie (regex)
users.where({ name: match('bob', false) })     // Bob Smith (plain text)
```

Reactive search:

```javascript
const search = Observable('');
const results = users.where({ name: includes(search) });

search.set('ali'); // Alice Johnson
search.set('');    // all users
```

---

## Array membership

```javascript
const allowed = Observable.array(['electronics', 'books']);

products.where({ category: inArray(allowed) })       // reactive
products.where({ category: inArray(['books']) })     // static
products.where({ status:   notIn(['banned', 'deleted']) })
```

---

## Logical operators

`and`, `or`, `not` operate **within a single field**. For cross-field logic use the `_` key:

```javascript
// and - field must pass ALL conditions
products.where({ price: and(greaterThan(100), lessThan(800)) })

// or - field must pass AT LEAST ONE
products.where({ category: or(equals('electronics'), equals('books')) })

// not - inverts
products.where({ status: not(equals('banned')) })

// cross-field - plain function with _ key
products.where({
    _: item => item.stock > 0 && item.price < 500
})
```

`all` is an alias for `and`, `any` is an alias for `or`.

---

## Custom filter

```javascript
const minRating = Observable(4);

products.where({
    _: custom((item, min) => {
        return item.rating >= min && item.reviews > 10;
    }, minRating) // observables as extra dependencies
})
```

---

## Date and time filters

All date/time values are automatically converted to `Date` objects.

### Date (ignores time)

```javascript
import { dateEquals, dateBefore, dateAfter, dateBetween } from 'native-document/filters';

const today = Observable(new Date());

events.where({ date: dateEquals('2024-03-15') })
events.where({ date: dateAfter(new Date()) })
events.where({ date: dateBefore(today) })
events.where({ date: dateBetween('2024-06-01', '2024-08-31') })
```

### Time (ignores date)

```javascript
import { timeBefore, timeAfter, timeBetween } from 'native-document/filters';

// Only the time portion is compared - date is ignored
calls.where({ time: timeBetween('09:00:00', '17:00:00') }) // business hours
calls.where({ time: timeAfter('18:00:00') })                // evening
```

### DateTime (date + time)

```javascript
import { dateTimeAfter, dateTimeBetween } from 'native-document/filters';

logs.where({ timestamp: dateTimeAfter(new Date(Date.now() - 86400000)) }) // last 24h
logs.where({ timestamp: dateTimeBetween(start, end) })
```

---

## Filter Reference

### Comparison
| Filter | Alias | Description |
|---|---|---|
| `equals(value)` | `eq` | Exact match |
| `notEquals(value)` | `neq` | Not equal |
| `greaterThan(value)` | `gt` | > value |
| `greaterThanOrEqual(value)` | `gte` | >= value |
| `lessThan(value)` | `lt` | < value |
| `lessThanOrEqual(value)` | `lte` | <= value |
| `between(min, max)` | - | min <= value <= max |

### String
| Filter | Description |
|---|---|
| `includes(text, caseSensitive?)` | Contains substring |
| `startsWith(text, caseSensitive?)` | Starts with |
| `endsWith(text, caseSensitive?)` | Ends with |
| `match(pattern, asRegex?, flags?)` | Regex or plain text match |

### Array
| Filter | Description |
|---|---|
| `inArray(array)` | Value is in array (observable-aware) |
| `notIn(array)` | Value is not in array |

### Logical
| Filter | Alias | Description |
|---|---|---|
| `and(...filters)` | `all` | All conditions pass |
| `or(...filters)` | `any` | At least one passes |
| `not(filter)` | - | Inverts the filter |

### Custom
| Filter | Description |
|---|---|
| `custom(fn, ...observables)` | Custom logic with reactive dependencies |

### Date
| Filter | Description |
|---|---|
| `dateEquals(date)` | Same date (ignores time) |
| `dateBefore(date)` | Before date |
| `dateAfter(date)` | After date |
| `dateBetween(start, end)` | Date range |
| `timeEquals(time)` | Same time (ignores date) |
| `timeBefore(time)` | Before time |
| `timeAfter(time)` | After time |
| `timeBetween(start, end)` | Time range |
| `dateTimeEquals(dt)` | Exact timestamp |
| `dateTimeBefore(dt)` | Before timestamp |
| `dateTimeAfter(dt)` | After timestamp |
| `dateTimeBetween(start, end)` | Timestamp range |

---

## Best Practices

1. Prefer property-specific filters over `_` + plain function when possible - they are more efficient
2. Combine multiple field conditions in a single `.where()` call - not chained `.where()` calls
3. Reuse observable filter values across multiple arrays - they all update together
4. Use `custom()` for complex logic that involves external observables

---

## Next Steps

- **[Observables](./observables.md)** - Full `.where()`, `.whereSome()`, `.whereEvery()` reference
- **[List Rendering](./list-rendering.md)** - ForEach with filtered arrays
- **[Cache](./cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](./native-fetch.md)** - HTTP client with interceptors