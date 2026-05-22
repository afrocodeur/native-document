---
title: Dropdown
description: Dropdown component with keyboard navigation, search, grouping, and flexible trigger binding
---

# Dropdown

```javascript
import { Dropdown, DropdownItem, DropdownGroup, DropdownDivider, DropdownTrigger } from 'native-document/components';
```

When `Dropdown.use()` is called, it automatically adds a `.nd.dropdown()` method to all NDElements and BaseComponents.

## Default Renderer

```javascript
import {
    DropdownRender, DropdownItemRender,
    DropdownGroupRender, DropdownDividerRender
} from 'native-document/ui';

Dropdown.use(DropdownRender);
DropdownItem.use(DropdownItemRender);
DropdownGroup.use(DropdownGroupRender);
DropdownDivider.use(DropdownDividerRender);
```

## `$description`

```javascript
{
    trigger:             null,
    items:               Observable.array([]),
    position:            'bottom-start',
    interaction:         'click',   // 'click' | 'hover' | 'focus'
    offset:              [0, 4],
    disabled:            Observable(false),
    closeOnSelect:       true,
    closeOnClickOutside: true,
    closeOnEscape:       true,
    isOpen:              Observable(false),
    maxHeight:           null,
    searchable:          false,
    searchValue:         null,
    searchPlaceholder:   'Search...',
    loopOnKeyboard:      true,
    props:               {} // HTML attributes for the root element
}
```

## Adding Items

```javascript
Dropdown()
    .item(DropdownItem().label('Edit').icon(EditIcon).action(() => edit()))
    .item(DropdownItem().label('Delete').danger().action(() => remove()))
    .divider()
    .item(DropdownItem().label('Export').action(() => exportData()))
    .group((group) => {
        group.item(DropdownItem().label('Item A'))
        group.item(DropdownItem().label('Item B'))
    })
```

## Binding from Data

```javascript
const roles = Observable.array(['Admin', 'Editor', 'Viewer']);

Dropdown()
    .from(roles)   // string array

Dropdown()
    .from(users, (user) => DropdownItem().label(user.name).value(user.id).action(() => selectUser(user.id)))
```

## Trigger

```javascript
// Via .nd.dropdown() - attached to the element
Button('Actions').nd.dropdown(
    Dropdown()
        .item(DropdownItem().label('Edit'))
)

// Custom trigger component
Dropdown()
    .trigger(
        DropdownTrigger()
            .content('Options')
            .icon(ChevronIcon)
            .stateOpenIcon(ChevronUpIcon)
            .stateClosedIcon(ChevronDownIcon)
    )
```

## Behavior

```javascript
.onClicked()              // open on click (default)
.onHovered()              // open on hover
.onFocused()              // open on focus

.closeOnSelect(false)
.closeOnClickOutside(false)
.closeOnEscape(false)
.maxHeight(300)
.loopOnKeyboard()
.matchTriggerWidth()
```

## Search

```javascript
.searchable()
.searchPlaceholder('Filter...')
.renderSearch(($description) =>
    Input({ value: $description.searchValue, placeholder: $description.searchPlaceholder })
)

// Custom filter
.filter((item, search) => item.label.toLowerCase().includes(search), [searchObs])
```

## Events

```javascript
.onChange((item) => console.log('Selected:', item))
.onOpen(()       => console.log('Opened'))
.onClose(()      => console.log('Closed'))
```

## Custom Renderers

```javascript
.renderItem(($item) => Div({ class: 'item' }, $item.label))
.renderHeader(() => Div({ class: 'header' }, 'Choose an option'))
.renderFooter(() => Div({ class: 'footer' }, Link({ href: '/all' }, 'See all')))
```

---

## `DropdownItem`

```javascript
DropdownItem()
    .label('Save')
    .icon(SaveIcon)
    .value('save')
    .shortcut('+S')
    .action(() => save())
    .disabled(false)
    .danger()
```

See **[ShortcutManager](./shortcut-manager.md)** for the shortcut convention.

---

## `DropdownGroup`

```javascript
DropdownGroup('File')
    .item(DropdownItem().label('New').shortcut('+N').action(() => newFile()))
    .item(DropdownItem().label('Open').shortcut('+O').action(() => openFile()))
    .divider()
    .item(DropdownItem().label('Save').shortcut('+S').action(() => save()))
```

---

## `DropdownTrigger`

A custom trigger component that shows open/close state:

```javascript
DropdownTrigger()
    .content('Options')
    .icon(ChevronIcon)
    .stateOpenIcon(ChevronUpIcon)
    .stateClosedIcon(ChevronDownIcon)
```

---

## Theming

```css
:root {
    --dropdown-bg:                      var(--background);
    --dropdown-border:                  var(--gray-lite-3);
    --dropdown-radius:                  var(--radius-card);
    --dropdown-shadow:                  var(--shadow-lg);
    --dropdown-min-width:               180px;
    --dropdown-max-width:               320px;
    --dropdown-z-index:                 100001;
    --dropdown-font-size:               var(--description-size);
    --dropdown-animation-duration:      0.15s;
    --dropdown-arrow-size:              8px;
    --dropdown-item-padding:            var(--space-cozy) var(--space-comfortable);
    --dropdown-item-radius:             var(--radius-button);
    --dropdown-item-gap:                var(--space-cozy);
    --dropdown-item-color:              var(--text-color);
    --dropdown-item-color-hover:        var(--text-color);
    --dropdown-item-bg-hover:           var(--gray-lite-5);
    --dropdown-item-bg-active:          var(--gray-lite-4);
    --dropdown-item-color-disabled:     var(--gray-lite-2);
    --dropdown-group-label-size:        var(--note-size);
    --dropdown-group-label-color:       var(--gray);
    --dropdown-group-label-padding:     var(--space-cozy) var(--space-comfortable);
    --dropdown-search-padding:          var(--space-cozy) var(--space-comfortable);
    --dropdown-search-border:           var(--gray-lite-3);
}
```