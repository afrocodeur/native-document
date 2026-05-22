---
title: Anchor
description: Anchors enable dynamic DOM manipulation without wrapper elements using invisible comment node boundaries
---

# Anchor

Anchors enable dynamic DOM manipulation without wrapper elements. They use two invisible comment nodes as boundaries, allowing you to insert, remove, and replace content between them while keeping your DOM clean.

All conditional rendering and list rendering utilities in NativeDocument (`ShowIf`, `ForEach`, `Match`, etc.) are built on top of `Anchor`.

## What is an Anchor?

An `Anchor` creates two invisible comment nodes as markers in the DOM:

```javascript
import { Anchor } from 'native-document/elements';

const anchor = Anchor('My Section');

// Once in the DOM, creates:
// <!-- Anchor Start : My Section -->
// <!-- / Anchor End My Section -->

anchor.appendChild(Div('Dynamic content'));
// <!-- Anchor Start : My Section -->
// <div>Dynamic content</div>
// <!-- / Anchor End My Section -->
```

> `NativeDocumentFragment` is a valid alias for `Anchor` - both create the same system.

> Anchors must be appended to a parent element before their methods work. The comment markers only exist once the anchor is in the DOM.

---

## Fragment vs Anchor

**`Fragment`** wraps `document.createDocumentFragment()` - for one-time static content grouping:

```javascript
const fragment = Fragment(
    H1('Static Title'),
    P('Static content')
);
// Replaced entirely when appended to parent
```

**`Anchor`** is for dynamic content that updates over time:

```javascript
const anchor = Anchor('Dynamic Area');
anchor.appendChild(Div('Initial content'));
anchor.replaceContent(Div('Updated content')); // markers stay, content swaps
```

---

## Why Use Anchors?

Without an anchor you need a wrapper element:

```javascript
// Extra div in the DOM
const wrapper = Div({ class: 'wrapper' });
wrapper.appendChild(Div('Content'));
```

With an anchor, no wrapper is needed:

```javascript
const anchor = Anchor('Content');
anchor.appendChild(Div('Content'));
// DOM: just the div between two comment nodes
```

Benefits: no extra DOM nodes, cleaner HTML, no CSS interference from wrapper elements.

---

## API Reference

### `appendChild(child)` / `append(child)`

Inserts content before the end marker. Accepts an element, array, or any valid child:

```javascript
anchor.appendChild(Div('Content'));
anchor.appendChild([H1('Title'), P('Body'), Button('Action')]);
anchor.append(Div('Same as appendChild'));
```

### `insertAtStart(child)`

Inserts content inside the anchor, immediately after the start marker - the opposite of `appendChild` which inserts before the end marker:

```javascript
anchor.insertAtStart(Div('Just before the anchor start'));
// DOM:
// <!-- Anchor Start : My Section -->
// <div>Just before the anchor start</div>  <- inserted here
// ... anchor content ...
// <!-- / Anchor End My Section -->
```

### `replaceContent(child)` / `setContent(child)`

Removes all current content and inserts new content in one operation:

```javascript
anchor.replaceContent(Div('New content'));
anchor.setContent(Div('Same as replaceContent'));
```

Prefer `replaceContent()` over `remove()` + `appendChild()` - it's a single DOM operation.

### `removeChildren()`

Removes all content between the markers. The markers stay in place and the anchor can be reused. Children are **destroyed**:

```javascript
anchor.removeChildren(); // content gone, markers remain
anchor.appendChild(Div('Fresh content')); // reuse the anchor
```

### `remove()`

Moves all content out of the DOM back into the internal fragment - content is **preserved** but detached. The markers stay in place:

```javascript
anchor.remove(); // content detached but kept internally
anchor.appendChild(previousContent); // can be re-attached
```

> **Difference:** `removeChildren()` destroys children. `remove()` moves them back into the fragment, preserving them for potential re-use.

### `removeWithAnchors()` / `delete()`

Destroys the content **and** removes the comment markers from the DOM. The anchor becomes unusable:

```javascript
anchor.removeWithAnchors(); // or anchor.delete()
// anchor is now permanently gone
```

### `getParent()`

Returns the current parent node:

```javascript
const parent = anchor.getParent();
```

### `startElement()` / `endElement()`

Returns the start or end comment node:

```javascript
const start = anchor.startElement();
const end   = anchor.endElement();

console.log(start.textContent); // "Anchor Start : My Section"
console.log(end.textContent);   // "/ Anchor End My Section"
```

---

## Method Aliases

| Primary | Aliases |
|---|---|
| `appendChild(child)` | `append(child)` |
| `replaceContent(child)` | `setContent(child)` |
| `removeWithAnchors()` | `delete()` |

---

## Practical Examples

### Dynamic content updates

```javascript
const anchor = Anchor('Status');
const isLoading = Observable(true);
const data      = Observable(null);

anchor.appendChild(Div('Loading...'));

isLoading.subscribe(loading => {
    if (loading) {
        anchor.replaceContent(Div('Loading...'));
    } else {
        anchor.replaceContent(
            data.val()
                ? Div(['Data: ', data.select(d => d.name)])
                : Div('No data')
        );
    }
});
```

### Custom anchor-based component

```javascript
function ConditionalList(condition, items) {
    const anchor = Anchor('ConditionalList');

    const update = () => {
        if (condition.val() && items.val().length) {
            anchor.replaceContent(
                Ul(items.val().map(item => Li(item)))
            );
        } else {
            anchor.removeChildren();
        }
    };

    condition.subscribe(update);
    items.subscribe(update);
    update();

    return anchor;
}

const condition = Observable(true);
const items     = Observable.array([]);
let id = 0;

document.body.appendChild(Div([
    ConditionalList(condition, items),
    Button('Toggle').nd.onClick(() => condition.toggle()),
    Button('Add').nd.onClick(() => items.push('Item ' + (++id)))
]));
```

### Layout manager

```javascript
function LayoutManager() {
    const header  = Anchor('Header');
    const content = Anchor('Content');
    const footer  = Anchor('Footer');

    return {
        setHeader:  component => header.replaceContent(component),
        setContent: component => content.replaceContent(component),
        setFooter:  component => footer.replaceContent(component),
        render:     () => Div([header, content, footer])
    };
}
```

---

## How Conditional Rendering Uses Anchors

Every conditional and list rendering utility returns an anchor:

```javascript
// ShowIf returns an anchor
const content = ShowIf(isVisible, () => Div('Hello'));
isVisible.toggle(); // anchor replaces content between its markers

// ForEach returns an anchor
const list = ForEach(items, item => Div(item));
items.push('New'); // anchor inserts new div before end marker

// Match returns an anchor
const view = Match(status, {
    loading: Div('Loading...'),
    success: Div('Done!')
});
status.set('success'); // anchor swaps content
```

---

## Best Practices

1. Use descriptive names - they appear in DOM comments and help debugging
2. Prefer `replaceContent()` over `remove()` + `appendChild()` - it's one DOM operation
3. Use `removeChildren()` when you want to clear and reuse the anchor
4. Use `removeWithAnchors()` / `delete()` only when permanently destroying the anchor
5. Anchors must be in the DOM before their methods work - always append to a parent first

---

## Next Steps

- **[Conditional Rendering](./conditional-rendering.md)** - ShowIf, Match, Switch built on Anchor
- **[List Rendering](./list-rendering.md)** - ForEach and ForEachArray built on Anchor
- **[Elements](./elements.md)** - Creating and composing UI
- **[Memory Management](./memory-management.md)** - Cleanup and memory management

## Utilities

- **[Cache](./cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](./native-fetch.md)** - HTTP client with interceptors
- **[Filters](./filters.md)** - Data filtering helpers