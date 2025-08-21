# Anchor

Anchors are a NativeDocument class that enables dynamic DOM manipulation without wrapper elements. They create two invisible comment nodes that act as boundaries, allowing you to insert, remove, and replace content between them.

## What are Anchors?

Anchors are instances of the Anchor class that use two comment nodes as invisible markers:

`NativeDocumentFragment is an Anchor alias`

```javascript
// Create an anchor instance
const anchor = new Anchor("My Content");
// Or using the alias
const anchor = new NativeDocumentFragment("My Content");

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

## Creating and Using Anchors

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

### insertBefore() - Positioned Insertion

```javascript
const anchor = new Anchor("Ordered Content");
const element1 = Div("First");
const element2 = Div("Second");

anchor.appendChild(element1);
anchor.insertBefore(element2, element1); // Inserts before element1
// Result: element2, element1
```

### replaceContent() - Replace All Content

```javascript
const anchor = new Anchor("Replaceable");
anchor.appendChild(Div("Old content"));

// Replace all content between markers with new content
anchor.replaceContent(Div("New content"));
```

## Content Management Methods

### remove() vs removeChildren() vs clear()

```javascript
const anchor = new Anchor("Content Management");

// Remove all content between markers (markers remain)
anchor.remove(); // Content cleared, anchor can be reused
anchor.removeChildren(); // Same as remove() - more explicit name

// Alias for remove() - clears content but keeps anchor
anchor.clear();
```

### removeWithAnchors() - Complete Removal

```javascript
// Remove markers AND all content permanently  
anchor.removeWithAnchors(); // Destroys the entire anchor system
```

## Anchor Access Methods

### Access Markers

```javascript
const anchor = new Anchor("My Anchor");

// Get the start and end comment nodes
const start = anchor.startElement();
const end = anchor.endElement();

console.log(start.textContent); // "Anchor Start : My Anchor"
console.log(end.textContent);   // "/ Anchor End My Anchor"
```

## Practical Usage Examples

### Working with Arrays of Content

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

### Dynamic Content Updates

```javascript
const contentAnchor = new Anchor("Dynamic Updates");
const isLoading = Observable(true);
const data = Observable(null);

// Initial loading state
contentAnchor.appendChild(Div("Loading..."));

// Update content based on state changes
isLoading.subscribe(loading => {
    if (loading) {
        contentAnchor.replaceContent(Div("Loading..."));
    } else if (data.val()) {
        contentAnchor.replaceContent(
            Div(`Data: ${data.val()}`)
        );
    }
});
```

## Built-in Components Using Anchors

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

### Match/Switch Components

```javascript
const currentView = Observable('loading');

// Match returns an anchor managing different content states
const content = Match(currentView, {
    loading: () => Div("Loading..."),
    success: () => Div("Data loaded!"),
    error: () => Div("Error occurred")
});

currentView.set('success'); // Content switches without wrapper changes
```

## When to Use Fragment vs Anchor

### Use Fragment for:
- **One-time content creation** that won't change
- **Standard DOM operations** following web standards
- **Static content grouping** before insertion

```javascript
// Standard DocumentFragment behavior
const fragment = Fragment(
    H1("Static Title"),
    P("Static content")
);
// Gets replaced entirely when appended to parent
```

### Use Anchor for:
- **Dynamic content management** that updates frequently
- **Conditional rendering** systems
- **List management** with add/remove operations
- **Custom rendering patterns**

```javascript
// Dynamic content area that can be updated multiple times
const anchor = new Anchor("Updates");
anchor.appendChild(Div("Initial content"));
anchor.remove(); // Clear content
anchor.appendChild(Div("New content")); // Add different content - markers remain
```

## Performance Considerations

### Memory Management
```javascript
// Anchors are automatically cleaned up when removed from DOM
const anchor = new Anchor("Temporary");

// Manual cleanup if needed
anchor.removeWithAnchors(); // Fully destroys anchor and frees memory
```

### Batch Operations
```javascript
// Efficient: batch multiple updates
const fragment = document.createDocumentFragment();
fragment.appendChild(Div("Item 1"));
fragment.appendChild(Div("Item 2"));
anchor.appendChild(fragment);

// Less efficient: individual appendChild calls
anchor.appendChild(Div("Item 1"));
anchor.appendChild(Div("Item 2"));
```

## Advanced Patterns

### Creating Custom Anchor-Based Components

```javascript

function ConditionalList(condition, items) {
    const anchor = new Anchor("ConditionalList");

    const updateContent = (value) => {
        console.log(value);
        if (value) {
            const listItems = items.val().map(item => Li(item));
            anchor.replaceContent(Ul(listItems));
        } else {
            anchor.remove();
        }
    };

    condition.subscribe(updateContent);
    items.subscribe(updateContent);
    updateContent(condition.val()); // Initial render

    return anchor;
}

// use ConditionalList
const condition = new Observable(true);
let id = 0;
const items = new Observable.array([]);

document.body.appendChild(Div([
    ConditionalList(condition, items),
    Button("Toggle").nd.onClick(() => condition.set(!condition.val())),
    Button("Add").nd.onClick(() => items.push('Item '+(++id))),
]));
```

### Anchor-Based Layout Manager

```javascript
function LayoutManager() {
    const header = new Anchor("Header");
    const content = new Anchor("Content");
    const footer = new Anchor("Footer");
    
    return {
        setHeader: (component) => header.replaceContent(component),
        setContent: (component) => content.replaceContent(component),
        setFooter: (component) => footer.replaceContent(component),
        render: () => Div([header, content, footer])
    };
}
```

## Best Practices

1. **Use descriptive anchor names** for easier debugging
2. **Anchors are reusable** - Content can be added/removed multiple times
3. **Use `removeWithAnchors()` only when permanently destroying** the anchor
4. **Anchors are invisible** - They don't affect layout or styling
5. **Prefer `replaceContent()` over `remove()` + `appendChild()`** for better performance
6. **Create custom patterns** - Anchors enable custom rendering solutions
7. **Consider memory implications** when creating many anchors
8. **Use batch operations** for multiple content updates

## Common Pitfalls

❌ **Don't do this:**
```javascript
// Inefficient - creates unnecessary DOM manipulations
anchor.remove();
anchor.appendChild(content1);
anchor.remove();
anchor.appendChild(content2);
```

✅ **Do this instead:**
```javascript
// Efficient - direct replacement
anchor.replaceContent(content1);
anchor.replaceContent(content2);
```

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