---
title: Menu
description: Menu component with items, links, groups, dividers, keyboard navigation, and active state
---

# Menu

```javascript
import { Menu, MenuItem, MenuGroup, MenuLink, MenuDivider } from 'native-document/components';
```

## Default Renderer

```javascript
import {
    MenuRender, MenuItemRender,
    MenuGroupRender, MenuLinkRender, MenuDividerRender
} from 'native-document/ui';

Menu.use(MenuRender);
MenuItem.use(MenuItemRender);
MenuGroup.use(MenuGroupRender);
MenuLink.use(MenuLinkRender);
MenuDivider.use(MenuDividerRender);
```

## Methods

### Orientation

```javascript
.horizontal()
.vertical()
.inline()
```

### Building items

```javascript
.item(label, options?)
.item('Dashboard', { action: () => navigate('/'), icon: DashboardIcon, key: 'home' })

// Function form - receives MenuItem instance
.item('Settings', (item) => {
    item.action(() => navigate('/settings'))
        .icon(SettingsIcon)
        .key('settings')
        .shortcut('+,')
})

// Link item
.link(label, options?)
.link('Documentation', { href: 'https://docs.example.com', target: '_blank' })

// Router link
.linkTo(label, options?)
.linkTo('Home', { href: 'home' })
.linkTo('Profile', { href: { name: 'user', params: { id: 1 } } })

// Separator
.separator()
.divider()  // alias

// Group
.group(label, (group) => {
    group.item('Profile',  { action: () => navigate('/profile') })
    group.item('Security', { action: () => navigate('/security') })
    group.separator()
    group.item('Logout',   { action: () => logout(), icon: LogoutIcon })
})
```

### Active state

```javascript
.active(() => router.currentState().route?.name)      // callback
.active(currentRoute.select(r => r.name))             // observable
```

### Behavior

```javascript
.closeOnSelect(false)
.keyboardLoop(false)
.clickFirst()
.compactThreshold(80)
```

### Dynamic items

```javascript
.bind(observableArray)
```

### Events

```javascript
.onItemClick((item)  => console.log('Clicked:', item.label))
.onItemSelect((item) => console.log('Selected:', item.key))
```

## Example - Sidebar Navigation

```javascript
Menu()
    .vertical()
    .active(router.currentState().select(s => s.route?.name))
    .item('Dashboard', { action: () => Router.push('/'),      icon: HomeIcon,     key: 'home' })
    .item('Users',     { action: () => Router.push('/users'), icon: UsersIcon,    key: 'users' })
    .separator()
    .group('Settings', (group) => {
        group.item('General',  { action: () => Router.push('/settings'),          key: 'settings' })
        group.item('Security', { action: () => Router.push('/settings/security'), key: 'security' })
    })
    .separator()
    .item('Logout', { action: () => logout(), icon: LogoutIcon, key: 'logout' })
```

## Example - Top Navigation

```javascript
Menu()
    .horizontal()
    .linkTo('Home',     { href: 'home' })
    .linkTo('Products', { href: 'products' })
    .linkTo('Pricing',  { href: 'pricing' })
    .link('Docs', { href: 'https://docs.example.com', target: '_blank' })
```

---

## `MenuItem`

```javascript
MenuItem()
    .label('Dashboard')
    .icon(DashboardIcon)
    .key('dashboard')
    .action(() => navigate('/dashboard'))
    .shortcut('+D')
    .disabled(Observable(false))
    .selected(Observable(false))
    .trailing(Badge('New').success())
```

See **[ShortcutManager](./shortcut-manager.md)** for the shortcut convention.

---

## `MenuGroup`

```javascript
MenuGroup('Settings')
    .icon(SettingsIcon)
    .collapsable()
    .collapsed(true)
    .item('Profile',  { action: () => navigate('/profile') })
    .item('Security', { action: () => navigate('/security') })
    .divider()
    .item('Logout', { action: logout })
```

---

## `MenuLink`

Extends `MenuItem` with a `.target()` method:

```javascript
MenuLink()
    .label('Documentation')
    .icon(BookIcon)
    .action('https://docs.example.com')
    .target('_blank')
```

---

## `MenuDivider`

```javascript
MenuDivider()
// or via shorthand:
menu.separator()
```

---

## Theming

```css
:root {
    --menu-bg:                  var(--background);
    --menu-border:              var(--gray-lite-3);
    --menu-radius:              var(--radius-card);
    --menu-shadow:              var(--shadow-md);
    --menu-font-size:           var(--description-size);
    --menu-gap:                 var(--space-tiny);
    --menu-padding:             var(--space-cozy) 0;
    --menu-item-padding:        var(--space-cozy) var(--space-comfortable);
    --menu-item-radius:         var(--radius-button);
    --menu-item-gap:            var(--space-cozy);
    --menu-item-color:          var(--text-color);
    --menu-item-color-hover:    var(--text-color);
    --menu-item-color-active:   var(--color-primary);
    --menu-item-color-disabled: var(--gray-lite-2);
    --menu-item-bg-hover:       var(--gray-lite-5);
    --menu-group-label-size:    var(--hint-size);
    --menu-group-label-color:   var(--gray);
    --menu-shortcut-size:       var(--note-size);
    --menu-shortcut-color:      var(--gray);
    --menu-divider-color:       var(--gray-lite-3);
    --sub-menu-shadow:          var(--shadow-lg);
}
```