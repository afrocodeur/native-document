# Elements

NativeDocument provides a simple and intuitive way to create HTML elements with a declarative syntax. Every HTML element has a corresponding function that creates reactive DOM elements.

## Basic Element Creation

```javascript
// Simple elements with attributes
const title = H1({ class: "main-title" }, "Welcome to my app");
const description = P({ class: "description" }, "This is a paragraph");

// Elements without attributes (attributes omitted)
const simpleTitle = H1("Welcome to my app");
const simplePara = P("This is a paragraph");
const container = Div("Content here");

// Elements without content
const separator = Hr();
const lineBreak = Br();
```

## Element Structure

All element functions follow the same pattern:
```javascript
ElementName(attributes, children)
// or
ElementName(children) // attributes are optional
```

- **attributes**: Object with HTML attributes (optional, can be `null` or omitted)
- **children**: Content inside the element (text, number, observable, other elements, or arrays)

## Working with Attributes

```javascript
// Static attributes
const link = Link({ 
  href: "/about", 
  class: "nav-link",
  id: "about-link"
}, "About Us");

// Boolean attributes
const input = Input({ 
  type: "checkbox",
  checked: true,
  disabled: false
});

// Data attributes
const element = Div({
  "data-id": "123",
  "data-category": "important"
}, "Content");
```

## Reactive Attributes with Observables

```javascript
const isVisible = Observable(true);
const userName = Observable("Guest");
const theme = Observable("dark");

// Reactive attributes
const greeting = Div({
  class: theme, // Updates when theme changes
  hidden: isVisible.check(val => !val) // Hide when isVisible is false
}, ['Hello ', userName, '!']); // Reactive text content

// Reactive styles
const box = Div({
  style: {
    backgroundColor: theme.check(t => t === "dark" ? "#333" : "#fff"),
    color: theme.check(t => t === "dark" ? "#fff" : "#333")
  }
}, "Themed content");
```

## Children and Content

```javascript
// Text content (no attributes needed)
const simple = P("Simple text");

// Single child element
const wrapper = Div({ class: "wrapper" }, 
  P("Wrapped paragraph")
);

// Multiple children as array
const list = Div({ class: "item-list" }, [
  P("First item"),
  P("Second item"),
  P("Third item")
]);

// Mixed content
const mixed = Div([
  H2("Title"),
  "Some text between elements",
  P("A paragraph"),
  Button("Click me")
]);
```

## Event Handling with .nd API

The `.nd` (NativeDocument) API provides a fluent interface for adding functionality to elements.

```javascript
const button = Button("Click me")
  .nd.onClick(() => {
    console.log("Button clicked!");
  });

// With attributes and events
const styledButton = Button({ class: "btn" }, "Click me")
  .nd.onClick(() => {
    console.log("Button clicked!");
  });

// Multiple events
const input = Input({ type: "text", placeholder: "Type here..." })
  .nd.onFocus(() => console.log("Input focused"))
  .nd.onBlur(() => console.log("Input blurred"))
  .nd.onInput(event => console.log("Input value:", event.target.value));

// Or
const input = Input({ type: "text", placeholder: "Type here..." })
  .nd.on({
        focus: () => console.log("Input focused"),
        blur: () => console.log("Input blurred"),
        input: event => console.log("Input value:", event.target.value)
    });

// Prevent default behavior
const form = Form()
  .nd.onPreventSubmit(event => {
    console.log("Form submitted without page reload");
    // Handle form submission
  });
```

## Advanced Element Composition

### Extending Elements with Custom Methods

Use `.nd.with()` to add custom methods to elements:
```javascript
const customButton = Button("Click me")
    .nd.with({
        highlight() {
            this.$element.style.backgroundColor = 'yellow';
            return this;
        },
        resetStyle() {
            this.$element.style.backgroundColor = '';
            return this;
        }
    })
    .highlight();

// Chain custom methods
customButton.resetStyle().highlight();
```

### Class and Style Accumulators

Build classes and styles programmatically:
```javascript
import { classPropertyAccumulator, cssPropertyAccumulator } from 'native-document';

// Class accumulator
const classes = classPropertyAccumulator(['btn']);
classes.add('primary');
classes.add('large');

const button = Button({ class: classes.value() }, "Submit");
// Result: class="btn primary large"

// Or with object
const classObj = classPropertyAccumulator({ btn: true });
classObj.add('primary', true);
classObj.add('disabled', false);
console.log(classObj.value()); // { btn: true, primary: true, disabled: false }

// CSS accumulator
const styles = cssPropertyAccumulator({ color: 'red' });
styles.add('font-size', '16px');
styles.add('margin', '10px');

const element = Div({ style: styles.value() }, "Styled content");
// Result: style="color: red; font-size: 16px; margin: 10px"

// Or with array
const styleArr = cssPropertyAccumulator('color: red; font-size: 16px');
styleArr.add('margin', '10px');
console.log(styleArr.value()); // "color: red; font-size: 16px; margin: 10px;"
```

## Form Elements and Two-Way Binding

```javascript
const name = Observable("");
const email = Observable("");
const isChecked = Observable(false);

// Text input with two-way binding
const nameInput = Input({ 
  type: "text",
  value: name, // Automatic two-way binding
  placeholder: "Enter your name"
});

// Email input
const emailInput = Input({
  type: "email", 
  value: email,
  placeholder: "Enter your email"
});

// Checkbox with binding
const checkbox = Input({
  type: "checkbox",
  checked: isChecked // Automatic two-way binding
});
```

## Conditional Classes and Styles

```javascript
const isActive = Observable(false);
const count = Observable(0);

// Conditional classes
const item = Div({
  class: {
    "item": true, // Always present
    "active": isActive, // Present when isActive is true
    "highlighted": count.check(c => c > 5) // Present when count > 5
  }
}, "List item");

// Dynamic styles
const progress = Div({
  style: {
    width: count.check(c => `${c}%`),
    backgroundColor: count.check(c => c > 50 ? "green" : "red")
  }
}, "Progress bar");
```

## Lifecycle Management

```javascript
const component = Div("Component content")
    .nd.mounted(element => {
        console.log("Component mounted to DOM");
        // Initialize component
    })
    .nd.unmounted(element => {
        console.log("Component removed from DOM");
        // Cleanup resources
    });

// Combined lifecycle
const widget = Div("Widget")
    .nd.lifecycle({
        mounted: element => console.log("Widget mounted"),
        unmounted: element => console.log("Widget unmounted")
    });
```
## Manual DOM Manipulation

### Unmounting Children

Remove all children from an element:
```javascript
const container = Div([
    P("Child 1"),
    P("Child 2"),
    P("Child 3")
]);

// Remove all children
container.nd.unmountChildren();
// container is now empty but still in DOM
```

### Removing Elements

Remove an element from the DOM:
```javascript
const element = Div("Content");
document.body.appendChild(element.nd.node());

// Remove from DOM
element.nd.remove();
// Element is detached from DOM
```

## Element References

```javascript
const refs = {};

const app = Div([
    Input({ type: "text" })
        .nd.ref(refs, "nameInput"), // Store reference as refs.nameInput

    Button("Focus Input")
        .nd.onClick(() => {
        refs.nameInput.focus(); // Use the reference
    })
]);
```

## Shadow DOM

NativeDocument supports Shadow DOM for encapsulated components:
```javascript
// Open shadow DOM (inspectable)
const widget = Div("Widget content")
    .nd.openShadow(`
            :host {
                display: block;
                padding: 20px;
                background: #f0f0f0;
            }
            p { color: blue; }
        
    `);

// Closed shadow DOM (private)
const privateWidget = Div("Private content")
    .nd.closedShadow(`
            p { color: red; }
        
    `);

// Manual shadow DOM with mode
const customWidget = Div("Custom")
    .nd.shadow('open', `
            /* Scoped styles */
        
    `);
```

## Practical Example: Simple Button with Event

```javascript
const count = Observable(0);

const incrementButton = Button({
    class: "btn btn-primary",
    type: "button"
}, "Increment")
    .nd.onClick(() => {
        count.set(count.val() + 1);
    });

const display = Div({ class: "counter-display" }, [
    P("Current count: "),
    Strong(count) // Reactive display
]);

const app = Div({ class: "counter-app" }, [
    display,
    incrementButton
]);
```

## Practical Example: Form with Validation

```javascript
const formData = Observable.object({
    name: "",
    email: "",
    age: ""
});

const errors = Observable.object({
    name: "",
    email: "",
    age: ""
});

// Validation function
const validateForm = () => {
    const data = formData.$value;
    const newErrors = {};

    newErrors.name = data.name.length < 2 ? "Name must be at least 2 characters" : "";
    newErrors.email = !data.email.includes("@") ? "Invalid email address" : "";
    newErrors.age = isNaN(data.age) || data.age < 1 ? "Age must be a valid number" : "";

    Observable.update(errors, newErrors);

    errors.set(newErrors);

    return Object.values(newErrors).every(error => error === "");
};

const contactForm = Form({ class: "contact-form" }, [
    // Name field
    Div({ class: "field" }, [
        Label("Name:"),
        Input({
            type: "text",
            value: formData.name,
            placeholder: "Enter your name"
        }).nd.onBlur(validateForm),

        ShowIf(errors.name.check(err => err !== ""),
            Span({ class: "error" }, errors.name)
        )
    ]),

    // Email field
    Div({ class: "field" }, [
        Label("Email:"),
        Input({
            type: "email",
            value: formData.email,
            placeholder: "Enter your email"
        }).nd.onBlur(validateForm),

        ShowIf(errors.email.check(err => err !== ""),
            Span({ class: "error" }, errors.email)
        )
    ]),

    // Age field
    Div({ class: "field" }, [
        Label("Age:"),
        Input({
            type: "number",
            value: formData.age,
            placeholder: "Enter your age"
        }).nd.onBlur(validateForm),

        ShowIf(errors.age.check(err => err !== ""),
            Span({ class: "error" }, errors.age)
        )
    ]),

    // Submit button
    Button({
        type: "submit",
        class: "btn btn-primary"
    }, "Submit")
])
    .nd.onPreventSubmit(() => {
        if (validateForm()) {
            console.log("Form is valid!", formData.$value);
            // Handle successful submission
        } else {
            console.log("Form has errors");
        }
    });
```

## Available Elements

NativeDocument provides functions for all standard HTML elements:

**Text Elements:** `H1`, `H2`, `H3`, `H4`, `H5`, `H6`, `P`, `Span`, `Strong`, `Em`, `Small`, `Mark`

**Layout Elements:** `Div`, `Section`, `Article`, `Aside`, `Header`, `Footer`, `Nav`, `Main`

**Form Elements:** `Form`, `Input`, `TextArea`, `Select`, `Option`, `Button`, `Label`, `FieldSet`, `Legend`

**List Elements:** `Ul`, `Ol`, `Li`, `Dl`, `Dt`, `Dd`

**Media Elements:** `Img`, `Audio`, `Video`, `Canvas`, `Svg`

**Interactive Elements:** `Link`, `Details`, `Summary`, `Dialog`, `Menu`

And many more following the same naming pattern!

## Best Practices

1. **Use semantic HTML elements** for better accessibility
2. **Leverage reactive attributes** with observables for dynamic UIs
3. **Group related elements** in logical containers
4. **Use the `.nd` API** for event handling and lifecycle management
5. **Validate form data** reactively for better user experience
6. **Store element references** when you need to manipulate them later
7. **Use conditional rendering** with `ShowIf` for dynamic content

## Next Steps

Now that you understand NativeDocument's elements, explore these advanced topics:

- **[Conditional Rendering](conditional-rendering.md)** - Dynamic content
- **[List Rendering](list-rendering.md)** - (ForEach | ForEachArray) and dynamic lists
- **[Routing](routing.md)** - Navigation and URL management
- **[State Management](state-management.md)** - Global state patterns
- **[Lifecycle Events](lifecycle-events.md)** - Lifecycle events
- **[NDElement](native-document-element.md)** - Native Document Element
- **[Extending NDElement](extending-native-document-element.md)** - Custom Methods Guide
- **[Advanced Components](advanced-components.md)** - Template caching and singleton views
- **[Args Validation](validation.md)** - Function Argument Validation
- **[Memory Management](memory-management.md)** - Memory management
- **[Anchor](anchor.md)** - Anchor

## Utilities

- **[Cache](docs/utils/cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](docs/utils/native-fetch.md)** - HTTP client with interceptors
- **[Filters](docs/utils/filters.md)** - Data filtering helpers
