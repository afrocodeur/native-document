---
title: Context Menu
description: Right-click context menu with trigger binding, items, groups, and dividers
---

# Context Menu

```javascript
import { ContextMenu, ContextMenuGroup, ContextMenuItem } from 'native-document/components';
import { Menu, MenuGroup, MenuItem, MenuDivider, MenuLink } from 'native-document/components';
```

`ContextMenu.use()` takes two arguments - a renderer and a handler. The handler wires the right-click behavior to any element, making `.nd.contextMenu()` available on all elements.

## Default Renderer

```javascript
import {
    ContextMenuRender, contextMenuHandler,
    MenuRender, MenuGroupRender, MenuItemRender,
    MenuDividerRender, MenuLinkRender
} from 'native-document/ui';

Menu.use(MenuRender);
MenuGroup.use(MenuGroupRender);
MenuItem.use(MenuItemRender);
MenuDivider.use(MenuDividerRender);
MenuLink.use(MenuLinkRender);
ContextMenu.use(ContextMenuRender, contextMenuHandler);
```

## Building a Context Menu

```javascript
const tableContextMenu = ContextMenu()
    .menu((menu) => {
        menu
            .item('Edit',      { action: (data) => openEdit(data) })
            .item('Duplicate', { action: (data) => duplicate(data) })
            .divider()
            // pass a function to get the MenuItem instance for fluent configuration
            .item('Delete', (item) => {
                item
                    .action((data) => deleteRow(data))
                    .icon(TrashIcon)
                    .shortcut('+Delete')
                    .danger()
            })
    });

// Attach to any element, pass contextual data
TableRow(item)
    .nd.contextMenu(tableContextMenu, item)
```

## Methods

```javascript
.menu((menu) => { menu.item(...) })
.position(x, y)
.show()
.hide()
.trigger(element)
```

## `ContextMenuItem`

```javascript
ContextMenuItem()
    .label('Edit')
    .icon(EditIcon)
    .action((data) => openEditor(data))
    .shortcut('+E')        // short convention: + = meta/ctrl, ++ = meta+alt
    .disabled(false)
    .danger()
```

### Shortcut convention

| Syntax | Meaning |
|---|---|
| `'+S'` | Ctrl/Cmd + S |
| `'++S'` | Ctrl/Cmd + Alt + S |
| `'+Shift+S'` | Ctrl/Cmd + Shift + S |
| `'Ctrl+S'` | Standard form |
| `'Cmd+Shift+S'` | Standard form |

Shortcuts are displayed automatically per OS - Mac uses symbols (`⌘ S`), Windows uses labels (`Ctrl+S`).

See **[ShortcutManager](./shortcut-manager.md)** for the full reference.

## `ContextMenuGroup`

Groups items under a label:

```javascript
ContextMenuGroup('File actions')
    .item('New',  handler)
    .item('Open', handler)
    .divider()
    .item('Save', handler)
```

---

## Theming

```css
:root {
    --context-menu-bg:                  var(--background);
    --context-menu-border:              var(--gray-lite-3);
    --context-menu-radius:              var(--radius-card);
    --context-menu-shadow:              var(--shadow-lg);
    --context-menu-z-index:             99999;
    --context-menu-min-width:           180px;
    --context-menu-animation-duration:  0.12s;
}
```