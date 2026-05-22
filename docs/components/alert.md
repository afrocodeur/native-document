---
title: Alert
description: Contextual message component with title, icon, actions, and auto-dismiss
---

# Alert

```javascript
import { Alert } from 'native-document/components';

Alert(content, props?)
```

Displays a contextual message with optional title, icon, and actions.

## Default Renderer

```javascript
import { AlertRender } from 'native-document/ui';
import { ButtonRender } from 'native-document/ui';

Alert.use(AlertRender);
Button.use(ButtonRender); // required - actions are rendered as buttons
```

## Methods

```javascript
// Type
.info()
    .success()
    .warning()
    .error()
    .danger()

    // Appearance
    .filled()
    .bordered()
    .outline()

    // Content
    .title('Alert title')
    .content(Div('Updated content'))
    .icon(InfoIcon)
    .showIcon()
    .closable()
    .dismissible()
    .autoDismiss(3000)

    // Actions
    .action('Undo', () => undo())
    .action('Retry', retryFn)
    .clearActions()

    // Events
    .onClose(() => console.log('Closed'))
    .onShow(() => console.log('Shown'))

    // Programmatic
    .close()
    .show()

    // Custom renderers
    .renderTitle(($description) => Strong($description.title))
    .renderContent(($description) => P($description.content))
    .renderFooter(($description) => Div($description.actions))
    .layout(($description) => Div([$description.title, $description.content, $description.footer]))
```

## Example

```javascript
Alert('Your changes have been saved successfully.')
    .success()
    .filled()
    .title('Saved!')
    .icon(CheckIcon)
    .action('Undo', () => undo())
```

---

## Theming

```css
:root {
    --alert-padding:        var(--space-comfortable);
    --alert-radius:         var(--radius-card);
    --alert-gap:            var(--space-cozy);
    --alert-font-size:      var(--description-size);
    --alert-title-size:     var(--text-size);
    --alert-title-weight:   600;
    --alert-border-width:   1px;
    --alert-color-info:     var(--color-info);
    --alert-color-success:  var(--color-success);
    --alert-color-warning:  var(--color-warning);
    --alert-color-danger:   var(--color-danger);
}
```