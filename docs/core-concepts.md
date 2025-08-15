# Core Concepts

This guide covers the fundamental concepts and philosophy behind NativeDocument. Understanding these principles will help you build better applications and make the most of the framework's capabilities.

## Philosophy

NativeDocument was designed with several core principles in mind:

### Native-First Approach
Unlike frameworks that abstract away the DOM, NativeDocument embraces it. Every element you create is a real DOM node, and every interaction happens through native browser APIs. This means:

- No virtual DOM overhead
- Direct access to all browser features
- Familiar debugging experience
- Better performance for DOM-heavy applications

### Reactive by Design
Reactivity is built into the core of NativeDocument through observables. When data changes, the UI updates automatically without manual DOM manipulation:

```javascript
const { Div } = NativeDocument.elements;
const { Observable } = NativeDocument;

const message = Observable('Hello World');
const display = Div(message);

// UI updates automatically
message.set('Hello NativeDocument!');
```

### Zero Build Requirement
While you can use build tools, NativeDocument works perfectly without them. Load it from a CDN and start building immediately:

```html
<script src="https://cdn.jsdelivr.net/gh/afrocodeur/native-document@latest/dist/native-document.min.js"></script>
<script>
    // Start building immediately
    const { Div } = NativeDocument.elements;
    // Your app here
</script>
```

## Core Architecture

### Observables - The Reactive Foundation

Observables are the heart of NativeDocument's reactivity system. They wrap values and notify subscribers when changes occur.

#### Basic Observable
```javascript
const count = Observable(0);

// Subscribe to changes
count.subscribe(newValue => {
    console.log('Count changed to:', newValue);
});

// Update the value
count.set(5); // Logs: "Count changed to: 5"
```

#### Observable Objects
```javascript
const user = Observable({ name: 'John', age: 25 });

// Access values
console.log(user.val().name); // "John"
console.log(user.$value.name); // "John" (proxy syntax)

// Update object - replaces entire value
user.set({ ...user.val(), name: 'Jane' });

// This won't trigger reactivity (common mistake)
// user.name = 'Jane'; // Wrong!
```

#### Observable Arrays
```javascript
const todos = Observable.array([]);

// Array methods trigger reactivity
todos.push({ text: 'Learn NativeDocument', done: false });
todos.pop();
todos.sort((a, b) => a.text.localeCompare(b.text));

// Access like normal array
console.log(todos.val().length);
```

#### Computed Observables
```javascript
const firstName = Observable('John');
const lastName = Observable('Doe');

const fullName = Observable.computed(() => {
    return `${firstName.val()} ${lastName.val()}`;
}, [firstName, lastName]);

// Updates automatically when dependencies change
firstName.set('Jane'); // fullName becomes "Jane Doe"
```

### Elements - Building the UI

Elements in NativeDocument are functions that create and return DOM nodes. They follow a consistent pattern:

#### Basic Element Creation
```javascript
const { Div, Button, Input } = NativeDocument.elements;

// Element with no attributes or children
const simpleDiv = Div();

// Element with attributes only
const styledDiv = Div({ class: 'container', id: 'main' });

// Element with children only
const textDiv = Div('Hello World');
const arrayDiv = Div(['Hello ', 'World']);

// Element with both attributes and children
const fullDiv = Div({ class: 'card' }, [
    'Content here'
]);
```

#### Reactive Attributes
```javascript
const isVisible = Observable(true);
const theme = Observable('dark');

const element = Div({
    class: {
        'visible': isVisible,
        'dark-theme': theme.check(t => t === 'dark')
    },
    style: {
        opacity: isVisible.check(v => v ? 1 : 0.5)
    }
});
```

#### Event Handling
```javascript
const counter = Observable(0);

const button = Button('Click me')
    .nd.onClick(() => {
        counter.set(counter.val() + 1);
    });

// Multiple events
const input = Input()
    .nd.onFocus(e => console.log('Focused'))
    .nd.onBlur(e => console.log('Blurred'))
    .nd.onInput(e => console.log('Value:', e.target.value));

//Or
const input = Input()
    .nd.on({
        focus: e => console.log('Focused'),
        blur: e => console.log('Blurred'),
        input: e => console.log('Value:', e.target.value)
    })
```

### Lifecycle and Memory Management

NativeDocument includes automatic memory management to prevent memory leaks.

#### Element Lifecycle
```javascript
const element = Div('Content')
    .nd.mounted(el => {
        console.log('Element added to DOM');
    })
    .nd.unmounted(el => {
        console.log('Element removed from DOM');
    });
```

#### Manual Cleanup
For complex scenarios, you can manage cleanup manually:

```javascript
const observable = Observable(0);

// Manual subscription
const unsubscribe = observable.subscribe(value => {
    console.log('Value:', value);
});

// Clean up when needed
unsubscribe();
```

## Reactivity Model

### Data Flow
NativeDocument follows a unidirectional data flow:

1. **State Change**: An observable value is updated
2. **Notification**: All subscribers are notified
3. **DOM Update**: UI elements update automatically
4. **Event Handling**: User interactions trigger new state changes

```javascript
const items = Observable.array(['Apple', 'Banana']);

const list = ForEach(items, (item) => 
    Div([
        item,
        Button('Remove').nd.onClick(() => {
            // User action → State change → UI update
            const index = items.val().indexOf(item);
            items.splice(index, 1);
        })
    ])
);
```

### Reactive Chains
Observables can depend on other observables, creating reactive chains:

```javascript
const price = Observable(100);
const quantity = Observable(2);
const discount = Observable(0.1);

const subtotal = Observable.computed(() => {
    return price.val() * quantity.val();
}, [price, quantity]);

const total = Observable.computed(() => {
    return subtotal.val() * (1 - discount.val());
}, [subtotal, discount]);

// Changing any value updates the chain
price.set(150); // subtotal and total update automatically
```

## Component Patterns

### Functional Components
Create reusable components as functions:

```javascript
function UserCard(user) {
    return Div({ class: 'user-card' }, [
        Div({ class: 'name' }, user.name),
        Div({ class: 'email' }, user.email),
        Button('Edit').nd.onClick(() => {
            // Handle edit
        })
    ]);
}

// Usage
const user = { name: 'John Doe', email: 'john@example.com' };
const card = UserCard(user);
```

### Stateful Components
Components with internal state:

```javascript
function Counter(initialValue = 0) {
    const count = Observable(initialValue);
    
    return Div({ class: 'counter' }, [
        Div(['Count: ', count]),
        Button('-').nd.onClick(() => count.set(count.val() - 1)),
        Button('+').nd.onClick(() => count.set(count.val() + 1)),
        Button('Reset').nd.onClick(() => count.set(initialValue))
    ]);
}

// Usage
const myCounter = Counter(10);
```

### Higher-Order Components
Components that enhance other components:

```javascript
function withLoading(component, isLoading) {
    return When(isLoading.check(loading => !loading))
        .show(component)
        .otherwise(Div({ class: 'loading' }, 'Loading...'));
    // Or

    // return Switch(isLoading.check(loading => !loading),
    //     component,
    //     Div({ class: 'loading' }, 'Loading...')
    // );
}

// Usage
const isLoading = Observable(true);
const content = Div('Main content');
const wrappedContent = withLoading(content, isLoading);
```

## State Management Patterns

### Local State
For component-specific state, use observables directly:

```javascript
function TodoForm() {
    const text = Observable('');
    const isValid = Observable.computed(() => text.val().trim().length > 0, [text]);
    
    return Div([
        Input({ placeholder: 'Enter todo...', value: text }),
        Button('Add')
            .nd.onClick(() => {
                if (isValid.val()) {
                    // Add todo logic
                    text.set('');
                }
            })
    ]);
}
```

### Shared State
For state shared between components, create a store:

```javascript
// Create a shared store
const TodoStore = {
    todos: Observable.array([]),
    
    addTodo(text) {
        this.todos.push({
            id: Date.now(),
            text: text,
            done: false
        });
    },
    
    removeTodo(id) {
        const index = this.todos.val().findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    }
};

// Use in components
function TodoList() {
    return ForEach(TodoStore.todos, (todo) => 
        Div([
            todo.text,
            Button('Delete').nd.onClick(() => {
                TodoStore.removeTodo(todo.id);
            })
        ])
    );
}
```

### Global State with Store
For complex applications, use the built-in Store:

```javascript
const { Store } = NativeDocument;

// Create global observables
const userStore = Store.create('user', { name: '', isLoggedIn: false });
const themeStore = Store.create('theme', 'light');

// Use in components
function Header() {
    const user = Store.use('user');
    const theme = Store.use('theme');
    
    return Div({ class: `theme-${theme}` }, [
        ShowIf(user.check(u => u.isLoggedIn),
            Div(['Welcome, ', user.$value.name])
        )
    ]);
}
```

## Error Handling

### Graceful Error Handling
Wrap potentially failing operations:

```javascript
function SafeComponent() {
    try {
        return riskyOperation();
    } catch (error) {
        console.error('Component error:', error);
        return Div({ class: 'error' }, 'Something went wrong');
    }
}
```

### Error Boundaries
Use error boundaries for robust applications:

```javascript
function withErrorBoundary(component) {
    return component.errorBoundary((error) => {
        console.error('Error caught:', error);
        return Div({ class: 'error-boundary' }, [
            'An error occurred. Please try again.'
        ]);
    });
}
```

## Performance Considerations

### Efficient Updates
NativeDocument optimizes updates automatically, but you can help:

```javascript
// Good: Batch related updates
function updateUser(newData) {
    user.set({ ...user.val(), ...newData });
}

// Less efficient: Multiple separate updates
function updateUserSeparately(name, email) {
    user.set({ ...user.val(), name });
    user.set({ ...user.val(), email });
}
```

### List Rendering
Use key functions for efficient list updates:

```javascript
ForEach(items, (item) => 
    Div(['Item: ', item.name]),
    // Key function for efficient updates
    (item) => item.id
);
// or 
ForEach(items, (item) => 
    Div(['Item: ', item.name]),
    // Key property for efficient updates
    'id'
);
```

## Best Practices

### 1. Keep Components Small and Focused
```javascript
// Good: Focused component
function UserName(user) {
    return Div({ class: 'user-name' }, user.name);
}

// Less ideal: Component doing too much
function UserEverything(user) {
    // Handles name, email, avatar, settings, etc.
}
```

### 2. Use Computed Values for Derived State
```javascript
// Good: Computed value
const filteredItems = Observable.computed(() => {
    return items.val().filter(item => item.visible);
}, [items]);

// Less efficient: Manual filtering on each render
```

### 3. Separate Concerns
```javascript
// Good: Separate data logic from UI
const UserService = {
    async loadUser(id) {
        // Data loading logic
    }
};

function UserProfile(userId) {
    // UI rendering logic
}
```

### 4. Use Meaningful Names
```javascript
// Good: Clear naming
const isUserLoggedIn = Observable(false);
const currentUserName = Observable('');

// Less clear
const flag = Observable(false);
const data = Observable('');
```

## Next Steps

Now that you understand NativeDocument's core concepts, explore these advanced topics:

- **[Observables](observables.md)** - Reactive state management
- **[Elements](elements.md)** - Creating and composing UI
- **[Conditional Rendering](conditional-rendering.md)** - Dynamic content
- **[List Rendering](list-rendering.md)** - (ForEach | ForEachArray) and dynamic lists
- **[Routing](routing.md)** - Navigation and URL management
- **[State Management](state-management.md)** - Global state patterns
- **[Lifecycle Events](lifecycle-events.md)** - Lifecycle events
- **[Memory Management](memory-management.md)** - Memory management
- **[Anchor](anchor.md)** - Anchor