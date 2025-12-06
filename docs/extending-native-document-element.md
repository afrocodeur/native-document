# Extending NDElement - Custom Methods Guide

NDElement is designed to be extensible, allowing developers to add custom methods that make their code more readable and maintainable. This guide shows how to create custom NDElement extensions for common patterns.

## Why Extend NDElement?

Extending NDElement allows you to:
- **Encapsulate common patterns** into reusable methods
- **Improve code readability** with domain-specific method names
- **Reduce boilerplate** by abstracting complex event handling
- **Create a consistent API** across your application

## Basic Extension Pattern

The simplest way to extend NDElement is by adding methods to its prototype:

```javascript
// Basic extension
NDElement.prototype.customMethod = function(/* parameters */) {
    // Your logic here
    return this; // Return 'this' for method chaining
};
```

## Common Extension Examples

### 1. Keyboard Event Shortcuts

Instead of writing complex keyboard event handlers, create semantic shortcuts:

```javascript
// Enter key handler
NDElement.prototype.onEnter = function(callback) {
    this.$element.addEventListener('keyup', e => {
        if (e.key === 'Enter') {
            callback(e);
        }
    });
    return this;
};

// Escape key handler
NDElement.prototype.onEscape = function(callback) {
    this.$element.addEventListener('keyup', e => {
        if (e.key === 'Escape') {
            callback(e);
        }
    });
    return this;
};

// Arrow keys handler
NDElement.prototype.onArrowKey = function(callback) {
    this.$element.addEventListener('keydown', e => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            callback(e, e.key);
        }
    });
    return this;
};

// Usage
Input({ type: 'text' })
    .nd.onEnter(e => console.log('Form submitted'))
    .onEscape(e => e.target.blur())
    .onArrowKey((e, direction) => console.log('Arrow pressed:', direction));
```

### 2. Form Validation Extensions

Create semantic validation methods:

```javascript
// Required field validation
NDElement.prototype.required = function(message = 'This field is required') {
    this.$element.addEventListener('blur', e => {
        const value = e.target.value.trim();
        if (!value) {
            this.showError(message);
        } else {
            this.clearError();
        }
    });
    return this;
};

// Email validation
NDElement.prototype.email = function(message = 'Please enter a valid email') {
    this.$element.addEventListener('blur', e => {
        const email = e.target.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            this.showError(message);
        } else {
            this.clearError();
        }
    });
    return this;
};

// Min length validation
NDElement.prototype.minLength = function(length, message) {
    message = message || `Minimum ${length} characters required`;
    this.$element.addEventListener('input', e => {
        if (e.target.value.length < length && e.target.value.length > 0) {
            this.showError(message);
        } else {
            this.clearError();
        }
    });
    return this;
};

// Error display helpers
NDElement.prototype.showError = function(message) {
    this.clearError();
    const errorElement = Span({
        class: 'error-message',
        style: 'color: red; font-size: 0.8rem'
    }, message);

    this.$element.parentNode.appendChild(errorElement);
    this.$element.classList.add('error');
    return this;
};

NDElement.prototype.clearError = function() {
    const parent = this.$element.parentNode;
    const existingError = parent.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    this.$element.classList.remove('error');
    return this;
};

// Usage
Input({ type: 'email', placeholder: 'Email' })
    .nd.required()
    .email();

Input({ type: 'password', placeholder: 'Password' })
    .nd.required()
    .minLength(8, 'Password must be at least 8 characters');
```

### 3. Animation Extensions

Create smooth animation helpers:

```javascript
// Fade in animation
NDElement.prototype.fadeIn = function(duration = 300) {
    this.$element.style.opacity = '0';
    this.$element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    requestAnimationFrame(() => {
        this.$element.style.opacity = '1';
    });
    
    return this;
};

// Fade out animation
NDElement.prototype.fadeOut = function(duration = 300, callback) {
    this.$element.style.transition = `opacity ${duration}ms ease-in-out`;
    this.$element.style.opacity = '0';
    
    setTimeout(() => {
        if (callback) callback();
    }, duration);
    
    return this;
};

// Slide down animation
NDElement.prototype.slideDown = function(duration = 300) {
    const element = this.$element;
    element.style.maxHeight = '0';
    element.style.overflow = 'hidden';
    element.style.transition = `max-height ${duration}ms ease-in-out`;
    
    requestAnimationFrame(() => {
        element.style.maxHeight = element.scrollHeight + 'px';
    });
    
    return this;
};

// Usage
Div("Animated content")
    .nd.onClick(function() {
        this.nd.fadeOut(300, () => this.remove());
    });
```

## Best Practices

### 1. Always Return `this`
Enable method chaining by returning the NDElement instance:

```javascript
NDElement.prototype.myMethod = function() {
    // Your logic here
    return this; // Enable chaining
};
```

### 2. Use Descriptive Method Names
Choose names that clearly describe what the method does:

```javascript
// Good
NDElement.prototype.onEnter = function(callback) { /* ... */ };
NDElement.prototype.fadeIn = function(duration) { /* ... */ };

// Avoid
NDElement.prototype.ke = function(callback) { /* ... */ }; // Unclear
NDElement.prototype.doStuff = function() { /* ... */ }; // Too vague
```

### 3. Handle Edge Cases
Always consider edge cases and provide sensible defaults:

```javascript
NDElement.prototype.fadeIn = function(duration = 300) {
    // Ensure duration is valid
    duration = Math.max(0, parseInt(duration) || 300);
    
    // Check if element exists
    if (!this.$element) return this;
    
    // Your animation logic
    return this;
};
```

### 4. Document Your Extensions

Always document your custom methods:

```javascript
/**
 * Handles Enter key press events
 * @param {Function} callback - Function to call when Enter is pressed
 * @returns {NDElement} Returns this for method chaining
 * @example
 * Input().nd.onEnter(e => console.log('Enter pressed'));
 */
NDElement.prototype.onEnter = function(callback) {
    this.$element.addEventListener('keyup', e => {
        if (e.key === 'Enter') {
            callback(e);
        }
    });
    return this;
};
```

By extending NDElement thoughtfully, you can create a powerful, domain-specific API that makes your code more readable, maintainable, and enjoyable to work with.

## Next Steps

Explore these related topics to build complete applications:

- **[Args Validation](validation.md)** - Function Argument Validation
- **[Memory Management](memory-management.md)** - Memory management
- **[Anchor](anchor.md)** - Anchor