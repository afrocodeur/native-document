# Getting Started

Welcome to NativeDocument! This guide will help you set up and create your first application with NativeDocument.

## Installation

NativeDocument offers multiple installation methods to fit your development workflow.

### Method 1: CDN (Recommended for beginners)

The fastest way to get started is using our CDN. Simply add this script tag to your HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My NativeDocument App</title>
</head>
<body>
<script src="https://cdn.jsdelivr.net/gh/afrocodeur/native-document@latest/dist/native-document.min.js"></script>
<script>
    const { Div, Button } = NativeDocument.elements;
    const { Observable } = NativeDocument;

    // Your code here
    const count = Observable(0);

    const App = Div({ class: 'app' }, [
        Div(['Count: ', count]),
        Button('Increment').nd.on.click(() => count.set(count.val() + 1))
    ]);

    document.body.appendChild(App);
</script>
</body>
</html>
```

### Method 2: Vite Template (Recommended for projects)

For a complete development setup with Vite, use our official template:

```bash
npx degit afrocodeur/native-document-vite my-app
cd my-app
npm install
npm run dev
```

This template includes:
- Pre-configured Vite setup
- Development server with auto reload
- Build optimization
- Example components

### Method 3: NPM/Yarn Package

Install NativeDocument as a dependency in your existing project:

```bash
npm install native-document
# or
yarn add native-document
```

Then import what you need:

```javascript
import { Div, Button } from 'native-document/src/elements'
import { Observable } from 'native-document'

const count = Observable(0);

const App = Div({ class: 'app' }, [
    Div(['Count: ', count]),
    Button('Increment').nd.on.click(() => count.set(count.val() + 1))
]);

document.body.appendChild(App);
```

## Your First Application

Let's build a simple counter application to understand NativeDocument basics.

### Step 1: Create the HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Counter App</title>
    <style>
        .counter-app {
            max-width: 400px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
            font-family: Arial, sans-serif;
        }
        .count-display {
            font-size: 2rem;
            margin: 20px 0;
            color: #333;
        }
        button {
            margin: 0 10px;
            padding: 10px 20px;
            font-size: 1rem;
            cursor: pointer;
        }
    </style>
</head>
<body>
<script src="https://cdn.jsdelivr.net/gh/afrocodeur/native-document@latest/dist/native-document.min.js"></script>
<script>
    // Your JavaScript code will go here
</script>
</body>
</html>
```

### Step 2: Add the JavaScript Logic

```javascript
const { Div, Button, H1 } = NativeDocument.elements;
const { Observable } = NativeDocument;

// Create reactive state
const count = Observable(0);

// Create the application
const CounterApp = Div({ class: 'counter-app' }, [
    H1('Counter Application'),

    Div({ class: 'count-display' }, [
        'Current count: ', count
    ]),

    Div([
        Button('Decrease').nd.on.click(() => {
            count.set(count.val() - 1);
        }),

        Button('Reset').nd.on.click(() => {
            count.set(0);
        }),

        Button('Increase').nd.on.click(() => {
            count.set(count.val() + 1);
        })
    ])
]);

// Mount the application
document.body.appendChild(CounterApp);
```

### Step 3: Understanding What Happened

1. **Imported Components**: We used `Div`, `Button`, and `H1` from `NativeDocument.elements`
2. **Created Reactive State**: `Observable(0)` creates a reactive value that starts at 0
3. **Built the UI**: Elements are created with attributes and children
4. **Added Event Handlers**: `.nd.on.click()` attaches click event listeners
5. **Automatic Updates**: When `count` changes, the UI updates automatically

## Todo List Application

Let's build something more complex - a todo list with add, delete, and filter functionality:

```javascript
const { Div, Input, Button, ShowIf, ForEach } = NativeDocument.elements;
const { Observable } = NativeDocument;

// Reactive state
const todos = Observable.array([]);
const newTodo = Observable('');
const filter = Observable('all'); // 'all', 'active', 'completed'

// Computed values
const filteredTodos = Observable.computed(() => {
    const allTodos = todos.val();
    const currentFilter = filter.val();

    if (currentFilter === 'active') {
        return allTodos.filter(todo => !todo.done);
    }
    if (currentFilter === 'completed') {
        return allTodos.filter(todo => todo.done);
    }

    return [...allTodos];
}, [todos, filter]);

const addTodo = () => {
    if (!newTodo.val().trim()) {
        return;
    }
    todos.push({
        id: Date.now(),
        text: newTodo.val().trim(),
        done: false
    });
    newTodo.set('');
};

// Todo application
const TodoApp = Div({ class: 'todo-app' }, [
    // Header
    Div({ class: 'header' }, [
        Input({
            placeholder: 'What needs to be done?',
            value: newTodo
        }),
        Button('Add').nd.on.click(addTodo)
    ]),

    // Todo list container
    Div({ class: 'todos-list'}, [
        ShowIf(todos.check(list => list.length === 0),
            Div({ class: 'empty' }, 'No todos yet! Add one above.')), // Empty state

        // List of todos
        ForEach(filteredTodos, (todo, index) => // Todo list
                Div({ class: 'todo-item' }, [
                    Input({
                        type: 'checkbox',
                        checked: Observable(todo.done)
                    }).nd.on.change((e) => {
                        const todoList = todos.val();
                        todoList[index.val()].done = e.target.checked;
                        todos.set([...todoList]);
                    }),

                    Div(['Task: ', todo.text]),

                    Button('Delete').nd.on.click(() => {
                        todos.splice(index.val(), 1);
                    })
                ]),
            // Key function for efficient updates
            (item) => item.id
        )
    ]),

    // Filters
    Div({ class: 'filters' }, [
        Button('All').nd.on.click(() => filter.set('all')),
        Button('Active').nd.on.click(() => filter.set('active')),
        Button('Completed').nd.on.click(() => filter.set('completed'))
    ])

]);

document.body.appendChild(TodoApp);
```

## Key Concepts Demonstrated

### Observables
- `Observable(value)` - Creates reactive primitive values
- `Observable.array([])` - Creates reactive arrays with array methods
- `Observable.computed(() => {}, [deps])` - Creates computed values

### Elements
- Elements are functions that return DOM nodes
- First parameter is attributes object (optional)
- Second parameter is children array or single child
- Children can be strings, numbers, elements, or observables

### Event Handling
- `.nd.on.click()` - Add click event listener
- `.nd.on.change()` - Add change event listener
- Event handlers receive the native event object

### Conditional Rendering
- `ShowIf(condition, content)` - Show content when condition is true
- `ForEach(array, callback, propertyKey || keyFn)` - Render lists efficiently

## Project Structure

For larger applications, organize your code like this:

```
my-app/
├── index.html
├── src/
│   ├── main.js          # Application entry point
│   ├── components/      # Reusable components
│   │   ├── TodoItem.js
│   │   └── Header.js
│   ├── stores/          # Global state
│   │   └── TodoStore.js
│   └── utils/           # Helper functions
│       └── validators.js
├── styles/
│   └── main.css
└── package.json
```

### Example Component (components/TodoItem.js)

```javascript
import { Div, Input, Button } from 'native-document/src/elements';

export function TodoItem(todo, onToggle, onDelete) {
    return Div({ class: 'todo-item' }, [
        Input({
            type: 'checkbox',
            checked: todo.done
        }).nd.on.change(onToggle),

        Div(['Task: ', todo.text]),

        Button('Delete').nd.on.click(onDelete)
    ]);
}
```

## Development Workflow

### Auto Reload with Vite

When using the Vite template, your development server automatically reloads when you make changes:

```bash
npm run dev  # Start development server
npm run build  # Build for production
npm run preview  # Preview production build
```

## Browser Support

NativeDocument works in all modern browsers that support:
- ES6 Modules
- Proxy objects
- FinalizationRegistry (for automatic memory management)

**Supported browsers:**
- Chrome 84+
- Firefox 79+
- Safari 14.1+
- Edge 84+

## Next Steps

Now that you've built your first NativeDocument applications, explore these topics:

- **[Core Concepts](docs/core-concepts.md)** - Understanding the fundamentals
- **[Observables](docs/observables.md)** - Reactive state management
- **[Elements](docs/elements.md)** - Creating and composing UI
- **[Conditional Rendering](docs/conditional-rendering.md)** - Dynamic content
- **[Routing](docs/routing.md)** - Navigation and URL management
- **[State Management](docs/state-management.md)** - Global state patterns
- **[Lifecycle Events](docs/lifecycle-events.md)** - Lifecycle events
- **[Memory Management](docs/memory-management.md)** - Memory management
- **[Anchor](docs/anchor.md)** - Anchor

## Common Issues

### Import Errors
**Problem**: `Cannot resolve module 'native-document'`

**Solution**: Make sure you're using the correct import path:
```javascript
// Correct
import { Div } from 'native-document/src/elements'
import { Observable } from 'native-document'

// CDN
const { Div } = NativeDocument.elements;
const { Observable } = NativeDocument;
```

### Observable Not Updating
**Problem**: UI doesn't update when you change observable values

**Solution**: Make sure you're using `.set()` method:
```javascript
// Wrong
count = 5;

// Correct  
count.set(5);
// Correct  
count.$value = 5;
```

### Memory Leaks
**Problem**: Application slows down over time

**Solution**: NativeDocument has automatic memory management, but you can help by cleaning up manual subscriptions:
```javascript
const unsubscribe = observable.subscribe(callback);
// Later...
unsubscribe(); // Clean up manually if needed
```

Ready to dive deeper? Continue with [Core Concepts](core-concepts.md)!