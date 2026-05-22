---
title: Card
description: Versatile content container with optional image, header, footer, and actions
---

# Card

> **Status: coming soon.** The `Card` API is fully defined but the default renderer is not yet implemented. You can use `Card` today by providing your own renderer via `Card.use()`.

```javascript
import { Card } from 'native-document/components';

Card(props?)
```

## Custom Renderer

Until the default renderer ships, register your own:

```javascript
import { Div, Img, H3, P, Button, HStack } from 'native-document/elements';

Card.use(($d, instance) => {
    return Div({ class: `card ${$d.variant ?? ''}` }, [
        $d.image ? Img({ src: $d.image.src, class: `card-image card-image-${$d.image.position}` }) : null,
        Div({ class: 'card-body' }, [
            $d.title    ? H3({ class: 'card-title' }, $d.title)       : null,
            $d.subtitle ? P({ class: 'card-subtitle' }, $d.subtitle)  : null,
            $d.content  ? Div({ class: 'card-content' }, $d.content)  : null,
        ]),
        $d.actions?.length ? HStack({ class: 'card-footer' },
            $d.actions.map(a => Button(a.label).nd.onClick(a.callback))
        ) : null,
    ]);
});
```

## Methods

| Method | Parameters | Description |
|---|---|---|
| `.title(element)` | `element: NdChild` | Card title |
| `.subtitle(element)` | `element: NdChild` | Card subtitle |
| `.image(src, position?)` | `src: string`, `position?: 'top' \| 'bottom' \| 'left' \| 'right'` | Card image. Default position: `'top'` |
| `.content(element)` | `element: NdChild` | Card body content |
| `.action(label, callback)` | `label: NdChild`, `callback: () => void` | Add a footer action button |
| `.clearActions()` | - | Remove all action buttons |
| `.variant(name)` | `name: string` | CSS variant class |
| `.elevated()` | - | Shorthand for `.variant('elevated')` |
| `.outlined()` | - | Shorthand for `.variant('outlined')` |
| `.flat()` | - | Shorthand for `.variant('flat')` |
| `.horizontal()` | - | Horizontal layout (image on the left) |
| `.clickable(handler)` | `handler: (event) => void` | Make the entire card clickable |
| `.hoverable()` | - | Add hover effect |
| `.loading(val?)` | `val?: boolean \| Observable<boolean>` | Show loading state |
| `.onClick(handler)` | `handler: (event) => void` | Click event |
| `.onHover(handler)` | `handler: (event) => void` | Hover event |
| `.renderImage(fn)` | `fn: ($d, instance) => NdChild` | Custom image renderer |
| `.renderHeader(fn)` | `fn: ($d, instance) => NdChild` | Custom header renderer |
| `.renderContent(fn)` | `fn: ($d, instance) => NdChild` | Custom content renderer |
| `.renderFooter(fn)` | `fn: ($d, instance) => NdChild` | Custom footer renderer |
| `.layout(fn)` | `fn: ($d, instance) => NdChild` | Fully custom layout |

---

## Next Steps

- **[Components Overview](./index.md)** - BaseComponent and renderer pattern
- **[Getting Started](./getting-started.md)** - Register default renderers
