# Advanced Components

NativeDocument provides advanced component patterns for optimizing rendering performance through template cloning and data binding. The `useCache()` utility creates reusable component templates with a sophisticated binding system that efficiently updates only the dynamic parts.

## Overview

Advanced component utilities include:
- **`useCache(fn)`** - Create cached components with data binding
- **`useSingleton(fn)`** - Create singleton views with updateable sections
- **Binder API** - Powerful data binding system for templates

## Import
```javascript
import { useCache, useSingleton } from 'native-document';
```

## useCache() - Cached Components with Binding

`useCache()` creates a component template that is built once and then cloned efficiently. The component function receives a **binder** object (`$binder`) that creates bindings for dynamic data.

### Basic Concept
```javascript
import { useCache } from 'native-document';
import { Div, Span } from 'native-document/src/elements';

// Component function receives $binder
const UserCard = useCache(($binder) => {
    // Create bindings for dynamic data
    const name = $binder.value('name');
    const age = $binder.value('age');

    // Build template with bindings
    return Div({ class: 'user-card' }, [
        Span('Name: '),
        Span(name),
        Span(' - Age: '),
        Span(age)
    ]);
});

// Usage - pass data object
const card1 = UserCard({ name: 'Alice', age: 25 });
const card2 = UserCard({ name: 'Bob', age: 30 });
// card2 is cloned from template, bindings update automatically
```

### How Arguments Are Passed

Binder functions receive arguments exactly as the user passes them:
```javascript
import { useCache } from 'native-document';
import { Div } from 'native-document/src/elements';

const Component = useCache(($binder) => {
    // Function receives arguments exactly as passed
    const value = $binder.value((data) => {
        // data = { name: 'Alice', age: 25 }
        return data.name;
    });
    
    return Div(value);
});

// Usage - object passed directly
const instance = Component({ name: 'Alice', age: 25 });
```

## Binder Methods

### $binder.value() - Property Binding

Bind to a property name or use a transform function:
```javascript
import { useCache } from 'native-document';
import { Div, Span } from 'native-document/src/elements';

const ProductCard = useCache(($binder) => {
    // Bind to property by key name
    const name = $binder.value('name');
    const price = $binder.value('price');
    
    // Bind with transform function
    // Function receives the data object directly
    const formattedPrice = $binder.value((product) => {
        return `$${product.price.toFixed(2)}`;
    });
    
    const status = $binder.value((product) => {
        return product.stock > 0 ? 'In Stock' : 'Out of Stock';
    });
    
    return Div({ class: 'product-card' }, [
        Span({ class: 'name' }, name),
        Span({ class: 'price' }, formattedPrice),
        Span({ class: 'status' }, status)
    ]);
});

// Usage
const card = ProductCard({ name: 'Phone', price: 599, stock: 10 });
// Displays: Phone, $599.00, In Stock
```

### $binder.property() - Alias for value()
```javascript
import { useCache } from 'native-document';

const Component = useCache(($binder) => {
    // property() is an alias for value()
    const name = $binder.property('name');
    const title = $binder.value('title');
    
    // Both work the same way
    return Div([Span(name), Span(title)]);
});
```

### $binder.class() - Class Binding

Bind CSS classes dynamically based on data:
```javascript
import { useCache } from 'native-document';
import { Div, Span } from 'native-document/src/elements';

const TaskItem = useCache(($binder) => {
    const text = $binder.value('text');
    
    // Function receives the data object directly
    const completedClass = $binder.class((task) => {
        return task.completed;
    });
    
    const priorityClass = $binder.class((task) => {
        return task.priority === 'high';
    });
    
    return Div({ 
        class: { 
            'task': true,
            'completed': completedClass,
            'high-priority': priorityClass 
        } 
    }, [
        Span(text)
    ]);
});

// Usage
const task = TaskItem({ text: 'Fix bug', completed: true, priority: 'high' });
// <div class="task completed high-priority">...</div>
```

### $binder.class() with Observable.when()
```javascript
import { useCache } from 'native-document';
import { Tr, Td } from 'native-document/src/elements';
import { Observable } from 'native-document';

const selectedId = Observable(null);

const TableRow = useCache(($binder) => {
    const id = $binder.value('id');
    const name = $binder.value('name');
    
    // Bind class to observable condition
    const isSelected = $binder.class((item) => {
        return selectedId.when(item.id);
    });
    
    return Tr({ 
        class: { 'selected': isSelected } 
    }, [
        Td(id),
        Td(name)
    ]);
});

// Usage
const row1 = TableRow({ id: 1, name: 'Item 1' });
const row2 = TableRow({ id: 2, name: 'Item 2' });

// Change selection - classes update automatically
selectedId.set(1); // row1 gets 'selected' class
selectedId.set(2); // row2 gets 'selected' class, row1 loses it
```

### $binder.style() - Style Binding

Bind inline styles dynamically:
```javascript
import { useCache } from 'native-document';
import { Div } from 'native-document/src/elements';

const ProgressBar = useCache(($binder) => {
    const percentage = $binder.value('percentage');
    
    // Function receives the data object directly
    const widthStyle = $binder.style((progress) => {
        return progress.percentage + '%';
    });
    
    const colorStyle = $binder.style((progress) => {
        return progress.percentage >= 100 ? 'green' : 'blue';
    });
    
    return Div({ class: 'progress-bar' }, [
        Div({ 
            class: 'progress-fill',
            style: {
                width: widthStyle,
                backgroundColor: colorStyle
            }
        })
    ]);
});

// Usage
const bar = ProgressBar({ percentage: 75 });
// <div style="width: 75%; background-color: blue"></div>
```

### $binder.attr() - Attribute Binding

Bind element attributes dynamically. Takes only a function that returns the attribute value:
```javascript
import { useCache } from 'native-document';
import { Div, Img, A } from 'native-document/src/elements';

const ProductCard = useCache(($binder) => {
    const name = $binder.value('name');
    
    // attr() takes ONLY a function
    // Function receives the data object directly
    const imageSrc = $binder.attr((product) => {
        return product.imageUrl;
    });
    
    const detailsHref = $binder.attr((product) => {
        return `/products/${product.id}`;
    });
    
    // Use as object property with attribute name
    return Div({ class: 'product' }, [
        Img({ src: imageSrc }),
        A({ href: detailsHref }, name)
    ]);
});

// Usage
const card = ProductCard({ 
    id: 123, 
    name: 'Phone', 
    imageUrl: '/images/phone.jpg' 
});
// <img src="/images/phone.jpg">
// <a href="/products/123">Phone</a>
```

### $binder.attach() - Event Handler Binding

Attach event handlers that receive the event followed by user arguments:
```javascript
import { useCache } from 'native-document';
import { Div, Button, Span } from 'native-document/src/elements';

const TodoItem = useCache(($binder) => {
    const text = $binder.value('text');
    
    // Handler receives (event, ...userArguments)
    const handleToggle = $binder.attach((event, todo) => {
        console.log('Toggle clicked:', event);
        console.log('Todo data:', todo);
        updateTodo(todo.id, { completed: !todo.completed });
    });
    
    const handleDelete = $binder.attach((event, todo) => {
        console.log('Delete clicked:', event);
        deleteTodo(todo.id);
    });
    
    return Div({ class: 'todo' }, [
        Span(text).nd.attach('onClick', handleToggle),
        Button('Delete').nd.attach('onClick', handleDelete)
    ]);
});

// Usage
const todo = TodoItem({ id: 1, text: 'Buy milk', completed: false });
// Clicking triggers handlers with the todo object
```

### Using .nd.attach()

The `.nd.attach(eventName, handler)` method connects binder handlers to elements:
```javascript
import { useCache } from 'native-document';
import { Button } from 'native-document/src/elements';

const ActionButton = useCache(($binder) => {
    const label = $binder.value('label');
    
    // Handler receives event + user data
    const clickHandler = $binder.attach((event, data) => {
        console.log('Action:', data.action);
        console.log('Event:', event);
        performAction(data.action);
    });
    
    // Use .nd.attach(eventName, handler)
    return Button(label).nd.attach('onClick', clickHandler);
});

// Usage
const btn = ActionButton({ label: 'Save', action: 'save' });
// Clicking logs: "Action: save"
```

## Complete Example

Complete table row component from the codebase:
```javascript
import { useCache } from 'native-document';
import { Tr, Td, Link, Button } from 'native-document/src/elements';
import { Observable, ForEachArray, TBody } from 'native-document';

// App state
const AppService = {
    data: Observable.array([
        { id: 1, label: 'Item 1' },
        { id: 2, label: 'Item 2' },
        { id: 3, label: 'Item 3' }
    ]),
    selected: Observable(null),
    
    select(id) {
        this.selected.set(id);
    },
    
    remove(id) {
        const index = this.data.val().findIndex(item => item.id === id);
        if (index > -1) {
            this.data.remove(index);
        }
    }
};

// Cached table row with bindings
const TableRowBuilder = useCache(($binder) => {
    // Class binding with Observable.when()
    const isSelected = $binder.class((item) => {
        return AppService.selected.when(item.id);
    });
    
    // Value bindings
    const id = $binder.value('id');
    const label = $binder.value('label');
    
    // Event handler bindings - receive (event, item)
    const rowClick = $binder.attach((event, item) => {
        AppService.select(item.id);
    });
    
    const removeClick = $binder.attach((event, item) => {
        AppService.remove(item.id);
    });
    
    return Tr({ class: { 'selected': isSelected } }, [
        Td({ class: 'col-md-1' }, id),
        Td({ class: 'col-md-4' }, 
            Link(label).nd.attach('onClick', rowClick)
        ),
        Td({ class: 'col-md-1' },
            Button('×').nd.attach('onClick', removeClick)
        ),
        Td({ class: 'col-md-6' })
    ]);
});

// Usage with ForEachArray
const TableBody = TBody(
    ForEachArray(AppService.data, TableRowBuilder)
);
```

## Complex Binding Examples

### Multiple Bindings
```javascript
import { useCache } from 'native-document';
import { Div, H3, Span, Img } from 'native-document/src/elements';

const UserProfile = useCache(($binder) => {
    // Simple value bindings
    const email = $binder.value('email');
    
    // Computed value bindings - function receives user object directly
    const fullName = $binder.value((user) => {
        return `${user.firstName} ${user.lastName}`;
    });
    
    const memberSince = $binder.value((user) => {
        const date = new Date(user.joinedAt);
        return date.toLocaleDateString();
    });
    
    // Attribute binding - function receives user object directly
    const avatarSrc = $binder.attr((user) => {
        return user.avatarUrl;
    });
    
    // Class binding - function receives user object directly
    const isPremium = $binder.class((user) => {
        return user.plan === 'premium';
    });
    
    return Div({ 
        class: { 
            'user-profile': true,
            'premium': isPremium 
        } 
    }, [
        Img({ src: avatarSrc, class: 'avatar' }),
        H3(fullName),
        Span({ class: 'email' }, email),
        Span({ class: 'member-since' }, ['Member since: ', memberSince])
    ]);
});

// Usage
const profile = UserProfile({
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@example.com',
    avatarUrl: '/avatars/alice.jpg',
    plan: 'premium',
    joinedAt: '2023-01-15'
});
```

### Style Bindings
```javascript
import { useCache } from 'native-document';
import { Div } from 'native-document/src/elements';

const ColoredBox = useCache(($binder) => {
    const text = $binder.value('text');
    
    // Multiple style bindings - each receives box object
    const bgColor = $binder.style((box) => {
        return box.color;
    });
    
    const boxWidth = $binder.style((box) => {
        return box.width + 'px';
    });
    
    const boxHeight = $binder.style((box) => {
        return box.height + 'px';
    });
    
    return Div({ 
        style: {
            backgroundColor: bgColor,
            width: boxWidth,
            height: boxHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    }, text);
});

// Usage
const box = ColoredBox({ 
    text: 'Hello', 
    color: '#3498db', 
    width: 200, 
    height: 100 
});
```

### Conditional Content
```javascript
import { useCache } from 'native-document';
import { Div, Span, Badge } from 'native-document/src/elements';

const ProductCard = useCache(($binder) => {
    const name = $binder.value('name');
    
    // Computed price - receives product object
    const displayPrice = $binder.value((product) => {
        return product.salePrice 
            ? `$${product.salePrice} (was $${product.price})`
            : `$${product.price}`;
    });
    
    // Conditional classes - receive product object
    const isOnSale = $binder.class((product) => {
        return product.salePrice !== null;
    });
    
    const isOutOfStock = $binder.class((product) => {
        return product.stock === 0;
    });
    
    // Stock badge text - receives product object
    const stockBadge = $binder.value((product) => {
        if (product.stock === 0) return 'Out of Stock';
        if (product.stock < 5) return 'Low Stock';
        return 'In Stock';
    });
    
    return Div({ 
        class: { 
            'product': true,
            'on-sale': isOnSale,
            'out-of-stock': isOutOfStock 
        } 
    }, [
        Span({ class: 'name' }, name),
        Span({ class: 'price' }, displayPrice),
        Badge(stockBadge)
    ]);
});

// Usage
const product = ProductCard({ 
    name: 'Phone', 
    price: 599, 
    salePrice: 499, 
    stock: 3 
});
```

### Multiple Arguments
```javascript
import { useCache } from 'native-document';
import { Div, H3, P } from 'native-document/src/elements';

// Component that accepts multiple arguments
const ArticleCard = useCache(($binder) => {
    // When using multiple args, functions receive them all
    const title = $binder.value((article, options) => {
        return options.uppercase ? article.title.toUpperCase() : article.title;
    });
    
    const excerpt = $binder.value((article, options) => {
        const length = options.excerptLength || 100;
        return article.content.substring(0, length) + '...';
    });
    
    return Div({ class: 'article' }, [
        H3(title),
        P(excerpt)
    ]);
});

// Usage with multiple arguments
const card = ArticleCard(
    { title: 'My Article', content: 'Long article content...' },
    { uppercase: true, excerptLength: 150 }
);
```

## useSingleton() - Singleton Views

`useSingleton()` creates a view that is rendered only once, then updated through named sections.

### Basic Usage
```javascript
import { useSingleton } from 'native-document';
import { Div, H1 } from 'native-document/src/elements';

const Dashboard = useSingleton((view) => {
    return Div({ class: 'dashboard' }, [
        H1('Dashboard'),
        
        // Named section - can be updated later
        view.createSection('content'),
        
        Div({ class: 'footer' }, 'Footer')
    ]);
});

// First render - creates the view
const dashboard = Dashboard.render();
document.body.appendChild(dashboard);

// Update specific section
Dashboard.render([
    Div(['Updated content at ', new Date().toLocaleTimeString()])
]);
```

### createSection(name, transformFn?)

Creates a named section that can be updated. Optional transform function wraps the content:
```javascript
import { useSingleton } from 'native-document';
import { Div, Section, Header, Main } from 'native-document/src/elements';

const Layout = useSingleton((view) => {
    return Div([
        Header([
            // Section without wrapper
            view.createSection('header')
        ]),
        Main([
            // Section with wrapper function
            view.createSection('main', (content) => {
                return Section({ class: 'main-section' }, content);
            })
        ])
    ]);
});

// Render layout
const layout = Layout.render();
document.body.appendChild(layout);

// Update header - content inserted directly
Layout.render([H1('My App')]);

// Update main - content wrapped in Section
Layout.render([P('Main content')]);
// Result: <section class="main-section"><p>Main content</p></section>
```

### Multiple Sections
```javascript
import { useSingleton } from 'native-document';
import { Div, Header, Main, Aside, H1, P, Ul, Li } from 'native-document/src/elements';

const AppLayout = useSingleton((view) => {
    return Div({ class: 'app' }, [
        Header([
            view.createSection('header')
        ]),
        Div({ class: 'container' }, [
            Main([
                view.createSection('main')
            ]),
            Aside([
                view.createSection('sidebar')
            ])
        ])
    ]);
});

// Render initial layout
const app = AppLayout.render();
document.body.appendChild(app);

// Update sections sequentially
Dashboard.render([H1('My App')]);           // Updates header
Dashboard.render([P('Main content')]);      // Updates main
Dashboard.render([Ul([Li('Item 1')])]);     // Updates sidebar
```

## Best Practices

### 1. Use Descriptive Binding Names
```javascript
import { useCache } from 'native-document';

// ✅ Good: Clear variable names
const UserCard = useCache(($binder) => {
    const userName = $binder.value('name');
    const userEmail = $binder.value('email');
    const isPremiumUser = $binder.class((user) => user.premium);
    
    return Div({ class: { 'premium': isPremiumUser } }, [
        Span(userName),
        Span(userEmail)
    ]);
});

// ❌ Bad: Generic names
const UserCard = useCache(($binder) => {
    const v1 = $binder.value('name');
    const v2 = $binder.value('email');
    const c1 = $binder.class((user) => user.premium);
});
```

### 2. Remember Arguments Are Passed Directly
```javascript
import { useCache } from 'native-document';

// ✅ Good: Direct access to data
const Card = useCache(($binder) => {
    const value = $binder.value((item) => {
        return item.property; // item is the object passed
    });
});

// Component call
Card({ property: 'value' });
```

### 3. Use .nd.attach() for Event Handlers
```javascript
import { useCache } from 'native-document';
import { Button } from 'native-document/src/elements';

// ✅ Good: Use binder.attach with .nd.attach()
const ActionButton = useCache(($binder) => {
    const label = $binder.value('label');
    
    // Handler receives (event, data)
    const handleClick = $binder.attach((event, data) => {
        console.log('Clicked:', data);
    });
    
    return Button(label).nd.attach('onClick', handleClick);
});

// ❌ Bad: Direct event handler (won't receive data)
const ActionButton = useCache(($binder) => {
    const label = $binder.value('label');
    
    return Button(label).nd.onClick((event) => {
        // No access to data here
    });
});
```

### 4. Combine with Observable.when()
```javascript
import { useCache } from 'native-document';
import { Observable } from 'native-document';
import { Li } from 'native-document/src/elements';

const activeId = Observable(null);

// ✅ Good: Use Observable.when() for reactive class binding
const ListItem = useCache(($binder) => {
    const label = $binder.value('label');
    
    // Class updates automatically when activeId changes
    const isActive = $binder.class((item) => {
        return activeId.when(item.id);
    });
    
    return Li({ class: { 'active': isActive } }, label);
});
```

### 5. Keep Transform Functions Simple
```javascript
import { useCache } from 'native-document';

// ✅ Good: Simple, focused transforms
const Card = useCache(($binder) => {
    const price = $binder.value((product) => {
        return `$${product.price.toFixed(2)}`;
    });
    
    const inStock = $binder.class((product) => {
        return product.stock > 0;
    });
    
    return Div({ class: { 'in-stock': inStock } }, price);
});

// ❌ Bad: Complex logic
const Card = useCache(($binder) => {
    const value = $binder.value((product) => {
        // Multiple API calls
        // Complex calculations
        // Side effects
        return result;
    });
});
```

## Binder API Reference

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `$binder.value(key)` | `key: string` | `TemplateBinding` | Bind to property by name |
| `$binder.value(fn)` | `fn: (...args) => any` | `TemplateBinding` | Bind with transform function |
| `$binder.property(key)` | `key: string` | `TemplateBinding` | Alias for value() |
| `$binder.class(fn)` | `fn: (...args) => boolean` | `TemplateBinding` | Bind CSS class |
| `$binder.style(fn)` | `fn: (...args) => string` | `TemplateBinding` | Bind inline style value |
| `$binder.attr(fn)` | `fn: (...args) => string` | `TemplateBinding` | Bind attribute value |
| `$binder.attach(fn)` | `fn: (event, ...args) => void` | `TemplateBinding` | Bind event handler |

**Note:** All binder methods (except `attach`) receive arguments exactly as passed by the user. The `attach` method receives the DOM event as the first parameter, followed by user arguments.

## Next Steps

Explore related concepts and utilities:

## Next Steps

- **[Getting Started](getting-started.md)** - Installation and first steps
- **[Core Concepts](core-concepts.md)** - Understanding the fundamentals
- **[Observables](observables.md)** - Reactive state management
- **[Elements](elements.md)** - Creating and composing UI
- **[Conditional Rendering](conditional-rendering.md)** - Dynamic content
- **[List Rendering](list-rendering.md)** - (ForEach | ForEachArray) and dynamic lists
- **[Routing](routing.md)** - Navigation and URL management
- **[State Management](state-management.md)** - Global state patterns
- **[NDElement](native-document-element.md)** - Native Document Element
- **[Extending NDElement](extending-native-document-element.md)** - Custom Methods Guide
- **[Args Validation](validation.md)** - Function Argument Validation
- **[Memory Management](memory-management.md)** - Memory management

## Utilities

- **[Cache](docs/utils/cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](docs/utils/native-fetch.md)** - HTTP client with interceptors
- **[Filters](docs/utils/filters.md)** - Data filtering helpers
