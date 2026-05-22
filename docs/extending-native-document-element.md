---
title: Extending NDElement
description: Add custom methods to NDElement to create reusable, domain-specific APIs across your application
---

# Extending NDElement

NDElement is designed to be extensible. You can add custom methods to make your code more expressive, reduce boilerplate, and create a consistent API across your application.

## Two Ways to Extend

### `NDElement.extend()` - App-wide methods

Use `NDElement.extend()` to add methods to **all NDElement instances**. This is the recommended public API:

```javascript
import { NDElement } from 'native-document';

NDElement.extend({
    onEnter(callback) {
        this.$element.addEventListener('keyup', e => {
            if (e.key === 'Enter') callback(e);
        });
        return this;
    }
});

// Now available on every element
Input({ type: 'text' }).nd.onEnter(e => console.log('Enter pressed'));
```

### `.nd.with()` - Instance-level methods

Use `.nd.with()` to add methods to a **single element instance** only. See [NDElement](./native-document-element.md) for the full explanation and the `Counter` use case.

```javascript
const card = Div({ class: 'card' })
    .nd.with({
        highlight() {
            this.$element.style.outline = '2px solid blue';
            return this;
        }
    })
    .highlight();
```

> Always `return this` at the end of every method to enable chaining.

---

## Common Extension Examples

### Keyboard shortcuts

```javascript
NDElement.extend({
    onEnter(callback) {
        this.$element.addEventListener('keyup', e => {
            if (e.key === 'Enter') callback(e);
        });
        return this;
    },
    onEscape(callback) {
        this.$element.addEventListener('keyup', e => {
            if (e.key === 'Escape') callback(e);
        });
        return this;
    },
    onArrowKey(callback) {
        this.$element.addEventListener('keydown', e => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                callback(e, e.key);
            }
        });
        return this;
    }
});

// Usage
Input({ type: 'text' })
    .nd
    .onEnter(e => console.log('Submitted'))
    .onEscape(e => e.target.blur())
    .onArrowKey((e, direction) => console.log('Arrow:', direction));
```

### Form validation

```javascript
NDElement.extend({
    required(message = 'This field is required') {
        this.$element.addEventListener('blur', e => {
            e.target.value.trim() ? this.clearError() : this.showError(message);
        });
        return this;
    },
    email(message = 'Please enter a valid email') {
        this.$element.addEventListener('blur', e => {
            const value = e.target.value.trim();
            const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            value && !valid ? this.showError(message) : this.clearError();
        });
        return this;
    },
    minLength(length, message) {
        message = message || `Minimum ${length} characters required`;
        this.$element.addEventListener('input', e => {
            const len = e.target.value.length;
            len > 0 && len < length ? this.showError(message) : this.clearError();
        });
        return this;
    },
    showError(message) {
        this.clearError();
        this.$element.parentNode.appendChild(
            Span({ class: 'error-message', style: 'color: red; font-size: 0.8rem' }, message)
        );
        this.$element.classList.add('error');
        return this;
    },
    clearError() {
        this.$element.parentNode.querySelector('.error-message')?.remove();
        this.$element.classList.remove('error');
        return this;
    }
});

// Usage
Input({ type: 'email', placeholder: 'Email' })
    .nd
    .required()
    .email();

Input({ type: 'password', placeholder: 'Password' })
    .nd
    .required()
    .minLength(8, 'Password must be at least 8 characters');
```

### Animations

```javascript
NDElement.extend({
    fadeIn(duration = 300) {
        duration = Math.max(0, parseInt(duration) || 300);
        this.$element.style.opacity = '0';
        this.$element.style.transition = `opacity ${duration}ms ease-in-out`;
        requestAnimationFrame(() => {
            this.$element.style.opacity = '1';
        });
        return this;
    },
    fadeOut(duration = 300, callback) {
        duration = Math.max(0, parseInt(duration) || 300);
        this.$element.style.transition = `opacity ${duration}ms ease-in-out`;
        this.$element.style.opacity = '0';
        setTimeout(() => { if (callback) callback(); }, duration);
        return this;
    },
    slideDown(duration = 300) {
        const el = this.$element;
        el.style.maxHeight = '0';
        el.style.overflow = 'hidden';
        el.style.transition = `max-height ${duration}ms ease-in-out`;
        requestAnimationFrame(() => {
            el.style.maxHeight = el.scrollHeight + 'px';
        });
        return this;
    }
});

// Usage
Div('Animated content').nd.onClick(function() {
    this.nd.fadeOut(300, () => this.nd.remove());
});
```

---

## Best Practices

### Always return `this`

Every method must return `this` to keep the chain alive:

```javascript
NDElement.extend({
    myMethod() {
        // your logic
        return this; // required
    }
});
```

### Use descriptive names

```javascript
// Good
NDElement.extend({ onEnter(cb) { ... } });
NDElement.extend({ fadeIn(duration) { ... } });

// Avoid
NDElement.extend({ ke(cb) { ... } });     // unclear
NDElement.extend({ doStuff() { ... } });  // too vague
```

### Guard against edge cases

```javascript
NDElement.extend({
    fadeIn(duration = 300) {
        if (!this.$element) return this;
        duration = Math.max(0, parseInt(duration) || 300);
        // animation logic
        return this;
    }
});
```

### Document your extensions

```javascript
/**
 * Fires callback when the Enter key is pressed
 * @param {Function} callback - receives the KeyboardEvent
 * @returns {NDElement} this - for chaining
 * @example
 * Input().nd.onEnter(e => submitForm());
 */
NDElement.extend({
    onEnter(callback) {
        this.$element.addEventListener('keyup', e => {
            if (e.key === 'Enter') callback(e);
        });
        return this;
    }
});
```

### Respect protected methods

The following names cannot be used - attempting to extend with them throws a `NativeDocumentError`:

`constructor`, `valueOf`, `$element`, `$observer`, `ref`, `remove`, `cleanup`, `with`, `extend`, `attach`, `lifecycle`, `mounted`, `unmounted`, `unmountChildren`

---

## Next Steps

- **[NDElement](./native-document-element.md)** - Full NDElement API reference
- **[Lifecycle Events](./lifecycle-events.md)** - Lifecycle in depth
- **[Args Validation](./validation.md)** - Function argument validation
- **[Memory Management](./memory-management.md)** - Memory management

## Utilities

- **[Cache](./cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](./native-fetch.md)** - HTTP client with interceptors
- **[Filters](./filters.md)** - Data filtering helpers