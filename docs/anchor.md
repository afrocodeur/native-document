# Anchor

Anchors are a NativeDocument class that enables dynamic DOM manipulation without wrapper elements. They create two invisible comment nodes that act as boundaries, allowing you to insert, remove, and replace content between them.

## What are Anchors?

Anchors are instances of the Anchor class that use two comment nodes as invisible markers:

```javascript
// Create an anchor instance
const anchor = new Anchor("My Content");

// In the DOM, this creates:
// <!-- Anchor Start : My Content -->
// <!-- / Anchor End My Content -->

// Content can be inserted between these markers
anchor.appendChild(Div("Dynamic content"));
// <!-- Anchor Start : My Content -->
// <div>Dynamic content</div>
// <!-- / Anchor End My Content -->
```

## Fragment vs Anchor

**Fragment** is a wrapper around `document.createDocumentFragment()`:

```javascript
// Fragment is standard DOM DocumentFragment
const fragment = Fragment(); // Wraps document.createDocumentFragment()
fragment.appendChild(Div("Standard fragment content"));
```

**Anchor** is a NativeDocument class for dynamic content management:

```javascript
// Anchor is a NativeDocument class
const anchor = new Anchor("Dynamic Area");
anchor.appendChild(Div("Dynamic content")); // Uses comment markers system
```

## Dynamic Content Insertion

### Creating Anchors

```javascript
// Create anchor with custom identifier
const contentAnchor = new Anchor("Content Area");
const listAnchor = new Anchor("Todo List");

// Anchor needs to be added to parent container
const container = Div();
container.appendChild(contentAnchor);
```

### appendChild() - Add Content Between Markers

```javascript
const anchor = new Anchor("Dynamic Section");
const container = Div();
container.appendChild(anchor);

// Add content between the markers
anchor.appendChild(Div("Dynamic content 1"));
anchor.appendChild(Div("Dynamic content 2"));

// DOM structure:
// <div>
//   <!-- Anchor Start : Dynamic Section -->
//   <div>Dynamic content 1</div>
//   <div>Dynamic content 2</div>
//   <!-- / Anchor End Dynamic Section -->
// </div>
```

### remove() - Clear Content Between Markers

```javascript
// Remove all content between markers (markers remain)
anchor.remove(); // Content cleared, anchor can be reused

// Remove markers and all content permanently  
anchor.remove(true); // Destroys the entire anchor system
```

### clear() - Empty Content

```javascript
// Alias for remove() - clears content but keeps anchor
anchor.clear();
```

## Anchor Methods

### insertBefore() - Positioned Insertion

```javascript
const anchor = Fragment();
const element1 = Div("First");
const element2 = Div("Second");

anchor.appendChild(element1);
anchor.insertBefore(element2, element1); // Inserts before element1
// Result: element2, element1
```

### Access Markers

```javascript
const anchor = Fragment();

// Get the start and end comment nodes
const start = anchor.startElement();
const end = anchor.endElement();

console.log(start.textContent); // "Anchor Start : Fragment"
console.log(end.textContent);   // "/ Anchor End Fragment"
```

## Practical Usage with Conditionals

### ShowIf with Anchors

```javascript
const isVisible = Observable(false);

// ShowIf returns an anchor, not a wrapper element
const content = ShowIf(isVisible, () =>
    Div("This content appears/disappears dynamically")
);

// No wrapper div created - content inserted directly between markers
isVisible.set(true);  // Content appears between comment nodes
isVisible.set(false); // Content disappears, markers remain for reuse
```

### ForEach with Anchors

```javascript
const items = Observable.array(["Item 1", "Item 2"]);

// ForEach returns an anchor managing multiple elements
const list = ForEach(items, (item) => 
    Div(item)
);

// Multiple divs managed between the same anchor markers
items.push("Item 3"); // New div inserted at anchor position
items.splice(0, 1);   // First div removed, others shift within markers
```
:m
### Multiple Elements Without Wrapper

```javascript
const anchor = new Anchor("Multi Content");
const container = Div();
container.appendChild(anchor);

// Insert multiple elements without a containing wrapper
anchor.appendChild([
    H1("Title"),
    P("Paragraph"),
    Button("Action")
]);

// DOM: No wrapper element, just the three elements between markers
```

## Why Use Anchors vs Fragment?

**Use Fragment** for standard DOM operations:

```javascript
// Standard DocumentFragment behavior
const fragment = Fragment();
fragment.appendChild(Div("Content"));
// Gets replaced entirely when appended to parent
```

**Use Anchor** for dynamic content management:

```javascript
// Dynamic content area that can be updated multiple times
const anchor = new Anchor("Updates");
anchor.appendChild(Div("Initial content"));
anchor.remove(); // Clear content
anchor.appendChild(Div("New content")); // Add different content - markers remain
```

## Best Practices

1. **Use anchors for custom rendering systems** - Build optimized conditional logic
2. **Anchors are reusable** - Content can be added/removed multiple times
3. **Use remove(true)** only when permanently destroying the anchor
4. **Anchors are invisible** - They don't affect layout or styling
5. **Create your own patterns** - Anchors enable custom rendering solutions that can outperform built-in functions

## Next Steps

- **[Getting Started](docs/getting-started.md)** - Installation and first steps
- **[Core Concepts](docs/core-concepts.md)** - Understanding the fundamentals
- **[Observables](docs/observables.md)** - Reactive state management
- **[Elements](docs/elements.md)** - Creating and composing UI
- **[Conditional Rendering](docs/conditional-rendering.md)** - Dynamic content
- **[Routing](docs/routing.md)** - Navigation and URL management
- **[State Management](docs/state-management.md)** - Global state patterns
- **[Lifecycle Events](docs/lifecycle-events.md)** - Lifecycle events
- **[Memory Management](docs/memory-management.md)** - Memory management