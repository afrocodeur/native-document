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
        Button('Increment').nd.onClick(() => count.set(count.val() + 1))
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
    Button('Increment').nd.onClick(() => count.set(count.val() + 1))
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
        Button('Decrease').nd.onClick(() => {
            count.$value--;
        }),

        Button('Reset').nd.onClick(() => {
            count.set(0);
        }),

        Button('Increase').nd.onClick(() => {
            count.$value++;
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
4. **Added Event Handlers**: `.nd.onClick()` attaches click event listeners
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
        Button('Add').nd.onClick(addTodo)
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
                    }).nd.onChange((e) => {
                        const todoList = todos.val();
                        todoList[index.val()].done = e.target.checked;
                        todos.set([...todoList]);
                    }),

                    Div(['Task: ', todo.text]),

                    Button('Delete').nd.onClick(() => {
                        todos.splice(index.val(), 1);
                    })
                ]),
            // Key function for efficient updates
            (item) => item.id
        )
    ]),

    // Filters
    Div({ class: 'filters' }, [
        Button('All').nd.onClick(() => filter.set('all')),
        Button('Active').nd.onClick(() => filter.set('active')),
        Button('Completed').nd.onClick(() => filter.set('completed'))
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
- `.nd.onClick()` - Add click event listener
- `.nd.onChange()` - Add change event listener
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
        }).nd.onChange(onToggle),

        Div(['Task: ', todo.text]),

        Button('Delete').nd.onClick(onDelete)
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

- **[Core Concepts](core-concepts.md)** - Understanding the fundamentals
- **[Observables](observables.md)** - Reactive state management
- **[Elements](elements.md)** - Creating and composing UI
- **[Conditional Rendering](conditional-rendering.md)** - Dynamic content
- **[List Rendering](list-rendering.md)** - (ForEach | ForEachArray) and dynamic lists
- **[Routing](routing.md)** - Navigation and URL management
- **[State Management](state-management.md)** - Global state patterns
- **[Lifecycle Events](lifecycle-events.md)** - Lifecycle events
- **[NDElement](native-document-element.md)** - Native Document Element
- **[Extending NDElement](extending-native-document-element.md)** - Custom Methods Guide
- **[Args Validation](validation.md)** - Function Argument Validation
- **[Memory Management](memory-management.md)** - Memory management
- **[Anchor](anchor.md)** - Anchor

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