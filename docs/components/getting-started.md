---
title: Components - Getting Started
description: Set up NativeDocument components with default or custom renderers
---

# Getting Started with Components

## Import

Components are included in `native-document` - no separate installation needed:

```javascript
import { Button, Modal, Tabs, Accordion } from 'native-document/components';
```

To use the default theme and behavioral CSS:

```javascript
import 'native-document/src/ui/theme.scss';
```

---

## Option 1 - Use the Default Renderers

The package ships a ready-to-use renderer for every component. Import them from `'native-document/ui'` and register them once at app startup.

Create `src/core/renderers.js`:

```javascript
import {
    Button, Alert, Badge, Spinner, Modal, Tabs,
    Dropdown, DropdownItem, DropdownDivider, DropdownGroup,
    Menu, MenuItem, MenuGroup, MenuLink, MenuDivider,
    ContextMenu, Accordion, AccordionItem,
    // ... all components you use
} from 'native-document/components';

import {
    ButtonRender, AlertRender, BadgeRender, SpinnerRender, ModalRender, TabsRender,
    DropdownRender, DropdownItemRender, DropdownDividerRender, DropdownGroupRender,
    MenuRender, MenuItemRender, MenuGroupRender, MenuLinkRender, MenuDividerRender,
    ContextMenuRender, contextMenuHandler,
    AccordionRender, AccordionItemRender,
    // ... matching renders
} from 'native-document/ui';

Button.use(ButtonRender);
Alert.use(AlertRender);
Badge.use(BadgeRender);
Spinner.use(SpinnerRender);
Modal.use(ModalRender);
Tabs.use(TabsRender);
Dropdown.use(DropdownRender);
DropdownItem.use(DropdownItemRender);
DropdownDivider.use(DropdownDividerRender);
DropdownGroup.use(DropdownGroupRender);
Menu.use(MenuRender);
MenuItem.use(MenuItemRender);
MenuGroup.use(MenuGroupRender);
MenuLink.use(MenuLinkRender);
MenuDivider.use(MenuDividerRender);
ContextMenu.use(ContextMenuRender, contextMenuHandler); // note: two arguments
Accordion.use(AccordionRender);
AccordionItem.use(AccordionItemRender);
// ...
```

Then import it in `main.js` - renderers first, then the rest of the app:

```javascript
import { Router } from 'native-document/router';
import './core/renderers.js';
// ... rest of app setup
```

---

## Option 2 - Write Your Own Renderers

Skip the defaults entirely and write renderers that match your own design system:

```javascript
import { Button, Spinner } from 'native-document/components';
import { NativeButton, ShowIf } from 'native-document/elements';

Button.use(($description) => {
    const classes = ['btn'];

    if($description.variant) {
        classes.push(`btn-${$description.variant}`);
    }
    if($description.size) {
        classes.push(`btn-${$description.size}`);
    }
    if($description.block) {
        classes.push('btn-block');
    }
    if($description.outline) {
        classes.push('btn-outline');
    }
    if($description.borderRadiusType) {
        classes.push(`btn-${$description.borderRadiusType}`);
    }

    return NativeButton({
        type:     $description.type || 'button',
        class:    classes.join(' '),
        disabled: $description.disabled,
        ...$description.props
    }, [
        ShowIf($description.loading, () => Spinner()),
        $description.label
    ]);
});
```

---

## Option 3 - Mix Both

Use the defaults for most components and override only the ones that need a custom look:

```javascript
import { ButtonRender, AlertRender } from 'native-document/ui';

Alert.use(AlertRender);

Button.use(($description) => {
    return NativeButton({
        class: myTailwindClasses($description),
        ...$description.props
    }, $description.label);
});
```

---

## Using Components

Once renderers are registered, components work just like HTML elements. Only call `.nd` when you need to chain a specific `.nd` method:

```javascript
import { Button, Alert } from 'native-document/components';

Div({ class: 'form' }, [
    Alert('Please fix the errors below').error(),
    Input({ type: 'text', value: name }),
    Button('Submit')
        .primary()
        .loading(isLoading)
        .nd
        .onClick(() => submit())
])
```

---

## The `$description` Contract

Every renderer receives a `$description` object describing the component's current state. Here is what a fully configured `Button` looks like:

```javascript
{
    label:            'Submit',
    type:             'submit',          // 'button' | 'submit' | 'reset' | null
    variant:          'primary',
    size:             'large',           // 'small' | 'medium' | 'large' | null
    icon:             SvgIcon,           // DOM element | null
    iconPosition:     'leading',         // 'leading' | 'trailing' | 'top' | 'bottom'
    iconOnly:         false,
    loading:          Observable(false), // reactive
    disabled:         Observable(false), // reactive
    outline:          false,
    block:            false,
    borderRadiusType: 'rounded',
    props:            {} // HTML attributes for the root element
    render:           null               // per-instance renderer override
}
```

Each component page documents its own `$description` structure.

---

## Renderer Tips

### Use `$description` not `$d`

Use the full name `$description` in your renderers for clarity:

```javascript
Button.use(($description) => {
    return NativeButton({
        class:    buildClasses($description),
        disabled: $description.disabled,
        ...$description.props
    }, $description.label);
});
```

### Spread `$description.props` last

Always spread `$description.props` last so per-instance attributes can override defaults:

```javascript
NativeButton({
    type:  'button',
    class: buildClasses($description),
    ...$description.props
}, $description.label)
```

### Observable values are reactive

Some `$description` values are observables (`loading`, `disabled`, etc.). Pass them directly as attributes - NativeDocument handles the reactive binding:

```javascript
NativeButton({
    disabled: $description.disabled,  // Observable<boolean> - reactive
    class:    buildClasses($description)
}, $description.label)
```

### Per-instance override

A component can override the global renderer for a specific instance via `.render()`:

```javascript
Button('Special')
    .render(($description) => NativeButton({ class: 'special-btn' }, $description.label))
    .nd.onClick(() => doSomething())
```

---

## Presets

Presets create named factory shortcuts for commonly configured variants:

```javascript
Button.preset('save', (label, props) => {
    return Button(label || 'Save',   props).primary();
});
Button.preset('cancel', (label, props) => {
    return Button(label || 'Cancel', props).ghost();
});
Button.preset('delete', (label, props) => {
    return Button(label || 'Delete', props).danger().outline();
});

Button.save()
Button.cancel('Go back')
Button.delete('Remove account')
```

---

## Next Steps

- **[Traits](./traits.md)** - HasEventEmitter, HasDraggable, HasResizable
- **[Button](./button.md)** - Full Button API
- **[Layout](./layout.md)** - Stack, Row, Col, Divider
- **[Components Overview](./index.md)** - Philosophy and BaseComponent API