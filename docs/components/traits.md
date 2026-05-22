---
title: Traits
description: Reusable behavior mixins for NativeDocument components - HasEventEmitter, HasDraggable, HasResizable, HasItems, HasPosition
---

# Traits

Traits are behavior mixins that add capabilities to components. They are applied via `BaseComponent.use()` and follow the same composition pattern as the rest of the framework.

```javascript
import { BaseComponent, HasEventEmitter, HasDraggable, HasResizable } from '@native-document/components';

BaseComponent.use(MyComponent, HasEventEmitter, HasDraggable, HasResizable);
```

> `HasDraggable` and `HasResizable` both **require** `HasEventEmitter` to be applied first.

---

## `HasEventEmitter`

Adds a custom event system to a component. Components use this to communicate state changes to their parent.

### Methods

| Method | Parameters | Description |
|---|---|---|
| `.on(eventName, callback)` | `eventName: string`, `callback: function` | Register a listener. Multiple listeners allowed per event. |
| `.emit(eventName, ...args)` | `eventName: string`, `...args` | Emit an event. Async - all listeners awaited in order. |
| `.trigger(eventName, ...args)` | same as `emit` | Alias for `emit`. |
| `.hasListeners(eventName)` | `eventName: string` | Returns `true` if any listeners are registered. |

### Built-in component events

| Event | When |
|---|---|
| `open` | Component becomes visible |
| `close` | Component is dismissed |
| `change` | Value or selection changes |
| `select` | An item is selected |

### Example

```javascript
import { Modal } from '@native-document/components';

const confirmModal = Modal(Div('Are you sure?'))
    .title('Confirm')
    .on('close', (confirmed) => {
        if (confirmed) deleteItem();
    });

Button('Delete')
    .danger()
    .nd.onClick(() => confirmModal.open())
```

---

## `HasDraggable`

Adds mouse-driven drag behavior to a component. Requires `HasEventEmitter`.

### Methods

| Method | Parameters | Description |
|---|---|---|
| `.makeDraggable(element, grip?)` | `element: HTMLElement`, `grip?: HTMLElement` | Makes the element draggable. Returns a cleanup function. `grip` defaults to `element`. |
| `.move(x, y)` | `x: number`, `y: number` | Programmatically move to an absolute position (px). |

### CSS classes

| Class | When applied |
|---|---|
| `is-draggable` | On the grip element |
| `is-dragging` | While drag is active |

### Events

| Event | Args | When |
|---|---|---|
| `onDragStart` | `(event, initialX, initialY)` | Mouse down on grip |
| `onDrag` | `(event, x, y)` | Mouse move while dragging |
| `onDragEnd` | - | Mouse up |

```javascript
MyModal
    .on('onDragStart', (e, x, y) => console.log('Started at', x, y))
    .on('onDrag',      (e, x, y) => console.log('Moving to', x, y))
    .on('onDragEnd',   ()        => console.log('Done'))
```

---

## `HasResizable`

Adds mouse-driven resize behavior to a component. Requires `HasEventEmitter`.

### Methods

| Method | Parameters | Description |
|---|---|---|
| `.makeResizable(element, options?)` | `element: HTMLElement`, `options?: object` | Makes the element resizable. Returns a cleanup function. |

Options:

| Option | Type | Default | Description |
|---|---|---|---|
| `directions` | `string[]` | `['right', 'bottom', 'bottom-right']` | Which resize handles to show. Available: `right`, `left`, `top`, `bottom`, `top-right`, `top-left`, `bottom-right`, `bottom-left` |
| `size.minWidth` | `number` | `200` | Minimum width in px |
| `size.minHeight` | `number` | `200` | Minimum height in px |
| `size.maxWidth` | `number` | - | Maximum width in px |
| `size.maxHeight` | `number` | - | Maximum height in px |

### CSS classes

| Class | Applied to | When |
|---|---|---|
| `is-resizable` | Parent element | Always (when resizable) |
| `resize-handle is-{direction}` | Handle divs | Always |
| `is-resizing` | `document.body` | While resize is active |

### Events

| Event | Args | When |
|---|---|---|
| `onResizeStart` | `(event, width, height)` | Mouse down on handle |
| `onResize` | `(event, width, height)` | Mouse move while resizing |
| `onResizeEnd` | `(width, height)` | Mouse up |

```javascript
MyPanel
    .on('onResizeStart', (e, w, h) => console.log('Started at', w, h))
    .on('onResize',      (e, w, h) => saveSize(w, h))
    .on('onResizeEnd',   (w, h)    => persist({ width: w, height: h }))
```

---

## `HasItems`

Manages a reactive collection of items. Used internally by `Accordion`, `Menu`, `Tabs`, `Dropdown`.

### Methods

| Method | Parameters | Description |
|---|---|---|
| `.dynamic(observableArray?)` | `observableArray?: ObservableArray` | Binds to an existing array or creates a new `Observable.array()`. |
| `.bind(observableArray?)` | same as `dynamic` | Alias for `dynamic`. |
| `.items(items)` | `items: array` | Replaces all current items. |
| `.clear()` | - | Removes all items. |
| `.removeItem(item)` | `item: *` | Removes a specific item by reference. |

### Example

```javascript
import { BaseComponent, HasEventEmitter, HasItems } from '@native-document/components';
import { Div, Span } from 'native-document/elements';
import { ForEach } from 'native-document/elements';

function TagList(props = {}) {
    if (!(this instanceof TagList)) return new TagList(props);
    BaseComponent.call(this);
    this.$description = { items: [], props };
}

BaseComponent.extends(TagList);
BaseComponent.use(TagList, HasEventEmitter, HasItems);

TagList.use(($d) => {
    return Div({ class: 'tag-list' },
        ForEach($d.items, tag => Span({ class: 'tag' }, tag))
    );
});

TagList()
    .dynamic()
    .items(['JavaScript', 'TypeScript', 'Python'])
```

---

## `HasPosition` / `HasFullPosition`

Position shorthand methods for components that accept a `position` prop (`Tooltip`, `Popover`, `Toast`). Applied internally - you do not need to apply them manually.

### `HasPosition` - 4 directions + center

| Method | Sets `position` to |
|---|---|
| `.atTop()` | `'top'` |
| `.atBottom()` | `'bottom'` |
| `.atLeft()` | `'left'` |
| `.atRight()` | `'right'` |
| `.atCenter()` | `'center'` |

### `HasFullPosition` - all positions

| Method | Sets `position` to |
|---|---|
| `.atTop()` | `'top'` |
| `.atBottom()` | `'bottom'` |
| `.atLeft()` | `'left'` |
| `.atRight()` | `'right'` |
| `.atTopLeading()` | `'top-leading'` |
| `.atTopTrailing()` | `'top-trailing'` |
| `.atTopCenter()` | `'top-center'` |
| `.atBottomLeading()` | `'bottom-leading'` |
| `.atBottomTrailing()` | `'bottom-trailing'` |
| `.atBottomCenter()` | `'bottom-center'` |
| `.atLeadingCenter()` | `'leading-center'` |
| `.atTrailingCenter()` | `'trailing-center'` |

---

## Building Custom Components with Traits

```javascript
import { BaseComponent, HasEventEmitter, HasDraggable } from '@native-document/components';
import { Div, H2 } from 'native-document/elements';

function FloatingPanel(title, content, props = {}) {
    if (!(this instanceof FloatingPanel)) {
        return new FloatingPanel(title, content, props);
    }
    BaseComponent.call(this);
    this.$description = { title, content, props };
}

FloatingPanel.defaultTemplate = null;
FloatingPanel.use = function(template) {
    FloatingPanel.defaultTemplate = template;
};

BaseComponent.extends(FloatingPanel);
BaseComponent.use(FloatingPanel, HasEventEmitter, HasDraggable);

FloatingPanel.use(($d, component) => {
    const header = Div({ class: 'panel-header' }, H2($d.title));
    const body   = Div({ class: 'panel-body' },   $d.content);
    const panel  = Div({ class: 'panel', style: 'position: absolute', ...$d.props }, [header, body]);

    component.postBuild(() => {
        component.makeDraggable(panel, header);
    });

    return panel;
});

FloatingPanel('Settings', Div('Panel content'))
    .on('onDragEnd', () => console.log('Moved'))
    .nd
```

---

## Next Steps

- **[Components Overview](./index.md)** - BaseComponent philosophy
- **[Modal](./modal.md)** - Uses HasEventEmitter, HasDraggable, HasResizable
- **[Getting Started](./getting-started.md)** - Register renderers
