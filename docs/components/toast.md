---
title: Toast
description: Toast notification component with auto-dismiss, actions, and positioning
---

# Toast

```javascript
import { Toast } from 'native-document/components';

Toast(content, props?)
```

## Default Renderer

```javascript
import { ToastRender } from 'native-document/ui';
import { ButtonRender } from 'native-document/ui';

Toast.use(ToastRender);
Button.use(ButtonRender); // required - actions are rendered as buttons
```

## `$description`

```javascript
{
    visibility:   Observable(true),
    type:         null,          // 'info' | 'success' | 'warning' | 'error'
    title:        null,
    content:      null,
    icon:         null,
    showIcon:     true,
    duration:     5000,          // ms, 0 = no auto-dismiss
    closable:     true,
    pauseOnHover: true,
    position:     'top-trailing',
    actions:      [],
    props:        {} // HTML attributes for the root element
}
```

## Methods

```javascript
// Type
.info()
.success()
.warning()
.error()

// Content
.title('Saved!')
.content(Div('Your changes have been saved.'))
.icon(CheckIcon)
.showIcon(false)

// Behavior
.duration(3000)
.duration(0)          // no auto-dismiss
.closable(false)
.pauseOnHover(false)

// Position
.atTopLeading()
.atTopTrailing()      // default
.atTopCenter()
.atBottomLeading()
.atBottomTrailing()
.atBottomCenter()

// Actions
.action('Undo', () => undo())
.action('Retry', retry)

// Programmatic
.close()

// Events
.onClose(() => console.log('Dismissed'))
```

## Example

```javascript
const saveToast = Toast('Your changes have been saved.')
    .success()
    .title('Saved!')
    .duration(3000)
    .atTopTrailing()
    .action('Undo', () => undoChanges())

Button('Save')
    .primary()
    .nd.onClick(async () => {
        await saveData();
        saveToast.show()
    })
```

---

## Theming

```css
:root {
    --toast-width:              320px;
    --toast-padding:            var(--space-comfortable);
    --toast-gap:                var(--space-cozy);
    --toast-radius:             var(--radius-card);
    --toast-font-size:          var(--note-size);
    --toast-title-size:         var(--description-size);
    --toast-title-weight:       600;
    --toast-shadow:             var(--shadow-lg);
    --toast-container-gap:      var(--space-cozy);
    --toast-container-offset:   var(--space-comfortable);
    --toast-duration:           0.25s;
}
```