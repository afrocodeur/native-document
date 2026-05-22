---
title: ShortcutManager
description: Register, display, and manage keyboard shortcuts with OS-aware rendering and context scoping
---

# ShortcutManager

`ShortcutManager` handles global and context-scoped keyboard shortcuts. It parses shortcut strings, renders them correctly per OS (Mac symbols or Windows labels), and dispatches handlers on keydown.

```javascript
import { ShortcutManager } from 'native-document';
```

---

## Initialization

Call `init()` once at app startup to activate the global keyboard listener:

```javascript
ShortcutManager.init();
```

---

## Shortcut Conventions

Two formats are supported:

### Short convention

Starts with `+`. The first `+` means Ctrl/Cmd (meta):

| Shortcut | Meaning |
|---|---|
| `'+S'` | Ctrl/Cmd + S |
| `'++S'` | Ctrl/Cmd + Alt + S |
| `'+Shift+S'` | Ctrl/Cmd + Shift + S |
| `'+Alt+S'` | Ctrl/Cmd + Alt + S |

### Standard convention

```
'Ctrl+S'
'Cmd+Shift+S'
'Alt+F4'
'Ctrl+Alt+Delete'
```

Both formats are equivalent and can be mixed freely.

---

## OS-Aware Display

`ShortcutManager.display(shortcut)` formats a shortcut string for the current OS:

```javascript
ShortcutManager.display('+S')
// Mac:     "⌘ S"
// Windows: "Ctrl+S"

ShortcutManager.display('+Shift+S')
// Mac:     "⌘ ⇧ S"
// Windows: "Ctrl+Shift+S"

ShortcutManager.display('++S')
// Mac:     "⌘ ⌥ S"
// Windows: "Ctrl+Alt+S"
```

Mac symbols:

| Key | Symbol |
|---|---|
| Meta / Cmd | `⌘` |
| Shift | `⇧` |
| Alt / Option | `⌥` |
| Ctrl | `⌃` |

Use `display()` in your renderer to show the shortcut label next to menu items:

```javascript
MenuItem.use(($description) => {
    return Div({ class: 'menu-item' }, [
        $description.label,
        $description.shortcut
            ? Span({ class: 'shortcut' }, ShortcutManager.display($description.shortcut))
            : null
    ]);
});
```

---

## Registering Shortcuts

### `ShortcutManager.register(shortcut, handler, options?)`

```javascript
ShortcutManager.register('+S', () => save(), { source: 'editor' });
ShortcutManager.register('+Z', () => undo(), { source: 'editor' });
ShortcutManager.register('+Shift+Z', () => redo(), { source: 'editor' });
```

Options:

| Option | Type | Default | Description |
|---|---|---|---|
| `context` | `string` | `'global'` | Scope the shortcut to a named context |
| `source` | `string` | `'unknown'` | Label used in conflict warnings |
| `force` | `boolean` | `false` | Override an existing registration without warning |

### `ShortcutManager.unregister(shortcut, context?)`

```javascript
ShortcutManager.unregister('+S');
ShortcutManager.unregister('+S', 'editor');
```

### `ShortcutManager.has(shortcut, context?)`

```javascript
if (!ShortcutManager.has('+S')) {
    ShortcutManager.register('+S', () => save());
}
```

---

## Contexts

Contexts let you scope shortcuts so the same key combination can do different things in different parts of the app. A `'global'` shortcut always fires. A context shortcut only fires when that context is active (you control activation logic):

```javascript
// Global - always active
ShortcutManager.register('+S', () => save(), {
    context: 'global',
    source:  'app'
});

// Scoped - only active in the modal context
ShortcutManager.register('Escape', () => closeModal(), {
    context: 'modal',
    source:  'modal'
});

// Unregister when leaving context
ShortcutManager.unregister('Escape', 'modal');
```

---

## Conflict Handling

Registering the same shortcut in the same context twice logs a warning:

```javascript
ShortcutManager.register('+S', () => save(),    { source: 'editor' });
ShortcutManager.register('+S', () => download(), { source: 'toolbar' });
// warn: "+S" is already registered by "editor" in context "global". Use { force: true } to override.
```

Use `force: true` to override without warning:

```javascript
ShortcutManager.register('+S', () => download(), { force: true, source: 'toolbar' });
```

---

## Usage with Menu Items

```javascript
import { MenuItem } from 'native-document/components';

MenuItem()
    .label('Save')
    .icon(SaveIcon)
    .shortcut('+S')
    .action(() => save())
```

The shortcut string is passed as-is to `ShortcutManager.display()` by the renderer to show the OS-formatted label.

---

## Integration with Dropdown and Context Menu

`DropdownItem` and `ContextMenuItem` both accept a `.shortcut()` method that passes the string directly to `ShortcutManager.display()` in the renderer:

```javascript
import { DropdownItem } from 'native-document/components';

DropdownItem()
    .label('Save')
    .icon(SaveIcon)
    .shortcut('+S')
    .action(() => save())

// ContextMenuItem works the same way
ContextMenuItem()
    .label('Delete')
    .shortcut('Delete')
    .danger()
    .action((data) => deleteRow(data))
```

The shortcut label is display-only in Dropdown and ContextMenu items - they do not automatically register the shortcut with `ShortcutManager`. Register shortcuts separately if you want them to fire on keydown:

```javascript
ShortcutManager.register('+S', () => save(), { source: 'toolbar' });
```

---

## Next Steps

- **[Menu](./menu.md)** - Menu with shortcut labels
- **[Dropdown](./dropdown.md)** - Dropdown items with shortcuts
- **[Context Menu](./context-menu.md)** - Context menu items with shortcuts
