---
title: Args Validation
description: Runtime argument validation with ArgTypes and withValidation - catch type errors early in development
---

# Args Validation

NativeDocument provides a runtime argument validation system that helps catch type errors early. It is only active in development mode - in production, `ArgTypes` is an empty object and `withValidation` is a no-op.

## Function Argument Validation

### `.args()` method

`.args()` is available on any function. It returns a new function that validates arguments before calling the original:

```javascript
import { ArgTypes } from 'native-document';

function createUser(name, age, email) {
    console.log(`Creating user: ${name}, ${age}, ${email}`);
}

const createUserWithValidation = createUser.args(
    ArgTypes.string('name'),
    ArgTypes.number('age'),
    ArgTypes.string('email')
);

createUserWithValidation('John', 25, 'john@example.com'); // valid
createUserWithValidation('John', '25', 'john@example.com'); // throws
```

### `withValidation(fn, argSchema, fnName?)` - equivalent

```javascript
import { ArgTypes, withValidation } from 'native-document';

const createUserWithValidation = withValidation(createUser, [
    ArgTypes.string('name'),
    ArgTypes.number('age'),
    ArgTypes.string('email')
], 'createUser');
```

---

## ArgTypes Reference

### Basic types

```javascript
ArgTypes.string('name')        // Must be string
ArgTypes.number('age')         // Must be number
ArgTypes.boolean('isActive')   // Must be boolean
ArgTypes.function('callback')  // Must be function
ArgTypes.object('config')      // Must be object
ArgTypes.objectNotNull('data') // Must be object and not null
```

### NativeDocument types

```javascript
ArgTypes.observable('state')   // Must be an Observable instance
ArgTypes.element('domNode')    // Must be an HTML element
ArgTypes.children('content')   // Valid children (elements, strings, numbers, observables)
ArgTypes.attributes('attrs')   // Valid attributes object
```

### Optional arguments

```javascript
function greet(name, greeting) {
    return `${greeting || 'Hello'} ${name}`;
}

const greetSafe = greet.args(
    ArgTypes.string('name'),
    ArgTypes.optional(ArgTypes.string('greeting'))
);

greetSafe('John');        // valid - greeting is optional
greetSafe('John', 'Hi'); // valid
greetSafe('John', 123);  // throws - greeting must be string if provided
```

### `oneOf` - union types

```javascript
function setTheme(theme, config) { /* ... */ }

const setThemeSafe = setTheme.args(
    ArgTypes.oneOf('theme',
        ArgTypes.string('theme'),
        ArgTypes.object('theme')
    ),
    ArgTypes.object('config')
);

setThemeSafe('dark', {});          // valid - string
setThemeSafe({ name: 'custom' }, {}); // valid - object
setThemeSafe(123, {});             // throws - must be string or object
```

---

## Error Handling

### Validation errors

```javascript
function processData(items, callback) { /* ... */ }

const processDataSafe = processData.args(
    ArgTypes.children('items'),
    ArgTypes.function('callback')
);

try {
    processDataSafe('invalid', 'not a function');
} catch (error) {
    console.log(error.message);
    // "Argument validation failed
    // processData: Invalid argument 'items' at position 1, expected children, got String
    // processData: Invalid argument 'callback' at position 2, expected function, got String"
}
```

### Error boundary

Combine with `.errorBoundary()` to handle validation errors gracefully instead of throwing:

```javascript
const safeCreateUser = createUser
    .args(
        ArgTypes.string('name'),
        ArgTypes.number('age'),
        ArgTypes.string('email')
    )
    .errorBoundary((error) => {
        console.error('User creation failed:', error.message);
        return null;
    });

const result = safeCreateUser('John', 'invalid age', 'email'); // returns null, no throw
```

---

## Custom ArgTypes

Create reusable validators for domain-specific types:

```javascript
const emailType = (name) => ({
    name,
    type: 'email',
    validate: (value) => typeof value === 'string' && /\S+@\S+\.\S+/.test(value)
});

const positiveInt = (name) => ({
    name,
    type: 'positiveInt',
    validate: (value) => Number.isInteger(value) && value > 0
});

function registerUser(email, age) { /* ... */ }

registerUser.args(
    emailType('email'),
    positiveInt('age')
);
```

---

## Best Practices

1. Add validation to all public functions and component factories
2. Use descriptive argument names - they appear in error messages
3. Use `ArgTypes.objectNotNull()` for required objects - `ArgTypes.object()` accepts `null`
4. Use `ArgTypes.optional()` explicitly - makes the API contract clear
5. Create custom validators for domain types (email, URL, positive number, etc.)
6. Combine with `.errorBoundary()` to avoid uncaught errors in production

---

## Next Steps

- **[NDElement](./native-document-element.md)** - Native Document Element
- **[Extending NDElement](./extending-native-document-element.md)** - Custom methods guide
- **[Memory Management](./memory-management.md)** - Debugging memory issues
- **[Advanced Components](./advanced-components.md)** - Template caching and singleton views

## Utilities

- **[Cache](./cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](./native-fetch.md)** - HTTP client with interceptors
- **[Filters](./filters.md)** - Data filtering helpers