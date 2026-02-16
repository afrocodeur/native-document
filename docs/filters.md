# Filters

NativeDocument provides a comprehensive set of filter helpers for creating reactive, type-safe data filtering with Observable arrays. These filters work seamlessly with the `where()`, `whereSome()`, and `whereEvery()` methods.

## Overview

Filter helpers enable:
- **Reactive filtering** - Filters update automatically when observables change
- **Type-safe comparisons** - Validate data types and formats
- **Composable logic** - Combine filters with `and`, `or`, `not`
- **Date/Time handling** - Specialized filters for temporal data
- **Custom filters** - Create your own filter logic

## Import
```javascript
import { filters } from 'native-document/utils';
const { equals, greaterThan, between, includes, and, or, not } = filters;

// Or destructure directly
import { filters: { equals, greaterThan, between, includes } } from 'native-document/utils';
```

## Basic Filters

### Comparison Filters
```javascript
import { filters } from 'native-document/utils';
const { equals, notEquals, greaterThan, lessThan } = filters;
import { Observable } from 'native-document';

const products = Observable.array([
    { id: 1, name: 'Phone', price: 599, stock: 10 },
    { id: 2, name: 'Laptop', price: 999, stock: 5 },
    { id: 3, name: 'Tablet', price: 399, stock: 0 },
    { id: 4, name: 'Watch', price: 299, stock: 15 }
]);

// Filter by exact value
const expensive = products.where({
    price: equals(999)
});
// Result: [{ id: 2, name: 'Laptop', price: 999, stock: 5 }]

// Filter by inequality
const notTablet = products.where({
    name: notEquals('Tablet')
});
// Result: All except Tablet

// Greater than
const expensiveProducts = products.where({
    price: greaterThan(500)
});
// Result: Phone and Laptop

// Less than
const affordable = products.where({
    price: lessThan(400)
});
// Result: Watch and Tablet
```

### Shortcuts
```javascript
import { filters } from 'native-document/utils';
const { eq, neq, gt, gte, lt, lte } = filters;

const products = Observable.array([...]);

// Short aliases
const expensive = products.where({ price: gt(500) });
const affordable = products.where({ price: lte(400) });
const notPhone = products.where({ name: neq('Phone') });
```

### greaterThanOrEqual() / lessThanOrEqual()
```javascript
import { filters } from 'native-document/utils';
const { greaterThanOrEqual, lessThanOrEqual } = filters;
import { Observable } from 'native-document';

const products = Observable.array([
    { name: 'Budget', price: 100 },
    { name: 'Standard', price: 500 },
    { name: 'Premium', price: 1000 }
]);

// Greater than or equal to
const standardOrBetter = products.where({
    price: greaterThanOrEqual(500)
});
// Result: Standard, Premium

// Less than or equal to
const budgetFriendly = products.where({
    price: lessThanOrEqual(500)
});
// Result: Budget, Standard
```

## Range Filters

### between()
```javascript
import { filters } from 'native-document/utils';
const { between } = filters;
import { Observable } from 'native-document';

const products = Observable.array([
    { name: 'Budget Phone', price: 199 },
    { name: 'Mid Phone', price: 499 },
    { name: 'Premium Phone', price: 999 },
    { name: 'Luxury Phone', price: 1499 }
]);

// Static range
const midRange = products.where({
    price: between(400, 800)
});
// Result: [{ name: 'Mid Phone', price: 499 }]

// Reactive range with observables
const minPrice = Observable(200);
const maxPrice = Observable(1000);

const filtered = products.where({
    price: between(minPrice, maxPrice)
});

// Updates automatically when bounds change
minPrice.set(500);  // Now shows only Premium Phone
maxPrice.set(600);  // Now shows nothing
```

## String Filters

### includes() / contains()
```javascript
import { filters } from 'native-document/utils';
const { includes, contains } = filters;
import { Observable } from 'native-document';

const products = Observable.array([
    { name: 'iPhone 15 Pro' },
    { name: 'Samsung Galaxy' },
    { name: 'Google Pixel' },
    { name: 'OnePlus Phone' }
]);

// Case-insensitive by default
const phones = products.where({
    name: includes('phone')
});
// Result: iPhone 15 Pro, OnePlus Phone

// Reactive search
const searchTerm = Observable('galaxy');
const results = products.where({
    name: includes(searchTerm)
});
// Result: Samsung Galaxy

searchTerm.set('pixel');
// Result: Google Pixel

// contains is an alias
const sameResults = products.where({
    name: contains('phone')
});
```

### startsWith()
```javascript
import { filters } from 'native-document/utils';
const { startsWith } = filters;
import { Observable } from 'native-document';

const users = Observable.array([
    { name: 'Alice Johnson' },
    { name: 'Bob Smith' },
    { name: 'Alice Brown' },
    { name: 'Charlie Wilson' }
]);

// Case-insensitive by default
const alices = users.where({
    name: startsWith('alice')
});
// Result: Alice Johnson, Alice Brown

// Case-sensitive (second parameter)
const caseSensitive = users.where({
    name: startsWith('Alice', true)
});
// Result: Alice Johnson, Alice Brown
```

### endsWith()
```javascript
import { filters } from 'native-document/utils';
const { endsWith } = filters;
import { Observable } from 'native-document';

const files = Observable.array([
    { name: 'document.pdf' },
    { name: 'image.jpg' },
    { name: 'report.pdf' },
    { name: 'photo.png' }
]);

// Case-insensitive by default
const pdfs = files.where({
    name: endsWith('.pdf')
});
// Result: document.pdf, report.pdf

// Case-sensitive
const pdfsCaseSensitive = files.where({
    name: endsWith('.PDF', true)
});
// Result: [] (none match uppercase)
```

### match()
```javascript
import { filters } from 'native-document/utils';
const { match } = filters;
import { Observable } from 'native-document';

const products = Observable.array([
    { sku: 'ABC-123' },
    { sku: 'DEF-456' },
    { sku: 'GHI-789' },
    { sku: 'INVALID' }
]);

// Regex pattern
const validSKUs = products.where({
    sku: match(/^[A-Z]{3}-\d{3}$/, true)
});
// Result: ABC-123, DEF-456, GHI-789

// Simple text match (no regex)
const containsABC = products.where({
    sku: match('ABC', false)
});
// Result: ABC-123

// With flags
const caseInsensitive = products.where({
    sku: match(/abc/, true, 'i')
});
// Result: ABC-123
```

## Array Filters

### inArray()
```javascript
import { filters } from 'native-document/utils';
const { inArray } = filters;
import { Observable } from 'native-document';

const products = Observable.array([
    { id: 1, category: 'electronics' },
    { id: 2, category: 'books' },
    { id: 3, category: 'clothing' },
    { id: 4, category: 'electronics' }
]);

// Static array
const allowed = products.where({
    category: inArray(['electronics', 'books'])
});
// Result: items 1, 2, 4

// Reactive array
const allowedCategories = Observable.array(['electronics']);
const filtered = products.where({
    category: inArray(allowedCategories)
});

// Updates when array changes
allowedCategories.push('books');
// Now includes books too
```

### notIn()
```javascript
import { filters } from 'native-document/utils';
const { notIn } = filters;
import { Observable } from 'native-document';

const users = Observable.array([
    { id: 1, status: 'active' },
    { id: 2, status: 'banned' },
    { id: 3, status: 'inactive' },
    { id: 4, status: 'active' }
]);

const validUsers = users.where({
    status: notIn(['banned', 'deleted'])
});
// Result: items 1, 3, 4
```

## Empty/Existence Filters

### isEmpty()
```javascript
import { filters } from 'native-document/utils';
const { isEmpty } = filters;
import { Observable } from 'native-document';

const tasks = Observable.array([
    { title: 'Task 1', description: '' },
    { title: 'Task 2', description: 'Details' },
    { title: 'Task 3', description: null },
    { title: 'Task 4', tags: [] }
]);

// Empty string or null
const noDescription = tasks.where({
    description: isEmpty()
});
// Result: Task 1, Task 3

// Empty arrays
const noTags = tasks.where({
    tags: isEmpty()
});
// Result: Task 4

// Conditional empty
const shouldBeEmpty = Observable(true);
const filtered = tasks.where({
    description: isEmpty(shouldBeEmpty)
});

shouldBeEmpty.set(false);
// Now returns items with non-empty descriptions
```

### isNotEmpty()
```javascript
import { filters } from 'native-document/utils';
const { isNotEmpty } = filters;
import { Observable } from 'native-document';

const tasks = Observable.array([
    { title: 'Task 1', description: '' },
    { title: 'Task 2', description: 'Details' },
    { title: 'Task 3', description: null }
]);

const withDescription = tasks.where({
    description: isNotEmpty()
});
// Result: Task 2

// Conditional
const shouldHaveContent = Observable(true);
const filtered = tasks.where({
    description: isNotEmpty(shouldHaveContent)
});
```

## Date and Time Filters

All date and time filters automatically convert values to Date objects using the internal `toDate()` helper. You can pass Date objects, timestamps, or date strings - they will be converted automatically.

### Date Comparison
```javascript
import { filters } from 'native-document/utils';
const { dateEquals, dateBefore, dateAfter, dateBetween } = filters;
import { Observable } from 'native-document';

const events = Observable.array([
    { name: 'Meeting', date: '2024-01-15' },
    { name: 'Conference', date: '2024-06-20' },
    { name: 'Workshop', date: '2024-09-10' },
    { name: 'Seminar', date: '2024-12-05' }
]);

// Specific date (string automatically converted to Date)
const januaryEvents = events.where({
    date: dateEquals('2024-01-15')
});
// Result: Meeting

// Or with Date object
const januaryEvents2 = events.where({
    date: dateEquals(new Date('2024-01-15'))
});
// Result: Meeting

// Before a date
const firstHalf = events.where({
    date: dateBefore('2024-07-01')
});
// Result: Meeting, Conference

// After a date
const secondHalf = events.where({
    date: dateAfter('2024-07-01')
});
// Result: Workshop, Seminar

// Date range
const summerEvents = events.where({
    date: dateBetween('2024-06-01', '2024-08-31')
});
// Result: Conference

// Reactive date filtering with observables
const startDate = Observable('2024-01-01');
const endDate = Observable('2024-06-30');

const filtered = events.where({
    date: dateBetween(startDate, endDate)
});

// Updates when dates change
endDate.set('2024-12-31');
// Now includes all events

// Works with timestamps too
const timestamp = Date.now();
const recentEvents = events.where({
    date: dateAfter(timestamp)
});
```

### Time Comparison (Ignores Date)

Time filters extract and compare only the time portion (hours, minutes, seconds), ignoring the date.
```javascript
import { filters } from 'native-document/utils';
const { timeEquals, timeBefore, timeAfter, timeBetween } = filters;
import { Observable } from 'native-document';

const appointments = Observable.array([
    { name: 'Breakfast', time: '2024-01-15 08:00:00' },
    { name: 'Meeting', time: '2024-01-15 14:00:00' },
    { name: 'Dinner', time: '2024-01-15 19:00:00' }
]);

// Specific time (date is ignored, only time matters)
const lunchTime = appointments.where({
    time: timeEquals('2024-01-01 14:00:00')
});
// Result: Meeting (date doesn't need to match)

// Before a time
const morning = appointments.where({
    time: timeBefore('12:00:00')
});
// Result: Breakfast

// After a time
const evening = appointments.where({
    time: timeAfter('18:00:00')
});
// Result: Dinner

// Time range (9 AM to 5 PM)
const businessHours = appointments.where({
    time: timeBetween('09:00:00', '17:00:00')
});
// Result: Meeting

// Works with any date - only time is compared
const businessHours2 = appointments.where({
    time: timeBetween('2025-12-25 09:00:00', '2025-12-25 17:00:00')
});
// Result: Meeting (same result, date is ignored)
```

### DateTime Comparison (Date + Time)

DateTime filters compare both date and time together for exact timestamp matching.
```javascript
import { filters } from 'native-document/utils';
const { dateTimeEquals, dateTimeBefore, dateTimeAfter, dateTimeBetween } = filters;
import { Observable } from 'native-document';

const logs = Observable.array([
    { message: 'Start', timestamp: '2024-01-15 08:30:00' },
    { message: 'Process', timestamp: '2024-01-15 14:45:00' },
    { message: 'End', timestamp: '2024-01-15 18:20:00' }
]);

// Exact timestamp (both date and time must match)
const exactLog = logs.where({
    timestamp: dateTimeEquals('2024-01-15 14:45:00')
});
// Result: Process

// Before timestamp
const earlyLogs = logs.where({
    timestamp: dateTimeBefore('2024-01-15 15:00:00')
});
// Result: Start, Process

// After timestamp
const lateLogs = logs.where({
    timestamp: dateTimeAfter('2024-01-15 15:00:00')
});
// Result: End

// Timestamp range (work hours: 9 AM to 5 PM)
const workHours = logs.where({
    timestamp: dateTimeBetween(
        '2024-01-15 09:00:00',
        '2024-01-15 17:00:00'
    )
});
// Result: Process

// Reactive datetime filtering
const startTime = Observable('2024-01-15 08:00:00');
const endTime = Observable('2024-01-15 16:00:00');

const filtered = logs.where({
    timestamp: dateTimeBetween(startTime, endTime)
});

// Updates when times change
endTime.set('2024-01-15 20:00:00');
// Now includes all logs
```

### Date Format Examples

All date/time filters accept multiple formats:
```javascript
import { filters } from 'native-document/utils';
const { dateEquals, timeEquals, dateTimeEquals } = filters;

const events = Observable.array([...]);

// ISO 8601 string
events.where({ date: dateEquals('2024-01-15') });

// Date object
events.where({ date: dateEquals(new Date('2024-01-15')) });

// Timestamp (milliseconds)
events.where({ date: dateEquals(1705276800000) });

// Full datetime string
events.where({ timestamp: dateTimeEquals('2024-01-15T14:30:00') });

// Time only (date portion ignored)
events.where({ time: timeEquals('14:30:00') });

// Observable with any format
const targetDate = Observable('2024-01-15');
events.where({ date: dateEquals(targetDate) });
```

### Working with Different Timezones
```javascript
import { filters } from 'native-document/utils';
const { dateTimeBetween } = filters;
import { Observable } from 'native-document';

const events = Observable.array([
    { name: 'Meeting', time: '2024-01-15T14:00:00Z' },      // UTC
    { name: 'Call', time: '2024-01-15T09:00:00-05:00' },    // EST
    { name: 'Workshop', time: '2024-01-15T16:00:00+01:00' } // CET
]);

// All dates are converted to Date objects internally
// Local timezone is used for comparison
const todayEvents = events.where({
    time: dateTimeBetween(
        '2024-01-15T00:00:00',
        '2024-01-15T23:59:59'
    )
});
```

### Practical Date/Time Examples

#### Filter Events by Today/This Week
```javascript
import { filters } from 'native-document/utils';
const { dateEquals, dateBetween } = filters;
import { Observable } from 'native-document';

const events = Observable.array([...]);

// Today's events
const today = new Date().toISOString().split('T')[0]; // "2024-01-15"
const todayEvents = events.where({
    date: dateEquals(today)
});

// This week's events
const startOfWeek = new Date();
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(endOfWeek.getDate() + 6);

const thisWeekEvents = events.where({
    date: dateBetween(
        startOfWeek.toISOString().split('T')[0],
        endOfWeek.toISOString().split('T')[0]
    )
});
```

#### Filter by Business Hours
```javascript
import { filters } from 'native-document/utils';
const { timeBetween } = filters;
import { Observable } from 'native-document';

const calls = Observable.array([
    { caller: 'Alice', time: '2024-01-15 08:30:00' },
    { caller: 'Bob', time: '2024-01-15 14:30:00' },
    { caller: 'Charlie', time: '2024-01-15 20:00:00' }
]);

// Business hours: 9 AM - 6 PM
const businessHoursCalls = calls.where({
    time: timeBetween('09:00:00', '18:00:00')
});
// Result: Bob (14:30 is within business hours)
```

#### Filter Recent Activity
```javascript
import { filters } from 'native-document/utils';
const { dateTimeAfter } = filters;
import { Observable } from 'native-document';

const activities = Observable.array([...]);

// Last 24 hours
const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
const recentActivity = activities.where({
    timestamp: dateTimeAfter(oneDayAgo)
});

// Last hour
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
const veryRecentActivity = activities.where({
    timestamp: dateTimeAfter(oneHourAgo)
});
```

### Time Comparison (Ignores Date)
```javascript
import { filters } from 'native-document/utils';
const { timeEquals, timeBefore, timeAfter, timeBetween } = filters;
import { Observable } from 'native-document';

const appointments = Observable.array([
    { name: 'Breakfast', time: new Date('2024-01-15 08:00:00') },
    { name: 'Meeting', time: new Date('2024-01-15 14:00:00') },
    { name: 'Dinner', time: new Date('2024-01-15 19:00:00') }
]);

// Specific time (ignores date)
const lunchTime = appointments.where({
    time: timeEquals(new Date('2024-01-01 14:00:00'))
});
// Result: Meeting (even though date is different)

// Before a time
const morning = appointments.where({
    time: timeBefore(new Date('2024-01-01 12:00:00'))
});
// Result: Breakfast

// After a time
const evening = appointments.where({
    time: timeAfter(new Date('2024-01-01 18:00:00'))
});
// Result: Dinner

// Time range
const businessHours = appointments.where({
    time: timeBetween(
        new Date('2024-01-01 09:00:00'),
        new Date('2024-01-01 17:00:00')
    )
});
// Result: Meeting
```

### DateTime Comparison (Date + Time)
```javascript
import { filters } from 'native-document/utils';
const { dateTimeEquals, dateTimeBefore, dateTimeAfter, dateTimeBetween } = filters;
import { Observable } from 'native-document';

const logs = Observable.array([
    { message: 'Start', timestamp: new Date('2024-01-15 08:30:00') },
    { message: 'Process', timestamp: new Date('2024-01-15 14:45:00') },
    { message: 'End', timestamp: new Date('2024-01-15 18:20:00') }
]);

// Exact timestamp
const exactLog = logs.where({
    timestamp: dateTimeEquals(new Date('2024-01-15 14:45:00'))
});
// Result: Process

// Before timestamp
const earlyLogs = logs.where({
    timestamp: dateTimeBefore(new Date('2024-01-15 15:00:00'))
});
// Result: Start, Process

// After timestamp
const lateLogs = logs.where({
    timestamp: dateTimeAfter(new Date('2024-01-15 15:00:00'))
});
// Result: End

// Timestamp range
const workHours = logs.where({
    timestamp: dateTimeBetween(
        new Date('2024-01-15 09:00:00'),
        new Date('2024-01-15 17:00:00')
    )
});
// Result: Process
```

## Logical Operators

### and() / all()
```javascript
import { filters } from 'native-document/utils';
const { and, all, greaterThan, lessThan } = filters;
import { Observable } from 'native-document';

const products = Observable.array([
    { name: 'Phone', price: 599, stock: 10 },
    { name: 'Laptop', price: 999, stock: 5 },
    { name: 'Tablet', price: 399, stock: 0 },
    { name: 'Watch', price: 299, stock: 15 }
]);

// Combine multiple conditions
const midRangeInStock = products.where({
    price: and(
        greaterThan(300),
        lessThan(700)
    ),
    stock: greaterThan(0)
});
// Result: Phone

// 'all' is an alias for 'and'
const sameResult = products.where({
    price: all(
        greaterThan(300),
        lessThan(700)
    )
});
```

### or() / any()
```javascript
import { filters } from 'native-document/utils';
const { or, any, lessThan, greaterThan } = filters;
import { Observable } from 'native-document';

const products = Observable.array([
    { name: 'Budget Phone', price: 199 },
    { name: 'Mid Phone', price: 499 },
    { name: 'Premium Phone', price: 999 }
]);

// Either cheap OR expensive
const dealsOrPremium = products.where({
    price: or(
        lessThan(300),
        greaterThan(800)
    )
});
// Result: Budget Phone, Premium Phone

// 'any' is an alias for 'or'
const sameResult = products.where({
    price: any(
        lessThan(300),
        greaterThan(800)
    )
});
```

### not()
```javascript
import { filters } from 'native-document/utils';
const { not, equals } = filters;
import { Observable } from 'native-document';

const users = Observable.array([
    { name: 'Alice', status: 'active' },
    { name: 'Bob', status: 'inactive' },
    { name: 'Charlie', status: 'active' }
]);

// Invert condition
const notActive = users.where({
    status: not(equals('active'))
});
// Result: Bob

// Can combine with other filters
const notActiveOrBanned = users.where({
    status: not(inArray(['active', 'banned']))
});
```

## Complex Filtering

### Nested Conditions
```javascript
import { filters } from 'native-document/utils';
const { and, or, greaterThan, lessThan, equals } = filters;
import { Observable } from 'native-document';

const products = Observable.array([
    { name: 'Phone', price: 599, category: 'electronics', stock: 10 },
    { name: 'Book', price: 29, category: 'books', stock: 50 },
    { name: 'Laptop', price: 999, category: 'electronics', stock: 5 },
    { name: 'Magazine', price: 9, category: 'books', stock: 100 }
]);

// (electronics AND expensive) OR (books AND cheap)
const filtered = products.where({
    _: or(
        and(
            (item) => item.category === 'electronics',
            (item) => item.price > 500
        ),
        and(
            (item) => item.category === 'books',
            (item) => item.price < 20
        )
    )
});
// Result: Phone, Laptop, Magazine
```

### Multiple Property Filters
```javascript
import { filters } from 'native-document/utils';
const { greaterThan, includes, equals } = filters;
import { Observable } from 'native-document';

const products = Observable.array([
    { name: 'Gaming Phone', price: 799, category: 'electronics', tags: ['gaming', 'mobile'] },
    { name: 'Office Laptop', price: 1299, category: 'electronics', tags: ['work', 'productivity'] },
    { name: 'Budget Tablet', price: 299, category: 'electronics', tags: ['entertainment'] }
]);

// Filter on multiple properties
const filtered = products.where({
    price: greaterThan(500),
    category: equals('electronics'),
    name: includes('gaming')
});
// Result: Gaming Phone
```

### Reactive Multi-Condition Filters
```javascript
import { filters } from 'native-document/utils';
const { and, greaterThan, lessThan, includes, custom } = filters;
import { Observable } from 'native-document';

const products = Observable.array([...]);

// Reactive filter values
const searchTerm = Observable('');
const minPrice = Observable(0);
const maxPrice = Observable(10000);
const showInStockOnly = Observable(false);

const filtered = products.where({
    name: includes(searchTerm),
    price: and(
        greaterThan(minPrice),
        lessThan(maxPrice)
    ),
    stock: custom((value, showInStock) => {
        return !showInStock || value > 0;
    }, showInStockOnly)
});

// Updates automatically when any filter changes
searchTerm.set('phone');
minPrice.set(500);
maxPrice.set(1000);
showInStockOnly.set(true);
```

## Custom Filters

### createFilter()
```javascript
import { filters } from 'native-document/utils';
const { createFilter } = filters;
import { Observable } from 'native-document';

// Create email validator
const isValidEmail = createFilter(
    true, // static value or observable
    (value, shouldBeValid) => {
        const isValid = /\S+@\S+\.\S+/.test(value);
        return shouldBeValid ? isValid : !isValid;
    }
);

const users = Observable.array([
    { email: 'alice@example.com' },
    { email: 'invalid-email' },
    { email: 'bob@example.com' }
]);

const validUsers = users.where({
    email: isValidEmail
});
// Result: alice@example.com, bob@example.com

// Reactive validation
const shouldValidate = Observable(true);
const emailFilter = createFilter(
    shouldValidate,
    (value, validate) => {
        if (!validate) return true; // Skip validation
        return /\S+@\S+\.\S+/.test(value);
    }
);

const filtered = users.where({
    email: emailFilter
});

shouldValidate.set(false);
// Now returns all users (validation disabled)
```

### createMultiSourceFilter()
```javascript
import { filters } from 'native-document/utils';
const { createMultiSourceFilter } = filters;
import { Observable } from 'native-document';

const minValue = Observable(0);
const maxValue = Observable(100);
const multiplier = Observable(1);

// Filter using multiple observables
const complexFilter = createMultiSourceFilter(
    [minValue, maxValue, multiplier],
    (value, [min, max, mult]) => {
        const adjusted = value * mult;
        return adjusted >= min && adjusted <= max;
    }
);

const numbers = Observable.array([
    { value: 10 },
    { value: 50 },
    { value: 150 }
]);

const filtered = numbers.where({
    value: complexFilter
});

// All observables update the filter
multiplier.set(2);  // Now filters based on value * 2
minValue.set(50);   // Now requires value * 2 >= 50
```

### custom()
```javascript
import { filters } from 'native-document/utils';
const { custom } = filters;
import { Observable } from 'native-document';

const products = Observable.array([
    { name: 'Phone', price: 599, discount: 0.1 },
    { name: 'Laptop', price: 999, discount: 0.15 },
    { name: 'Tablet', price: 399, discount: 0.05 }
]);

const maxBudget = Observable(600);

// Custom filter with observable dependency
const withinBudget = products.where({
    _: custom((product, budget) => {
        const finalPrice = product.price * (1 - product.discount);
        return finalPrice <= budget;
    }, maxBudget)
});
// Result: Phone, Tablet

// Updates when budget changes
maxBudget.set(400);
// Result: Tablet only
```

## Filter Reference

### Comparison Filters

| Filter | Alias | Description | Example |
|--------|-------|-------------|---------|
| `equals(value)` | `eq(value)` | Exact match | `equals(10)` |
| `notEquals(value)` | `neq(value)` | Not equal | `notEquals('test')` |
| `greaterThan(value)` | `gt(value)` | Greater than | `gt(100)` |
| `greaterThanOrEqual(value)` | `gte(value)` | Greater or equal | `gte(50)` |
| `lessThan(value)` | `lt(value)` | Less than | `lt(1000)` |
| `lessThanOrEqual(value)` | `lte(value)` | Less or equal | `lte(500)` |

### Range Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `between(min, max)` | Value within range (inclusive) | `between(10, 100)` |

### String Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `includes(text, caseSensitive?)` | Contains substring | `includes('hello')` |
| `contains(text, caseSensitive?)` | Alias for includes | `contains('world')` |
| `startsWith(text, caseSensitive?)` | Starts with prefix | `startsWith('Mr')` |
| `endsWith(text, caseSensitive?)` | Ends with suffix | `endsWith('.pdf')` |
| `match(pattern, asRegex?, flags?)` | Pattern matching | `match(/\d+/, true)` |

### Array Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `inArray(array)` | Value in array | `inArray(['a', 'b'])` |
| `notIn(array)` | Value not in array | `notIn(['banned'])` |

### Empty Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `isEmpty(shouldBeEmpty?)` | Value is empty/null | `isEmpty()` |
| `isNotEmpty(shouldBeNotEmpty?)` | Value is not empty | `isNotEmpty()` |

### Date Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `dateEquals(date)` | Same date (ignores time) | `dateEquals(new Date())` |
| `dateBefore(date)` | Before date | `dateBefore(new Date())` |
| `dateAfter(date)` | After date | `dateAfter(new Date())` |
| `dateBetween(start, end)` | Date range | `dateBetween(start, end)` |

### Time Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `timeEquals(time)` | Same time (ignores date) | `timeEquals(new Date())` |
| `timeBefore(time)` | Before time | `timeBefore(new Date())` |
| `timeAfter(time)` | After time | `timeAfter(new Date())` |
| `timeBetween(start, end)` | Time range | `timeBetween(start, end)` |

### DateTime Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `dateTimeEquals(datetime)` | Exact timestamp | `dateTimeEquals(new Date())` |
| `dateTimeBefore(datetime)` | Before timestamp | `dateTimeBefore(new Date())` |
| `dateTimeAfter(datetime)` | After timestamp | `dateTimeAfter(new Date())` |
| `dateTimeBetween(start, end)` | Timestamp range | `dateTimeBetween(start, end)` |

### Logical Operators

| Filter | Alias | Description | Example |
|--------|-------|-------------|---------|
| `and(...filters)` | `all(...filters)` | All conditions must match | `and(gt(10), lt(100))` |
| `or(...filters)` | `any(...filters)` | Any condition must match | `or(eq('a'), eq('b'))` |
| `not(filter)` | - | Invert condition | `not(equals('test'))` |

### Custom Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `createFilter(value, callback)` | Single source custom filter | See above |
| `createMultiSourceFilter(sources, callback)` | Multi-source custom filter | See above |
| `custom(callback, ...observables)` | Custom logic with dependencies | See above |

## Best Practices

### 1. Use Specific Filters
```javascript
import { filters } from 'native-document/utils';
const { equals, greaterThan } = filters;

// ✅ Good: Specific property filters
const filtered = products.where({
    price: greaterThan(100),
    category: equals('electronics')
});

// ❌ Less efficient: Generic filter
const filtered = products.where({
    _: (product) => product.price > 100 && product.category === 'electronics'
});
```

### 2. Reuse Observable Filters
```javascript
import { filters } from 'native-document/utils';
const { between } = filters;
import { Observable } from 'native-document';

// ✅ Good: Reuse observables
const minPrice = Observable(0);
const maxPrice = Observable(1000);

const products1Filtered = products1.where({ price: between(minPrice, maxPrice) });
const products2Filtered = products2.where({ price: between(minPrice, maxPrice) });

// Both update when observables change
minPrice.set(500);
```

### 3. Combine Related Filters
```javascript
import { filters } from 'native-document/utils';
const { and, greaterThan, lessThan } = filters;

// ✅ Good: Use 'and' for multiple conditions
const filtered = products.where({
    price: and(greaterThan(100), lessThan(500))
});

// ❌ Bad: Multiple where() calls
const filtered = products
    .where({ price: greaterThan(100) })
    .where({ price: lessThan(500) });
```

### 4. Document Complex Filters
```javascript
import { filters } from 'native-document/utils';
const { and, or, greaterThan, equals } = filters;

/**
 * Filters products for flash sale eligibility:
 * - In stock OR coming soon
 * - Price between $50-$500
 * - High rating (4+ stars)
 */
const flashSaleProducts = products.where({
    stock: or(greaterThan(0), equals('coming-soon')),
    price: and(greaterThan(50), lessThan(500)),
    rating: greaterThan(4)
});
```

### 5. Avoid Over-Filtering
```javascript
import { filters } from 'native-document/utils';
const { equals, greaterThan } = filters;

// ❌ Bad: Too many where() calls
const filtered = products
    .where({ category: equals('electronics') })
    .where({ price: greaterThan(100) })
    .where({ stock: greaterThan(0) })
    .where({ rating: greaterThan(4) });

// ✅ Good: Combine into single where
const filtered = products.where({
    category: equals('electronics'),
    price: greaterThan(100),
    stock: greaterThan(0),
    rating: greaterThan(4)
});
```

## Next Steps

Explore related utilities and concepts:

## Next Steps

- **[Getting Started](getting-started.md)** - Installation and first steps
- **[Core Concepts](core-concepts.md)** - Understanding the fundamentals
- **[Observables](observables.md)** - Reactive state management
- **[Elements](elements.md)** - Creating and composing UI
- **[Conditional Rendering](conditional-rendering.md)** - Dynamic content
- **[List Rendering](list-rendering.md)** - (ForEach | ForEachArray) and dynamic lists
- **[Routing](routing.md)** - Navigation and URL management
- **[State Management](state-management.md)** - Global state patterns
- **[NDElement](native-document-element.md)** - Native Document Element
- **[Extending NDElement](extending-native-document-element.md)** - Custom Methods Guide
- **[Advanced Components](advanced-components.md)** - Template caching and singleton views
- **[Args Validation](validation.md)** - Function Argument Validation
- **[Memory Management](memory-management.md)** - Memory management

## Utilities

- **[Cache](docs/utils/cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](docs/utils/native-fetch.md)** - HTTP client with interceptors
- **[Filters](docs/utils/filters.md)** - Data filtering helpers
