---
title: Components
description: NativeDocument's headless UI component system - describe your interface without choosing a theme, build fast, change the look anytime
---

# Components

NativeDocument ships a separate `@native-document/components` package with 50+ UI components.

## Install

```bash
npm install @native-document/components
```

```javascript
import { Button, Modal, Tabs } from '@native-document/components';
```

---

## The Philosophy

### Describe your interface. Worry about the look later.

The goal of the component system is simple: let you **build fast without making visual decisions upfront**.

When you write `Button('Save').variant('primary').size('large').rounded().loading(isSubmitting)`, you are describing **what the component should look like and what state it is in** - primary, large, rounded, loading. You are not deciding *how* those descriptions translate to pixels. That is the renderer's job.

`rounded()` says "this should be rounded". The renderer decides whether that means `border-radius: 4px`, `border-radius: 9999px`, a CSS class, or a Tailwind utility. You can change that decision at any time without touching the component.

This means:

- **Start immediately** - no design system required, no theme to configure first
- **Change the look anytime** - edit one renderer file and every component updates automatically, without touching a single line of business logic
- **No CSS wars** - no specificity conflicts, no `!important`, no framework overrides
- **One component, any visual system** - Tailwind, Bootstrap, your own CSS, or bare styles

### Describe intent. The renderer decides implementation.

Every component lets you express visual intent through a fluent API. A `Button` knows it can be `primary`, `large`, `rounded`, `loading`, or `disabled`. It does not know what CSS rules those words translate to - that is the renderer's responsibility.

When you need to change the UI from Bootstrap to Tailwind, or from flat to material design - you edit the renderer. Nothing else changes.

### The `$description` Contract

Every component builds a `$description` object - a plain object that describes the current state of the component. The renderer receives this object and returns a DOM element.

```javascript
// What Button.$description looks like:
{
    label:            'Submit',
        type:             'submit',
    variant:          'primary',
    size:             'large',
    icon:             null,
    iconPosition:     'leading',
    loading:          Observable(false),
    disabled:         Observable(false),
    outline:          false,
    block:            false,
    borderRadiusType: 'rounded',
    props:            { class: 'my-btn' },
    render:           null  // custom per-instance renderer
}
```

The renderer is a function that receives `$description` and returns a DOM element:

```javascript
Button.use(($description, component) => {
    return NativeButton({
        type:     $description.type || 'button',
        class:    buildClasses($description),
        disabled: $description.disabled
    }, [
        ShowIf($description.loading, () => Spinner()),
        $description.icon && $description.iconPosition === 'leading'
            ? $description.icon
            : null,
        $description.label,
        $description.icon && $description.iconPosition === 'trailing'
            ? $description.icon
            : null,
    ]);
});
```

### Fluent API

Every component uses a fluent builder API. Methods configure the `$description` and return `this` for chaining. The component is only rendered when you access `.nd` or append it to the DOM:

```javascript
Button('Submit')
    .variant('primary')
    .size('large')
    .loading(isSubmitting)
    .disabled(isDisabled)
    .rounded()
    .nd.onClick(() => submitForm())
```

### Rendering is Lazy

The component function runs immediately, but the DOM is not built until:

- You access `.nd` (triggers `.toNdElement()`)
- You append the component to the DOM directly

This means you can fully configure a component before it renders.

---

## Registering a Renderer

### Global renderer

```javascript
import { Button } from '@native-document/components';

// Called once at app startup - applies to all Button instances
Button.use(($description) => {
    const classes = ['btn'];

    if ($description.variant) { classes.push(`btn-${$description.variant}`); }
    if ($description.size)    { classes.push(`btn-${$description.size}`); }
    if ($description.block)   { classes.push('btn-block'); }
    if ($description.outline) { classes.push('btn-outline'); }

    return NativeButton({
        type:     $description.type || 'button',
        class:    classes.join(' '),
        disabled: $description.disabled,
        ...$description.props
    }, $description.label);
});
```

### Per-instance renderer

Override the global renderer for a specific instance:

```javascript
Button('Special')
    .render(($description) => {
        return NativeButton({ class: 'special-btn' }, $description.label);
    })
    .nd.onClick(() => console.log('Special!'))
```

---

## `setDescription()` - Reactive Updates

`setDescription()` updates the `$description` object. If a key already holds an observable, it calls `.set()` on it instead of replacing it - keeping reactive bindings intact:

```javascript
const btn = Button('Save').loading(Observable(false));

// Later - updates the observable, DOM reacts automatically
btn.setDescription({ loading: true });
```

---

## `showIf()` / `visibility()`

Conditionally render the entire component:

```javascript
Button('Admin Only')
    .showIf(user.is(u => u.isAdmin))
    .variant('danger')
```

---

## `props()` - Pass HTML Attributes

Pass arbitrary HTML attributes to the root element:

```javascript
Button('Submit')
    .props({ id: 'submit-btn', 'data-testid': 'submit' })
    .variant('primary')
```

---

## `refSelf()` - Component Reference

Store a reference to the component instance (not the DOM element):

```javascript
const refs = {};

Button('Save')
    .variant('primary')
    .nd.refSelf(refs, 'saveBtn');

// Later - call component methods
refs.saveBtn.loading(true);
refs.saveBtn.disabled(true);
```

---

## `ghostDom()` - Companion Elements

Attach companion elements that are injected into the DOM alongside the component but not exposed to the parent. See [NDElement - ghostDom](../native-document-element.md) for the full explanation.

---

## `postBuild(callback)`

Register a callback that runs after the component renders:

```javascript
Button('Submit')
    .postBuild((element, component) => {
        console.log('Button rendered:', element);
    })
```

---

## `BaseComponent.extends()` and `BaseComponent.use()`

These are the tools for building custom components:

```javascript
import { BaseComponent } from '@native-document/components';

// Create a new component that inherits from BaseComponent
function MyCard(title, props = {}) {
    if (!(this instanceof MyCard)) {
        return new MyCard(title, props);
    }
    BaseComponent.call(this);
    this.$description = { title, props };
}

MyCard.defaultTemplate = null;

MyCard.use = function(template) {
    MyCard.defaultTemplate = template;
};

// Set up prototype chain
BaseComponent.extends(MyCard);

// Add methods
MyCard.prototype.subtitle = function(subtitle) {
    this.$description.subtitle = subtitle;
    return this;
};

// Register renderer
MyCard.use(($description) => {
    return Div({ class: 'card', ...$description.props }, [
        H2($description.title),
        $description.subtitle ? P($description.subtitle) : null,
    ]);
});

// Usage
MyCard('Hello').subtitle('World').nd
```

### `BaseComponent.use()` - Apply Traits

Mix behavior traits into a component:

```javascript
import { BaseComponent, HasEventEmitter, HasDraggable } from '@native-document/components';

BaseComponent.use(MyCard, HasEventEmitter, HasDraggable);
// MyCard now has .on(), .emit(), .makeDraggable() etc.
```

---

## Default Renderers

The package ships with a default renderer for every component, imported from `'native-document/src/ui'`. You can use them as a starting point or ignore them entirely and write your own from scratch.

Create a `src/core/renderers.js` file and import it once at app startup:

```javascript
import {
    Button, Alert, Badge, Modal, Tabs, Dropdown, DropdownItem
    // ... all components you use
} from 'native-document/components';

import {
    ButtonRender, AlertRender, BadgeRender, ModalRender, TabsRender,
    DropdownRender, DropdownItemRender
    // ... matching renders
} from 'native-document/src/ui';

Button.use(ButtonRender);
Alert.use(AlertRender);
Badge.use(BadgeRender);
Modal.use(ModalRender);
Tabs.use(TabsRender);
Dropdown.use(DropdownRender);
DropdownItem.use(DropdownItemRender);
// ...
```

> `ContextMenu` is the only exception - its `.use()` takes both a renderer and a handler:
> ```javascript
> import { ContextMenuRender, contextMenuHandler } from 'native-document/src/ui';
> ContextMenu.use(ContextMenuRender, contextMenuHandler);
> ```

When you want to customize, call `Component.use()` with your own renderer - it replaces the default globally:

```javascript
Button.use(($d) => {
    return NativeButton({
        class: buildMyClasses($d),
        ...$d.props
    }, $d.label);
});
```

You can also mix - use the defaults for most components and override only the ones you want to customize.

---

## Next Steps

- **[Getting Started](./getting-started.md)** - Build your first component with a renderer
- **[Traits](./traits.md)** - HasEventEmitter, HasDraggable, HasResizable
- **[Button](./button.md)** - Button component API
- **[Layout](./layout.md)** - Stack, Row, Col, Divider