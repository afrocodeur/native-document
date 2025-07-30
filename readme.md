# NativeDocument

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](#)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange.svg)](#)
[![Bundle Size](https://img.shields.io/badge/Bundle%20Size-~25kb-green.svg)](#)

> **A reactive JavaScript framework that preserves native DOM simplicity without sacrificing modern features**

NativeDocument combines the familiarity of vanilla JavaScript with the power of modern reactivity. No compilation, no virtual DOM, just pure JavaScript with an intuitive API.

## Why NativeDocument?

### **Instant Start**
```html
<script src="https://cdn.jsdelivr.net/gh/afrocodeur/native-document@latest/dist/native-document.min.js"></script>
```

### **Familiar API**
```javascript
import { Div, Button, Observable } from 'native-document/src/elements';
import { Observable } from 'native-document';

// CDN
// const { Div, Button } = NativeDocument.elements;
// const { Observable } = NativeDocument;

const count = Observable(0);

const App = Div({ class: 'app' }, [
    Div([ 'Count ', count]),
    // OR Div(`Count ${count}`),
    Button('Increment').nd.on.click(() => count.set(count.val() + 1))
]);

document.body.appendChild(App);
```

### **Complete Features**
- **Native reactivity** with observables
- **Global store** for state management
- **Built-in conditional rendering**
- **Full-featured router** (hash, history, memory modes)
- **Advanced debugging system**
- **Automatic memory management** via FinalizationRegistry

## Quick Installation

### Option 1: CDN (Instant Start)
```html
<script src="https://cdn.jsdelivr.net/gh/afrocodeur/native-document@latest/dist/native-document.min.js"></script>
<script>
  const { Div, Observable } = NativeDocument.elements
  // Your code here
</script>
```

### Option 2: Vite Template (Complete Project)
```bash
npx degit afrocodeur/native-document-vite my-app
cd my-app
npm install
npm run dev
```

### Option 3: NPM/Yarn
```bash
npm install native-document
# or
yarn add native-document
```

## Quick Example

```javascript
import { Div, Input, Button, ShowIf, ForEach } from 'native-document/src/elements'
import { Observable } from 'native-document'

// CDN
// const { Div, Input, Button, ShowIf, ForEach } = NativeDocument.elements;
// const { Observable } = NativeDocument;

// Reactive state
const todos = Observable.array([])
const newTodo = Observable('')

// Todo Component
const TodoApp = Div({ class: 'todo-app' }, [

    // Input for new todo
    Input({ placeholder: 'Add new task...', value: newTodo }),

    // Add button
    Button('Add Todo').nd.on.click(() => {
        if (newTodo.val().trim()) {
            todos.push({ id: Date.now(), text: newTodo.val(), done: false })
            newTodo.set('')
        }
    }),

    // Todo list
    ForEach(todos, (todo, index) =>
        Div({ class: 'todo-item' }, [
            Input({ type: 'checkbox', checked: todo.done }),
            `${todo.text}`,
            Button('Delete').nd.on.click(() => todos.splice(index.val(), 1))
        ]), /*item key (string | callback) */(item) => item),

    // Empty state
    ShowIf(
        todos.check(list => list.length === 0),
        Div({ class: 'empty' }, 'No todos yet!')
    )
]);

document.body.appendChild(TodoApp)
```

## Core Concepts

### Observables
Reactive data that automatically updates the DOM:
```javascript
import { Div } from 'native-document/src/elements'
import { Observable } from 'native-document'

// CDN
// const { Div  } = NativeDocument.elements;
// const { Observable } = NativeDocument;

const user = Observable({ name: 'John', age: 25 });
const greeting = Observable.computed(() => `Hello ${user.$value.name}!`, [user])
// Or const greeting = Observable.computed(() => `Hello ${user.val().name}!`, [user])

document.body.appendChild(Div(greeting));

// user.name = 'Fausty'; // will not work
// user.$value = { ...user.$value, name: ' Hermes!' }; // will work
// user.set(data => ({ ...data, name: 'Hermes!' })); // will work
user.set({ ...user.val(), name: 'Hermes!' });
```

### Elements
Familiar HTML element creation with reactive bindings:
```javascript
import { Div, Button } from 'native-document/src/elements'
import { Observable } from 'native-document'

// CDN
// const { Div, Button  } = NativeDocument.elements;
// const { Observable } = NativeDocument;

const App  = function() {
    const isVisible = Observable(true)
    
    return Div([
        Div({
            class: { 'hidden': isVisible.check(v => !v) },
            style: { opacity: isVisible.check(v => v ? 1 : 0.2) }
        }, 'Content'),
        Button('Toggle').nd.on.click(() => isVisible.set(v => !v)),
    ]);
};

document.body.appendChild(App());
```

### Conditional Rendering
Built-in components for dynamic content:
```javascript
ShowIf(user.check(u => u.isLoggedIn), 
  Div('Welcome back!')
)

Match(theme, {
  'dark': Div({ class: 'dark-mode' }),
  'light': Div({ class: 'light-mode' })
})

Switch(condition, onTrue, onFalse)

When(condition)
    .show(onTrue)
    .otherwise(onFalse)
```

## Documentation

- **[Getting Started](docs/getting-started.md)** - Installation and first steps
- **[Core Concepts](docs/core-concepts.md)** - Understanding the fundamentals
- **[Observables](docs/observables.md)** - Reactive state management
- **[Elements](docs/elements.md)** - Creating and composing UI
- **[Conditional Rendering](docs/conditional-rendering.md)** - Dynamic content
- **[Routing](docs/routing.md)** - Navigation and URL management
- **[State Management](docs/state-management.md)** - Global state patterns
- **[Lifecycle Events](docs/lifecycle-events.md)** - Lifecycle events
- **[Memory Management](docs/memory-management.md)** - Memory management
- **[Anchor](docs/anchor.md)** - Anchor

## Examples

### Todo App
```bash
# Complete todo application with local storage
git clone https://github.com/afrocodeur/native-document-examples
cd examples/todo-app
```

### SPA Router
```bash
# Single Page Application with routing
cd examples/routing-spa
```

### Reusable Components
```bash
# Component library patterns
cd examples/components
```

## Key Features Deep Dive

### Performance Optimized
- Direct DOM manipulation (no virtual DOM overhead)
- Automatic batching of updates
- Lazy evaluation of computed values
- Efficient list rendering with keyed updates

### Developer Experience
```javascript
// Built-in debugging
Observable.debug.enable()

// Argument validation
const createUser = (function (name, age) {
  // Auto-validates argument types
}).args(ArgTypes.string('name'), ArgTypes.number('age'))

// Error boundaries
const AppWithBoundayError = App.errorBoundary(() => {
    return Div('Error in the Create User component');
})

document.body.appendChild(AppWithBoundayError());
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](docs/contributing.md) for details.

### Development Setup
```bash
git clone https://github.com/afrocodeur/native-document
cd native-document
npm install
npm run dev
```

## License

MIT © [AfroCodeur](https://github.com/afrocodeur)

## Acknowledgments

Thanks to all contributors and the JavaScript community for inspiration.

---

**Ready to build with native simplicity?** [Get Started →](docs/getting-started.md)