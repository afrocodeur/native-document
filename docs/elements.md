---
title: Elements
description: Create reactive HTML elements with a declarative syntax - every HTML element has a corresponding function in NativeDocument
---

# Elements

NativeDocument provides a simple and intuitive way to create HTML elements with a declarative syntax. Every HTML element has a corresponding function that creates a reactive DOM element.

## Basic Element Creation

```javascript
// With attributes
const title       = H1({ class: 'main-title' }, 'Welcome to my app');
const description = P({ class: 'description' }, 'This is a paragraph');

// Without attributes
const simpleTitle = H1('Welcome to my app');
const simplePara  = P('This is a paragraph');
const container   = Div('Content here');

// Self-closing elements
const separator = Hr();
const lineBreak  = Br();
```

## Element Structure

All element functions follow the same pattern:

```javascript
ElementName(attributes, children)
// or
ElementName(children) // attributes are optional
```

- **attributes** - object with HTML attributes (optional, can be `null` or omitted)
- **children** - text, number, observable, other elements, closures (no-param functions), or an array of any of these. Closures are accepted as-is - no need to call them if they take no parameters.

## Working with Attributes

```javascript
// Static attributes
const link = Link({
    href:  '/about',
    class: 'nav-link',
    id:    'about-link'
}, 'About Us');

// Boolean attributes
const checkbox = Input({
    type:     'checkbox',
    checked:  true,
    disabled: false
});

// Data attributes
const card = Div({
    'data-id':       '123',
    'data-category': 'important'
}, 'Content');
```

## Reactive Attributes

Pass an observable directly as an attribute value - it updates automatically when the observable changes:

```javascript
const isVisible = Observable(true);
const userName  = Observable('Guest');
const theme     = Observable('dark');

const greeting = Div({
    class:  theme,
    hidden: isVisible.isFalsy()
}, ['Hello ', userName, '!']);

// Reactive styles
const box = Div({
    style: {
        backgroundColor: theme.is('dark').check(v => v ? '#333' : '#fff'),
        color:           theme.is('dark').check(v => v ? '#fff' : '#333')
    }
}, 'Themed content');
```

## Conditional Classes

```javascript
const isActive = Observable(false);
const count    = Observable(0);

const item = Div({
    class: {
        'item':        true,                    // always present
        'active':      isActive,                // present when isActive is true
        'highlighted': count.check(c => c > 5) // present when count > 5
    }
}, 'List item');
```

## Children and Content

```javascript
// Single text child
const simple = P('Simple text');

// Single element child
const wrapper = Div({ class: 'wrapper' }, P('Wrapped paragraph'));

// Multiple children as array
const list = Div({ class: 'item-list' }, [
    P('First item'),
    P('Second item'),
    P('Third item')
]);

// Mixed content
const mixed = Div([
    H2('Title'),
    'Some text between elements',
    P('A paragraph'),
    Button('Click me')
]);
```

## Event Handling with the `.nd` API

The `.nd` API provides a fluent interface for events, lifecycle, and DOM utilities:

```javascript
const button = Button('Click me')
    .nd.onClick(() => console.log('Clicked!'));

// With attributes
const styledButton = Button({ class: 'btn' }, 'Click me')
    .nd.onClick(() => console.log('Clicked!'));

// Multiple events - chained
const input = Input({ type: 'text', placeholder: 'Type here...' })
    .nd
    .onFocus(() => console.log('Focused'))
    .onBlur(() => console.log('Blurred'))
    .onInput(e => console.log('Value:', e.target.value));

// Single event via .on() - name, callback, options (standard addEventListener signature)
const input2 = Input({ type: 'text' })
    .nd
    .on('input', e => console.log('Value:', e.target.value))
    .on('focus', () => console.log('Focused'), { once: true });

// Prevent default
const form = Form()
    .nd.onPreventSubmit(e => {
        console.log('Submitted without page reload');
    });
```

## Form Elements and Two-Way Binding

Passing an observable to `value` or `checked` creates automatic two-way binding:

```javascript
const name      = Observable('');
const email     = Observable('');
const isChecked = Observable(false);

const nameInput  = Input({ type: 'text',     value: name,      placeholder: 'Your name' });
const emailInput = Input({ type: 'email',    value: email,     placeholder: 'Your email' });
const checkbox   = Input({ type: 'checkbox', checked: isChecked });
```

## Lifecycle Management

```javascript
const component = Div('Component content')
    .nd.mounted(element => {
        console.log('Mounted to DOM');
    })
    .nd.unmounted(element => {
        console.log('Removed from DOM');
    });

// Combined
const widget = Div('Widget')
    .nd.lifecycle({
        mounted:   element => console.log('Mounted'),
        unmounted: element => console.log('Unmounted')
    });
```

## Manual DOM Manipulation

```javascript
// Remove all children
const container = Div([P('Child 1'), P('Child 2')]);
container.nd.unmountChildren();

// Remove element from DOM
const element = Div('Content');
element.nd.remove();
```

## Element References

`.ref()` and `.refSelf()` both store a reference on a target object, but they store different things:

- **`.ref(target, name)`** - stores the **native HTML element** (`this.$element`) → use when you need direct DOM access
- **`.refSelf(target, name)`** - stores the **`NDElement` instance** (`this`) → use when you need to keep calling `.nd` methods

```javascript
const refs = {};

const app = Div([
    Input({ type: 'text' })
        .nd.ref(refs, 'nameInput'),       // refs.nameInput → HTMLInputElement

    Input({ type: 'text' })
        .nd.refSelf(refs, 'emailInput'),  // refs.emailInput → NDElement instance

    Button('Actions')
        .nd.onClick(() => {
        refs.nameInput.focus();                              // native DOM method
        refs.emailInput.onInput(e => console.log(e.target.value)); // nd method
    })
]);
```

## `.nd.with()` - Instance-level Custom Methods

Add custom methods to a single element instance without affecting other elements:

```javascript
const customButton = Button('Click me')
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

customButton.resetStyle().highlight();
```

> `.nd.with()` only affects the current instance. To add methods to **all** elements, extend `NDElement.prototype` - see [Extending NDElement](./extending-native-document-element.md).

## `.nd.attach()` - Template Binding

Attaches a template binding hydrator to the element. Used internally by the `useCache` and `useSingleton` rendering systems:

```javascript
// methodName - the event/method name to hydrate
// bindingHydrator - a binding with a $hydrate method, or a plain function
element.nd.attach('onClick', bindingHydrator);
```

See [Advanced Components](./advanced-components.md) for practical usage with `useCache`.

## Class and Style Accumulators

Build classes and styles programmatically before passing them to an element:

```javascript
import { classPropertyAccumulator, cssPropertyAccumulator } from 'native-document';

// Class accumulator
const classes = classPropertyAccumulator(['btn']);
classes.add('primary');
classes.add('large');

const button = Button({ class: classes.value() }, 'Submit');
// class="btn primary large"

// Object form
const classObj = classPropertyAccumulator({ btn: true });
classObj.add('primary', true);
classObj.add('disabled', false);
classObj.value(); // { btn: true, primary: true, disabled: false }

// CSS accumulator
const styles = cssPropertyAccumulator({ color: 'red' });
styles.add('font-size', '16px');
styles.add('margin', '10px');

const element = Div({ style: styles.value() }, 'Styled content');
// style="color: red; font-size: 16px; margin: 10px"
```

## Shadow DOM

```javascript
// Open shadow DOM (inspectable in DevTools)
const widget = Div('Widget content')
    .nd.openShadow(`
        :host { display: block; padding: 20px; }
        p { color: blue; }
    `);

// Closed shadow DOM (private)
const privateWidget = Div('Private content')
    .nd.closedShadow(`p { color: red; }`);

// Manual mode
const customWidget = Div('Custom')
    .nd.shadow('open', `/* scoped styles */`);
```

## Practical Example: Form with Validation

```javascript
const formData = Observable.object({ name: '', email: '', age: '' });
const errors   = Observable.object({ name: '', email: '', age: '' });

const validateForm = () => {
    const data = formData.$value;

    errors.name.set(data.name.length < 2 ? 'Name must be at least 2 characters' : '');
    errors.email.set(!data.email.includes('@') ? 'Invalid email address' : '');
    errors.age.set(isNaN(data.age) || data.age < 1 ? 'Age must be a valid number' : '');

    return [errors.name, errors.email, errors.age].every(e => e.val() === '');
};

const contactForm = Form({ class: 'contact-form' }, [

    Div({ class: 'field' }, [
        Label('Name:'),
        Input({ type: 'text', value: formData.name, placeholder: 'Enter your name' })
            .nd.onBlur(validateForm),
        ShowIf(errors.name.isTruthy(), Span({ class: 'error' }, errors.name))
    ]),

    Div({ class: 'field' }, [
        Label('Email:'),
        Input({ type: 'email', value: formData.email, placeholder: 'Enter your email' })
            .nd.onBlur(validateForm),
        ShowIf(errors.email.isTruthy(), Span({ class: 'error' }, errors.email))
    ]),

    Div({ class: 'field' }, [
        Label('Age:'),
        Input({ type: 'number', value: formData.age, placeholder: 'Enter your age' })
            .nd.onBlur(validateForm),
        ShowIf(errors.age.isTruthy(), Span({ class: 'error' }, errors.age))
    ]),

    Button({ type: 'submit', class: 'btn btn-primary' }, 'Submit')

]).nd.onPreventSubmit(() => {
    if (validateForm()) {
        console.log('Form is valid!', formData.$value);
    }
});
```

## Available HTML Elements

**Text:** `H1`, `H2`, `H3`, `H4`, `H5`, `H6`, `P`, `Span`, `Strong`, `Em`, `Small`, `Mark`, `BlockQuote`, `Pre`, `Code`

**Layout:** `Div`, `Section`, `Article`, `Aside`, `Header`, `Footer`, `Nav`, `Main`

**Form:** `Form`, `Input`, `TextArea`, `Select`, `Option`, `Button`, `Label`, `FieldSet`, `Legend`

**List:** `Ul`, `Ol`, `Li`, `Dl`, `Dt`, `Dd`

**Media:** `Img`, `Audio`, `Video`, `Canvas`

**Interactive:** `Link`, `Details`, `Summary`, `Dialog`

**SVG:** `Svg`, `SvgSvg`, `SvgCircle`, `SvgRect`, `SvgEllipse`, `SvgLine`, `SvgPolyline`, `SvgPolygon`, `SvgPath`, `SvgText`, `SvgTSpan`, `SvgG`, `SvgDefs`, `SvgUse`, `SvgSymbol`, `SvgClipPath`, `SvgMask`, `SvgMarker`, `SvgPattern`, `SvgImage`, `SvgLinearGradient`, `SvgRadialGradient`, `SvgStop`, `SvgFilter`, and more.

> For detailed SVG usage and examples, see [SVG Elements](./svg-elements.md).

## Best Practices

1. Use semantic HTML elements for better accessibility
2. Leverage reactive attributes with observables for dynamic UIs
3. Use `.nd.with()` for instance-level customization, `NDElement.prototype` for app-wide methods
4. Store element references with `.nd.ref()` when you need direct DOM access
5. Use `ShowIf` with `.isTruthy()` / `.isFalsy()` for clean conditional rendering
6. Group related elements in logical containers

## Next Steps

- **[Conditional Rendering](./conditional-rendering.md)** - Dynamic content
- **[List Rendering](./list-rendering.md)** - ForEach and dynamic lists
- **[NDElement](./native-document-element.md)** - Full `.nd` API reference
- **[Extending NDElement](./extending-native-document-element.md)** - Custom methods guide
- **[SVG Elements](./svg-elements.md)** - SVG wrapper functions
- **[Advanced Components](./advanced-components.md)** - Template caching and singleton views
- **[Lifecycle Events](./lifecycle-events.md)** - Mounted, unmounted, beforeUnmount