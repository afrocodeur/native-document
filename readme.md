# 🚀 NativeDocument

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Size](https://img.shields.io/badge/Size-~15KB-green.svg)](https://github.com/yourusername/nativedocument)

> A lightweight, reactive JavaScript framework for building modern web applications with zero dependencies.

NativeDocument provides a reactive programming model similar to React but using vanilla JavaScript and modern web APIs. It features automatic memory management, a complete set of HTML elements, routing, state management, and real-time DOM updates.

## ✨ Features

- 🔄 **Reactive Observables** - Automatic DOM updates when data changes
- 🧠 **Smart Memory Management** - Automatic cleanup with FinalizationRegistry
- 🎯 **Zero Dependencies** - Pure vanilla JavaScript
- 🛣️ **Built-in Router** - Hash, History, and Memory modes
- 🏪 **Global State Management** - Share state across components
- 📦 **Complete HTML Elements** - All HTML elements with extended functionality
- 🎨 **Conditional Rendering** - ShowIf, ToggleView, ForEach components
- ✅ **Runtime Validation** - Type checking and argument validation


## 🚀 Quick Start

### Installation

```bash
# Download the minified version
curl -o native-document.min.js https://raw.githubusercontent.com/afrocodeur/native-document/refs/heads/main/dist/native-document.min.js

# Or include via CDN
<script src="https://cdn.jsdelivr.net/gh/afrocodeur/native-document@latest/dist/native-document.min.js"></script>
```


### Basic Example

```javascript
const { Observable } = NativeDocument;
const { H1, P, Button } = NativeDocument.elements;
// Create reactive state
const count = Observable(0);
const message = Observable("Hello World!");

// Create reactive UI
const app = Div([
    H1(message),
    P(['Count: ',count]),
    Button("Increment").nd.on.click(() => count.set(count.val() + 1)),
    Button("Reset").nd.on.click(() => count.set(0))
]);

// Mount to DOM
document.body.appendChild(app);
```

## 📚 Core Concepts

### Observables

Observables are the heart of NativeDocument's reactivity system:

```javascript
const { Observable } = NativeDocument;
// Create observable
const name = Observable("John");

// Get value
console.log(name.val()); // "John"

// Subscribe to changes
const unsubscribe = name.subscribe((newValue, oldValue) => {
  console.log(`Changed from ${oldValue} to ${newValue}`);
});

// Set value
name.set("Jane");

// Cleanup
unsubscribe();
```


### 📦 Elements

All HTML elements are available as functions:

```javascript
const { Observable } = NativeDocument;
const { Div, H1, H2, P, Link, Strong, Input, Button, Br } = NativeDocument.elements;
// Basic elements
const header = H1("My App");
const paragraph = P("Welcome to NativeDocument!");

// With attributes
const link = Link({href: "https://example.com", target: "_blank" }, "Click me");

const name = Observable('');

// With reactive attributes
const input = Input({
    type: "text",
    value: name, // Observable binding
    placeholder: "Enter name"
});

// Nested elements
const card = Div({ class: "card" }, [
    H2("Card Title"),
    Strong(name),
    P("Card content here..."),
    Button("Action")
]);

document.body.appendChild(Div([
    input,
    card,
    Br(),
    link
]));
```


### Conditional Rendering

```javascript
const { Observable } = NativeDocument;
const { ShowIf, Switch, When, Div, P, Button, Br, H2 } = NativeDocument.elements;


const isVisible = Observable(true);
const user = Observable({ name: "John", age: 15 });

// Show/hide elements
const conditionalContent = Div([
    ShowIf(isVisible, P("This content is visible!")),
    Button('Toggle').nd.on.click(() => isVisible.set((currentValue) => !currentValue))
]);

const whenContent = Div([
    H2('When'),
    When(user.check(u => u.age >= 18))
        .show(() => P("Adult content"))
        .otherwise(() => P("Minor content")),
]);

// Toggle between two states
const toggleContent = Div([
    H2('Switch'),
    Switch(
        user.check(u => u.age >= 18),
        () => P("Adult content"), // use function to create element only if requested
        () => P("Minor content")
    ),
    Button('Toggle user age').nd.on.click(() => user.set((currentValue) => ({ ...currentValue, age: currentValue.age === 25 ? 15 :25 })))
]);

document.body.appendChild(Div([
    conditionalContent,
    Br(),
    whenContent,
    Br(),
    toggleContent
]));
```

### Lists and Iteration

```javascript
const { Observable } = NativeDocument;
const { ForEach, Div, P, Button, Br, H4 } = NativeDocument.elements;

const items = Observable([
    { id: 1, name: "Apple", price: 1.20 },
    { id: 2, name: "Banana", price: 0.80 },
    { id: 3, name: "Orange", price: 1.50 }
]);

const itemList = ForEach(items, (item, index) =>
    Div({ class: "item" }, [
        H4(item.name),
        P(`$${item.price}`),
        Button("Remove").nd.on.click(() => {
            items.set((currentItems) => currentItems.filter(i => i.id !== item.id))
        })
    ]), 'id');

document.body.appendChild(itemList);
```

### Forms

```javascript

const { EmailInput, Form, Label, Strong, SubmitButton, Input, Div } = NativeDocument.elements;
const { Observable } = NativeDocument;

const formData = Observable.object({ name: "", email: "d.mamadou@miridoo.net" });

const FormItem = (title, input) => {
    return Div([
        Label(Strong(title)),
        Div(input)
    ]);
}

const form = Form([
    FormItem("Name", Input({ value: formData.name })),
    FormItem("Email", Input({ value: formData.email })),
    SubmitButton("Submit")
]).nd.on.prevent.submit((event) => {
    console.log(Observable.value(formData));
});

document.body.appendChild(form);
```
## 🛣️ Routing

NativeDocument includes a powerful routing system:

```javascript

const { Div, Button, Main } = NativeDocument.elements;
const { Router, Link } = NativeDocument.router;

const CustomMiddleware = (request, next) => {
    console.log('check custom middleware', request);
    // request.params.customValue = true;
    return next(request);
};
const AuthMiddleware = (request, next) => {
    console.log('check if user is authenticated');
    return next(request);
};


const DefaultLayout = (children) => {
    return Div([
        Main({ class: 'main-container', style: 'padding: 1rem 0' }, children),
        Div({ class: 'navigation-container'}, Div([
            Link({ to: '/' }, 'Home'), // Link from router
            Link({ to: { name: 'profile' } }, 'Profile'),
            Link({ to: { name: 'user.show', params: {id: 1} } }, 'Show User'),
            Link({ to: { name: 'admin.dashboard' } }, 'Show Admin Dashboard'),
            Link({ to: { name: 'admin.users' } }, 'Show Admin User'),
            Button('Product Page').nd.on.click(() => {
                const router = Router.get();
                // Navigate programmatically
                router.push('/product/123?name=ProductName');
            }),
        ]))
    ]);
};

const HomePage = () => {
    return DefaultLayout(Div('Home page'));
};
const UserPage = ({ params, query  }) => {
    return DefaultLayout(Div('User page for '+params.id));
};
const ProductPage = ({ params, query }) => {
    return DefaultLayout(Div('Product page '+params.id+' with product name '+query.name));
};
const AdminDashboard = () => {
    return DefaultLayout(Div('Admin dashboard'));
};
const AdminUsers = () => {
    return DefaultLayout(Div('Admin users'));
};
const ProfilePage = () => {
    return DefaultLayout(Div('Profile page'));
}


const router = Router.create({ mode: "history" }, (router) => {
    // Basic route
    router.add("/", HomePage, { name: 'home' });

    // Route with parameters
    router.add("/user/{id}", UserPage, { name: "user.show" });

    // Route with constraints
    router.add("/product/{id:number}", ProductPage);

    // Grouped routes with middleware
    router.group("/admin", { middlewares: [AuthMiddleware], name: 'admin' }, () => {
        router.add("/dashboard", AdminDashboard, { name: 'dashboard' }); // name = admin.dashboard
        router.add("/users", AdminUsers, { name: 'users' }); // name = admin.users
    });

    // Named routes
    router.add("/profile", ProfilePage, { name: "profile" });

    router.add(".*",  () => {
        return DefaultLayout(
            Div([
                '404',
                Div('Route not found')
            ])
        );
    })
}).mount(document.body);

```

## 🏪 State Management

### Global Store

```javascript
const { Div, P, Button, ShowIf, When } = NativeDocument.elements;
const { Store, Observable } = NativeDocument;

const $ = Observable.computed;

// Create global store
Store.create("user", {
    name: "Anonymous",
    loginAt: '...',
    isLoggedIn: false
});

const Footer = () => {
    const user = Store.use("user");
    const dynamicLoginAtText = $(() => 'Login at '+user.val().loginAt, [user]);

    return Div({ class: 'footer-container', style: { padding: '1rem 0' }}, [
        ShowIf(user.check(u => u.isLoggedIn), P(dynamicLoginAtText))
    ]);
};

// Use in components
const Header = () => {
    const user = Store.use("user");

    return Div([
        When(user.check(u => u.isLoggedIn))
            .show(() => {
                const dynamicHelloText = $(() => 'Hello '+user.val().name, [user]);

                return Div([
                    P(dynamicHelloText),
                    Button("Logout").nd.on.click(() => {
                        user.set({ name: null, isLoggedIn: false })
                    })
                ]);
            })
            .otherwise(() => {
                return Button('Login').nd.on.click(() => {
                    user.set({ name: "John", loginAt: (new Date()).toLocaleString(), isLoggedIn: true })
                });
            })
    ]);
};

const App = () => {
    return Div([
        Header(),
        Footer()
    ]);
}

document.body.appendChild(App());
```



### Local State

```javascript
const { Div, H2, Button } = NativeDocument.elements;
const { Observable } = NativeDocument;

const Counter = () => {
    const count = Observable(0);

    const Increment = () => count.set(count.val() + 1);
    const Decrement = () => count.set(currentValue => --currentValue)

    return Div({}, [
        H2(['Count: ', count]),
        Button("-").nd.on.click(Decrement),
        Button("+").nd.on.click(Increment),
    ]);
};

document.body.appendChild(Counter());
```


## 🔧 Advanced Features

### Lifecycle Hooks

```javascript
const { Div, Button, ShowIf } = NativeDocument.elements;
const { Observable } = NativeDocument;

const MyComponent = () => {
    const element = Div('Hello my component');

    return element
        .nd.mounted(() => {
            console.log("Component mounted");
        })
        .nd.unmounted(() => {
            console.log("Component unmounted");
        });
};

const App = () => {
    const isActive = Observable(true);

    return Div([
        ShowIf(isActive, () => MyComponent()),
        Button('Toggle').nd.on.click(() => isActive.set(!isActive.val()))
    ]);
}

document.body.appendChild(App());
```


### Custom Validation

```javascript
const { withValidation, ArgTypes } = NativeDocument;

const createUser = (name, age, email) => {
    // Function implementation
    return { name, age, email };
};

const createUserWithArgsValidation = withValidation(createUser, [
    ArgTypes.string("name"),
    ArgTypes.number("age"),
    ArgTypes.string("email")
]);

// Usage
const user = createUserWithArgsValidation("John", 25, "john@example.com");
```

### Custom Validation with Function prototype (args)

```javascript

const { withValidation, ArgTypes, Observable } = NativeDocument;

const createUser = ((name, age, email) => {
    // Function implementation
    console.log(name, age, email);
    return { name, age, email };
}).args(ArgTypes.string('name'), ArgTypes.number('age'), ArgTypes.string('email'));


// Usage
const user = createUser('John', 25, "john@example.com");

```


## 🎨 Styling

NativeDocument works great with CSS:

```javascript
const { Div, H2, Button, ShowIf } = NativeDocument.elements;
const { withValidation, ArgTypes, Observable } = NativeDocument;

const StyledComponent = () => {
    const isActive = Observable(false);

    return Div({
        class: {
            "component": true,
            "active": isActive,
            "inactive": isActive.check(active => !active)
        },
        style: {
            color: isActive.check(active => active ? "white" : "black"),
            backgroundColor: isActive.check(active => active ? "#2980b9" : "#7f8c8d"),
            padding: "20px",
            borderRadius: "4px"
        }
    }, [
        H2("Styled Component"),
        ShowIf(isActive, Div({ style: 'color: white; padding: 1rem 0'}, 'Styled Component is active')),
        Button("Toggle").nd.on.click(() => isActive.set((val) => !val))
    ]);
};

// Usage
document.body.appendChild(StyledComponent());
```