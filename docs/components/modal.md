---
title: Modal
description: Modal dialog with draggable and resizable support
---

# Modal

```javascript
import { Modal } from 'native-document/components';
```

## Default Renderers

```javascript
import { ModalRender } from 'native-document/ui';

Modal.use(ModalRender);
```

---

## `Modal`

```javascript
Modal(content, props?)
```

### `$description`

```javascript
{
    content:         null,
    title:           null,
    footer:          null,
    size:            null,       // 'small' | 'medium' | 'large' | 'xl'
    centered:        true,
    scrollable:      false,
    closeOnBackdrop: true,
    closeOnEscape:   true,
    closable:        true,
    fullscreen:      false,
    draggable:       false,
    resizable:       false,
    focusTrap:       true,
    lockScroll:      true,
    isOpen:          Observable(false),
    props:           {} // HTML attributes for the root element
}
```

### Methods

```javascript
// Content
.title('Confirm deletion')
.content(Div('Are you sure?'))
.footer(
    HStack([
        Button('Cancel').ghost().nd.onClick(() => modal.close()),
        Button('Delete').danger().nd.onClick(() => confirmDelete())
    ]).justifyEnd().spacing(8)
)

// Size
.small()
.medium()
.large()
.extraLarge()
.fullscreen()

// Behavior
.centered()
.scrollable()
.closeOnBackdrop(false)
.closeOnEscape(false)
.closable(false)
.focusTrap(false)
.lockScroll(false)

// Draggable & Resizable
.draggable()
.resizable()
.resizable(true, { size: { minWidth: 300, minHeight: 200 } })

// Programmatic
.open()
.close()
.toggle()

// Events
.onOpen(()        => console.log('Opened'))
.onClose(()       => console.log('Closed'))
.onBeforeOpen(()  => console.log('About to open'))
.onBeforeClose(() => console.log('About to close'))

// Custom renderers
.renderHeader(($description) => Div({ class: 'modal-header' }, $description.title))
.renderContent(($description) => Div({ class: 'modal-body' }, $description.content))
.renderFooter(($description) => Div({ class: 'modal-footer' }, $description.footer))
```

### Example

```javascript
Modal(
    Div([
        P('This action cannot be undone.'),
        P('All associated data will be permanently removed.')
    ])
)
.title('Delete Account')
.footer(
    HStack([
        Button('Cancel').ghost().nd.onClick(() => deleteModal.close()),
        Button('Yes, delete').danger().nd.onClick(async () => {
            await deleteAccount();
            deleteModal.close();
        })
    ]).justifyEnd().spacing(8)
)
.small()
.onOpen(() => trackEvent('delete_modal_open'))
.trigger(
    Button('Delete account')
        .danger()
)
```

---

## Theming

```css
:root {
    --modal-bg:                   var(--white);
    --modal-border:               var(--gray-lite-5);
    --modal-radius:               var(--radius-card);
    --modal-shadow:               var(--shadow-lg);
    --modal-z-index:              10001;
    --modal-font-size:            var(--description-size);
    --modal-header-size:          var(--text-size);
    --modal-header-weight:        600;
    --modal-padding:              var(--space-comfortable);
    --modal-header-padding:       var(--space-tiny);
    --modal-animation-duration:   0.2s;
    --modal-width-small:          400px;
    --modal-width-medium:         560px;
    --modal-width-large:          720px;
    --modal-width-extra-large:    960px;
    --modal-backdrop-bg:          rgba(0, 0, 0, 0.8);
    --modal-close-width:          25px;
    --modal-close-height:         25px;
    --modal-close-hover-bg-color: var(--contrasted-red);
    --modal-close-hover-color:    var(--white);
}
```