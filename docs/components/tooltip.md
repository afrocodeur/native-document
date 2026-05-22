---
title: Tooltip
description: Tooltip component with automatic trigger binding, positioning, and interactive mode
---

# Tooltip

```javascript
import { Tooltip } from 'native-document/components';

Tooltip(content, props?)
```

When `Tooltip.use()` is called, it automatically adds a `.nd.tooltip()` method to all NDElements and BaseComponents.

## Default Renderer

```javascript
import { TooltipRender } from 'native-document/ui';

Tooltip.use(TooltipRender);
```

## `$description`

```javascript
{
    trigger:          null,
    interaction:      'hover',          // 'hover' | 'click' | 'focus'
    content:          null,
    title:            null,
    position:         'top',
    isOpen:           Observable(false),
    offset:           8,
    hideDelay:        0,
    arrow:            true,
    interactive:      true,
    updatePositionOn: null,
    variant:          null,
    props:            {}
}
```

## Methods

| Method | Parameters | Description |
|---|---|---|
| `.content(element)` | `element: NdChild` | Tooltip body content |
| `.title(text)` | `text: string` | Tooltip title |
| `.trigger(element)` | `element: HTMLElement` | Element that opens the tooltip |
| `.onHovered()` | - | Open on hover (default) |
| `.onClicked()` | - | Open on click |
| `.onFocused()` | - | Open on focus |
| `.atTop()` | - | Position above trigger |
| `.atBottom()` | - | Position below trigger |
| `.atLeft()` | - | Position left of trigger |
| `.atRight()` | - | Position right of trigger |
| `.arrow(enabled?)` | `enabled?: boolean` | Show/hide the arrow. Default: `true` |
| `.offset(px)` | `px: number` | Distance from the trigger in px |
| `.hideDelay(ms)` | `ms: number` | Delay before hiding on hover leave |
| `.interactive(enabled)` | `enabled: boolean` | Keep open when hovering the tooltip itself |
| `.updatePositionOn(observable)` | `observable: Observable` | Recalculate position when the observable changes |
| `.open()` | - | Open programmatically |
| `.close()` | - | Close programmatically |
| `.toggle()` | - | Toggle open/close |

## Via `.nd.tooltip()`

Once registered, any element gains `.nd.tooltip()`:

```javascript
// Simple string
Button('Delete')
    .danger()
    .nd.tooltip('Permanently delete this item')

// Tooltip instance for full control
const hint = Tooltip(
    VStack([
        Strong('Keyboard shortcut'),
        Span('Cmd S')
    ]).spacing(4)
)
.atBottom()
.arrow()

Button('Save')
    .primary()
    .nd.tooltip(hint)
```

## Presets

```javascript
Tooltip.preset('shortcut', (content, props) => {
    return Tooltip(content, props)
        .atBottom()
        .hideDelay(100);
});

Button('Save').nd.tooltip(Tooltip.shortcut('Cmd S'))
Button('Open').nd.tooltip(Tooltip.shortcut('Cmd O'))
```

## `updatePositionOn`

Pass an observable to trigger a position recalculation when its value changes - useful when the trigger element moves or resizes dynamically:

```javascript
const isExpanded = Observable(false);

Tooltip('More info')
    .trigger(myButton)
    .updatePositionOn(isExpanded)
```

---

## Tooltip vs Popover

| | Tooltip | Popover |
|---|---|---|
| **Purpose** | Short contextual hint | Rich floating panel |
| **Content** | Text or simple element | Header, body, footer |
| **Triggered by** | Hover (default) | Click (default) |
| **Focus trap** | No | Optional |
| **Use when** | Labeling an icon, short help text | User profile card, settings panel |

See **[Popover](./popover.md)** for the richer alternative.


---

## Theming

```css
:root {
    --tooltip-bg:               #1a1a2e;
    --tooltip-color:            var(--white);
    --tooltip-border:           transparent;
    --tooltip-radius:           var(--radius-button);
    --tooltip-shadow:           var(--shadow-lg);
    --tooltip-padding:          var(--space-cozy) var(--space-cozy-comfortable);
    --tooltip-min-width:        0;
    --tooltip-max-width:        280px;
    --tooltip-z-index:          100001;
    --tooltip-font-size:        var(--note-size);
    --tooltip-arrow-size:       6px;
    --tooltip-animation-duration: 0.12s;
}
```