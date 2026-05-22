---
title: List
description: Flexible list component with single/multi selection, checkbox or click-to-select modes, dividers, and keyboard navigation
---

# List

> **Status: coming soon.** The `List` API is fully defined but the default renderer is not yet implemented. You can use `List` today by providing your own renderer via `List.use()`.

```javascript
import { List } from 'native-document/components';

List(props?)
```

## Custom Renderer

Until the default renderer ships, register your own:

```javascript
import { Ul, Li } from 'native-document/elements';

List.use({
    list: ($d, instance) => {
        return Ul({ class: `list ${$d.inset ? 'list-inset' : ''}` });
    }
});
```

> `List.use()` expects an object with a `list` key, not a function directly.

## Methods

### Data

| Method | Parameters | Description |
|---|---|---|
| `.items(items)` | `items: *[]` | Static item list |
| `.dynamic(obs?)` | `obs?: ObservableArray` | Bind to a reactive array |
| `.data(data)` | `data: *` | Data passed to the renderer |

### Selection

| Method | Parameters | Description |
|---|---|---|
| `.selectable(enabled?)` | `enabled?: boolean` | Enable item selection |
| `.multiSelect(enabled?)` | `enabled?: boolean` | Allow multiple selections. Enables `.selectable()` automatically |
| `.selectByClick()` | - | Select items on click (mutually exclusive with `selectByCheckbox`) |
| `.selectByCheckbox()` | - | Select items via a checkbox (mutually exclusive with `selectByClick`) |
| `.selectedValuesModel(obs)` | `obs: Observable<*[]>` | Bind selected values to an external observable |

### Layout

| Method | Parameters | Description |
|---|---|---|
| `.withDivider(enabled?)` | `enabled?: boolean` | Show a divider between items |
| `.inset(enabled?)` | `enabled?: boolean` | Add inset padding |
| `.loopOnKeyboard(enabled)` | `enabled: boolean` | Loop keyboard navigation at list boundaries. Default `true` |

### Events

| Method | Parameters | Description |
|---|---|---|
| `.onItemClick(handler)` | `handler: (item, event) => void` | Fires when an item is clicked |
| `.onItemSelect(handler)` | `handler: (item) => void` | Fires when an item is selected |

---

## Next Steps

- **[Components Overview](./index.md)** - BaseComponent and renderer pattern
- **[Getting Started](./getting-started.md)** - Register default renderers
- **[Traits](./traits.md)** - `HasItems` trait used by this component
