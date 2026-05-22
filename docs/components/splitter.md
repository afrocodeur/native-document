---
title: Splitter
description: Resizable split panel layout with horizontal and vertical orientations
---

# Splitter

```javascript
import { Splitter, SplitterPanel, SplitterGutter } from 'native-document/components';
```

## Default Renderer

```javascript
import { SplitterRender, SplitterPanelRender, SplitterGutterRender } from 'native-document/ui';

Splitter.use(SplitterRender);
SplitterPanel.use(SplitterPanelRender);
SplitterGutter.use(SplitterGutterRender);
```

---

## `Splitter`

### Methods

| Method | Parameters | Description |
|---|---|---|
| `.horizontal()` | - | Side-by-side layout (default) |
| `.vertical()` | - | Stacked layout |
| `.gutterSize(px)` | `px: number` | Width of the drag handle in px |
| `.panel(content, options?, props?)` | `content: NdChild`, `options?: object` | Add a panel inline |
| `.panels(panels)` | `panels: SplitterPanel[]` | Add multiple panels at once |
| `.dynamic()` | - | Enable dynamic panel management (add/remove at runtime) |
| `.removePanel(panel)` | `panel: SplitterPanel` | Remove a panel dynamically |
| `.onResize(handler)` | `handler: (sizes) => void` | Fires on every resize |
| `.onPanelAdd(handler)` | `handler: (panel) => void` | Fires when a panel is added dynamically |
| `.onPanelRemove(handler)` | `handler: (panel) => void` | Fires when a panel is removed dynamically |

The inline `options` object for `.panel(content, options)` accepts the same properties as `SplitterPanel` methods: `size`, `minSize`, `maxSize`, `collapsible`.

---

## `SplitterPanel`

| Method | Parameters | Description |
|---|---|---|
| `.content(element)` | `element: NdChild` | Panel content |
| `.size(value)` | `value: string \| number` | Initial size (`'30%'`, `300`) |
| `.minSize(px)` | `px: number` | Minimum size in px |
| `.maxSize(px)` | `px: number` | Maximum size in px |
| `.collapsible(enabled?)` | `enabled?: boolean` | Allow collapsing to 0 |
| `.collapsed(val?)` | `val?: boolean` | Start collapsed |
| `.resizable(enabled?)` | `enabled?: boolean` | Enable/disable resize for this panel |
| `.fixed()` | - | Panel is not resizable and keeps its size |
| `.data(data)` | `data: *` | Attach metadata to the panel |

---

## `SplitterGutter`

The drag handle between panels. No extra methods - its appearance is controlled entirely by the renderer.

---

## Dynamic panels

Use `.dynamic()` to add or remove panels at runtime. Track a panel reference to remove it later:

```javascript
const sidebar = SplitterPanel(SidebarContent)
    .size('25%')
    .minSize(150)
    .collapsible();

const splitter = Splitter()
    .dynamic()
    .panel(sidebar)
    .panel(SplitterPanel(MainContent).size('75%'))
    .onPanelAdd((panel) => console.log('Panel added'))
    .onPanelRemove((panel) => console.log('Panel removed'));

// Remove the sidebar later
Button('Hide sidebar').nd.onClick(() => splitter.removePanel(sidebar))
```

---

## Example

```javascript
Splitter()
    .horizontal()
    .gutterSize(4)
    .panel(
        SplitterPanel(FileExplorer)
            .size('20%')
            .minSize(150)
            .collapsible()
    )
    .panel(
        SplitterPanel(
            Splitter()
                .vertical()
                .panel(CodeEditor, { size: '70%' })
                .panel(Terminal,   { size: '30%', minSize: 100 })
        ).size('80%')
    )
    .onResize((sizes) => savePanelSizes(sizes))
```


---

## Theming

```css
:root {
    --splitter-gutter-size:              1px;
    --splitter-gutter-hit-area:          8px;
    --splitter-gutter-color:             var(--gray-lite-3);
    --splitter-gutter-handle-size:       32px;
    --splitter-gutter-handle-color:      var(--gray-lite-2);
    --splitter-gutter-handle-color-hover: var(--color-primary);
}
```

---

## Next Steps

- **[Layout](./layout.md)** - Stack-based layout components
