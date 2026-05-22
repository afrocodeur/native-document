---
title: Getting Started
description: Install NativeDocument and build your first application in minutes
---

# Getting Started

Welcome to NativeDocument! This guide will help you set up and create your first application.

## Installation

NativeDocument offers multiple installation methods to fit your workflow.

### Option 1: CLI (Recommended)

The fastest way to start a complete project with Vite, routing, i18n, and a ready-to-use folder structure:

```bash
npm install -g @native-document/cli

nd create MyApp            # default structure
nd create MyApp --feature  # feature-based architecture

cd MyApp
npm install
npm start
```

Verify the CLI is installed correctly:

```bash
nd --help
```

> The CLI source is available at [github.com/afrocodeur/native-document-cli](https://github.com/afrocodeur/native-document-cli).

See the **[CLI guide](./cli.md)** for all available commands.

---

### Option 2: CDN (No build step)

The quickest way to experiment without any tooling:

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

    const count = Observable(0);

    const App = Div({ class: 'app' }, [
        Div(['Count: ', count]),
        Button('Increment').nd.onClick(() => count.$value++)
    ]);

    document.body.appendChild(App);
</script>
</body>
</html>
```

---

### Option 3: NPM/Yarn (existing project)

Install NativeDocument into an existing Vite project:

```bash
npm install native-document
# or
yarn add native-document
```

Then import what you need:

```javascript
import { Div, Button } from 'native-document/elements';
import { Observable } from 'native-document';

const count = Observable(0);

const App = Div({ class: 'app' }, [
    Div(['Count: ', count]),
    Button('Increment').nd.onClick(() => count.$value++)
]);

document.body.appendChild(App);
```

---

## Project Structure

### Default structure

```
src/
├── main.js                        # Entry point
├── index.css                      # Global styles
│
├── core/
│   ├── lang/
│   │   ├── lang.js                # i18n configuration
│   │   └── locales/
│   │       ├── en.json            # English translations
│   │       └── fr.json            # French translations
│   ├── middlewares/               # Route middlewares
│   └── services/                  # Core services (http, i18n...)
│
├── routes/
│   ├── routes.js                  # Route definitions
│   └── layouts/
│       └── DefaultLayout/         # Default layout
│
├── components/                    # Reusable UI components
│
├── pages/
│   ├── home/
│   │   ├── HomePage.js
│   │   └── home.css
│   └── not-found/
│       ├── NotFoundPage.js
│       └── not-found.css
│
└── services/                      # Business logic + observables
```

### Feature-based structure (`--feature`)

When created with `nd create MyApp --feature`, a `src/features/` folder is added. Each feature is self-contained:

```
src/features/auth/
├── components/
├── services/
│   └── AuthService/
│       └── AuthService.js
├── utils/
└── index.js              # Public API - import from here
```

Import from a feature via its public API:

```javascript
import { AuthService } from '@/features/auth';
```

---

## Available Scripts

```bash
npm start          # Start the development server
npm run build      # Build for production
npm run preview    # Preview the production build
npm run lint       # Run ESLint
npm run i18n:scan  # Scan for missing translation keys
```

---

## Your First Application

Let's build a counter to understand NativeDocument basics.

```javascript
import { Div, Button, H1 } from 'native-document/elements';
import { Observable } from 'native-document';

// Reactive state
const count = Observable(0);

// Build the UI
const CounterApp = Div({ class: 'counter-app' }, [
    H1('Counter'),

    Div({ class: 'count-display' }, ['Current count: ', count]),

    Div([
        Button('−').nd.onClick(() => count.$value--),
        Button('Reset').nd.onClick(() => count.set(0)),
        Button('+').nd.onClick(() => count.$value++),
    ])
]);

document.body.appendChild(CounterApp);
```

### What happened

1. `Observable(0)` creates a reactive value starting at `0`
2. `count` is passed directly as a child - the DOM updates automatically when it changes
3. `.nd.onClick()` attaches a native click listener
4. `count.$value++` mutates the value and triggers a DOM update

---

## Todo List Example

A more complete example with list rendering, filtering, and computed values:

```javascript
import { Div, Input, Button, ShowIf, ForEachArray } from 'native-document/elements';
import { Observable } from 'native-document';

const todos = Observable.array([]);
const newTodo = Observable('');
const filter = Observable('all'); // 'all' | 'active' | 'completed'

const filteredTodos = Observable.computed(() => {
    const all = todos.val();
    if (filter.val() === 'active') {
        return all.filter(t => t.done.equals(false));
    }
    if (filter.val() === 'completed') {
        return all.filter(t => t.done.equals(true));
    }
    return [...all];
}, [todos, filter]);

const addTodo = () => {
    if (!newTodo.val().trim()) {
        return;
    }
    const todo = Observable.object({
        id: Date.now(),
        text: newTodo.val().trim(),
        done: false
    });
    
    todos.push(todo);
    newTodo.set('');
};

const TodoApp = Div({ class: 'todo-app' }, [

    Div({ class: 'header' }, [
        Input({ placeholder: 'What needs to be done?', value: newTodo }),
        Button('Add').nd.onClick(addTodo)
    ]),

    ShowIf(todos.isEmpty(),
        Div({ class: 'empty' }, 'No todos yet! Add one above.')
    ),

    ForEachArray(filteredTodos, (todo, index) =>
            Div({ class: 'todo-item' }, [
                Input({ type: 'checkbox', checked: todo.done }),
                Div(todo.text),
                Button('Delete').nd.onClick(() => todos.removeItem(todo))
            ]),
        (item) => item.id
    ),

    Div({ class: 'filters' }, [
        Button('All').nd.onClick(() => filter.set('all')),
        Button('Active').nd.onClick(() => filter.set('active')),
        Button('Completed').nd.onClick(() => filter.set('completed'))
    ])
]);

document.body.appendChild(TodoApp);
```

---

## Browser Support

NativeDocument requires:
- ES6 Modules
- Proxy objects
- `FinalizationRegistry` (for automatic memory management)

| Browser | Minimum version |
|---------|----------------|
| Chrome  | 84+            |
| Firefox | 79+            |
| Safari  | 14.1+          |
| Edge    | 84+            |

---

## Common Issues

### Import errors

```javascript
// ✅ Correct
import { Div, Button } from 'native-document/elements';
import { Observable } from 'native-document';
import { Router, Link } from 'native-document/router';
import { tr } from 'native-document/i18n';

// CDN
const { Div, Button } = NativeDocument.elements;
const { Observable } = NativeDocument;
```

### Observable not updating the DOM

```javascript
// ❌ Wrong - direct assignment on the outer variable
count = 5;

// ✅ Correct
count.set(5);
count.$value = 5;
```

### Memory leaks

NativeDocument handles cleanup automatically. For manual subscriptions, store and call the unsubscribe function:

```javascript
const callback = () => {};
observable.subscribe(callback);

// Later...
observable.unsubscribe(callback)
```

---

## Next Steps

- **[Core Concepts](./core-concepts.md)** - Understanding the fundamentals
- **[Observables](./observables.md)** - Reactive state management
- **[Elements](./elements.md)** - Creating and composing UI
- **[Routing](./routing.md)** - Navigation and URL management
- **[State Management](./state-management.md)** - Global state patterns
- **[CLI](./cli.md)** - All scaffolding commands
- **[i18n & Formatting](./i18n.md)** - Translations and locale-aware formatting