---
title: Popover
description: Floating panel anchored to a trigger element with flexible positioning and interaction modes
---

# Popover

```javascript
import { Popover } from 'native-document/components';

Popover(content, props?)
```

A floating panel anchored to a trigger element. Lighter than Modal - no overlay, positions relative to trigger.

## Default Renderer

```javascript
import { PopoverRender } from 'native-document/ui';

Popover.use(PopoverRender);
```

## `$description`

```javascript
{
    content:             null,
    header:              null,
    footer:              null,
    trigger:             null,
    interaction:         'click',   // 'click' | 'hover' | 'focus'
    position:            'bottom',
    offset:              [0, 8],
    arrow:               false,
    shift:               false,
    closeOnEscape:       true,
    closeOnClickOutside: true,
    focusTrap:           false,
    returnFocus:         true,
    matchTriggerWidth:   null,
    updatePositionOn:    null,
    isOpen:              Observable(false),
    props:               {}
}
```

## Methods

| Method | Parameters | Description |
|---|---|---|
| `.content(element)` | `element: NdChild` | Popover body |
| `.header(element)` | `element: NdChild` | Popover header |
| `.footer(element)` | `element: NdChild` | Popover footer |
| `.trigger(element)` | `element: HTMLElement` | Element that opens the popover |
| `.onClicked()` | - | Open on click (default) |
| `.onHovered()` | - | Open on hover |
| `.onFocused()` | - | Open on focus |
| `.position(pos)` | `pos: string` | Position relative to trigger: `top`, `bottom`, `left`, `right`, `top-start`, `bottom-end`, etc. |
| `.offset([x, y])` | `[x: number, y: number]` | Offset from trigger in px |
| `.arrow()` | - | Show arrow pointing to trigger |
| `.shift()` | - | Keep popover in viewport when near edges |
| `.closeOnEscape(enabled)` | `enabled: boolean` | Default `true` |
| `.closeOnClickOutside(enabled)` | `enabled: boolean` | Default `true` |
| `.focusTrap()` | - | Trap focus inside the popover |
| `.returnFocus(enabled)` | `enabled: boolean` | Return focus to trigger on close. Default `true` |
| `.matchTriggerWidth()` | - | Set popover width to match the trigger width |
| `.updatePositionOn(observable)` | `observable: Observable` | Recalculate position when the observable changes |
| `.open()` | - | Open programmatically |
| `.close()` | - | Close programmatically |
| `.toggle()` | - | Toggle open/close |

## Example

```javascript
Popover(
    VStack([
        Avatar(user.avatar).medium(),
        Div(user.name),
        Div(user.email),
        Divider(),
        Button('View profile')
            .ghost()
            .block()
            .nd.onClick(() => {
                userPopover.close();
                Router.push({ name: 'profile' });
            })
    ]).spacing(8)
)
.position('bottom-end')
.arrow()
.trigger(Button('Show Profile').warning())
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

See **[Tooltip](./tooltip.md)** for the lightweight alternative.


---

## Theming

```css
:root {
    --popover-bg:               var(--background);
    --popover-border:           var(--gray-lite-3);
    --popover-radius:           var(--radius-card);
    --popover-shadow:           var(--shadow-lg);
    --popover-padding:          0;
    --popover-min-width:        200px;
    --popover-max-width:        320px;
    --popover-z-index:          100001;
    --popover-font-size:        var(--description-size);
    --popover-header-size:      var(--text-size);
    --popover-header-weight:    600;
    --popover-arrow-size:       8px;
    --popover-animation-duration: 0.15s;
}
```