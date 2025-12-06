# Validation

NativeDocument provides a comprehensive runtime validation system that helps catch errors early and ensures function arguments meet expected types and constraints.

## Function Argument Validation

### Using .args() Method

```javascript
// Original function
function createUser(name, age, email) {
    console.log(`Creating user: ${name}, ${age}, ${email}`);
}

// .args() returns a function that validates arguments before calling original
const createUserWithValidation = createUser.args(
    ArgTypes.string('name'),
    ArgTypes.number('age'), 
    ArgTypes.string('email')
);

// Usage
createUserWithValidation("John", 25, "john@example.com"); // Valid - calls original function
createUserWithValidation("John", "25", "john@example.com"); // Throws validation error
```

### WithValidation Wrapper (Equivalent)

```javascript
// These two approaches are equivalent:

// Method 1: Using .args()
const createUserWithValidation1 = createUser.args(
    ArgTypes.string('name'),
    ArgTypes.number('age'),
    ArgTypes.string('email')
);

// Method 2: Using withValidation()
const createUserWithValidation2 = withValidation(createUser, [
    ArgTypes.string('name'),
    ArgTypes.number('age'),
    ArgTypes.string('email')
], 'createUser');

// Both return a function that validates arguments before calling the original
```

## ArgTypes Reference

### Basic Types

```javascript
ArgTypes.string('name')          // Must be string
ArgTypes.number('age')           // Must be number  
ArgTypes.boolean('isActive')     // Must be boolean
ArgTypes.function('callback')    // Must be function
ArgTypes.object('config')        // Must be object
ArgTypes.objectNotNull('data')   // Must be object and not null
```

### NativeDocument Types

```javascript
ArgTypes.observable('state')     // Must be Observable instance
ArgTypes.element('domNode')      // Must be HTML element
ArgTypes.children('content')     // Valid children (elements, strings, numbers, observables)
ArgTypes.attributes('attrs')     // Valid attributes object
```

### Optional Arguments

```javascript
function greet(name, greeting) {
    return `${greeting || 'Hello'} ${name}`;
}

// Create function with argument validation
const greetWithValidation = greet.args(
    ArgTypes.string('name'),
    ArgTypes.optional(ArgTypes.string('greeting'))
);

greetWithValidation("John");           // Valid - greeting is optional
greetWithValidation("John", "Hi");     // Valid
greetWithValidation("John", 123);      // Error - greeting must be string if provided
```

### OneOf Validation

```javascript
function setTheme(theme, config) {
    // Implementation
}

// Create function with argument validation
const setThemeWithValidation = setTheme.args(
    ArgTypes.oneOf('theme', 
        ArgTypes.string('theme'),
        ArgTypes.object('theme')
    ),
    ArgTypes.object('config')
);

setThemeWithValidation("dark", {});      // Valid - string theme
setThemeWithValidation({name: "custom"}, {}); // Valid - object theme  
setThemeWithValidation(123, {});         // Error - must be string or object
```

## Error Handling

### Validation Errors

```javascript
function processData(items, callback) {
    // Implementation  
}

// Create function with argument validation
const processDataWithValidation = processData.args(
    ArgTypes.children('items'),
    ArgTypes.function('callback')
);

try {
    processDataWithValidation("invalid", "not a function");
} catch (error) {
    console.log(error.message);
    // "Argument validation failed
    // processData: Invalid argument 'items' at position 1, expected children, got String
    // processData: Invalid argument 'callback' at position 2, expected function, got String"
}
```

### Error Boundary Pattern

```javascript
// Original function with argument validation
const createUserWithValidation = createUser.args(
    ArgTypes.string('name'),
    ArgTypes.number('age'),
    ArgTypes.string('email')
);

// Add error boundary to validation function
const safeCreateUser = createUserWithValidation.errorBoundary((error) => {
    console.error("User creation failed:", error.message);
    return null; // Return fallback value
});

// Won't throw, returns null on validation error
const result = safeCreateUser("John", "invalid age", "email");
```

## Custom Validation

### Creating Custom ArgTypes

```javascript
// Custom validator for email format
const emailType = (name) => ({
    name,
    type: 'email',
    validate: (value) => {
        return typeof value === 'string' && /\S+@\S+\.\S+/.test(value);
    }
});

function registerUser(email, password) {
    // Implementation
}

registerUser.args(
    emailType('email'),
    ArgTypes.string('password')
);
```

## Best Practices

1. **Validate early** - Add validation to public functions and components
2. **Use descriptive names** - Make error messages clear with good argument names
3. **Combine with error boundaries** - Handle validation errors gracefully
4. **Validate complex objects** - Use ArgTypes.objectNotNull for required objects
5. **Make optional explicit** - Use ArgTypes.optional() for clarity
6. **Custom validators** - Create reusable validators for domain-specific types

## Next Steps

- **[Lifecycle Events](lifecycle-events.md)** - Validate lifecycle callback arguments
- **[NDElement](native-document-element.md)** - Native Document Element
- **[Extending NDElement](extending-native-document-element.md)** - Custom Methods Guide
- **[Memory Management](memory-management.md)** - Debugging memory issues with validation