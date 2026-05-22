---
title: Tabs
description: Tabs component with sortable tabs, closable tabs, overflow handling, and flexible navigation positioning
---

# Tabs

```javascript
import { Tabs } from 'native-document/components';

Tabs(props?)
```

## Default Renderer

```javascript
import { TabsRender } from 'native-document/ui';

Tabs.use(TabsRender);
```

## `$description`

```javascript
{
    active:               Observable(''),
    tabs:                 {},
    sortable:             false,
    tabAppearance:        'segmented', // 'segmented' | 'pills' | 'underline'
    stickyHeader:         false,
    overflow:             'scroll',    // 'scroll' | 'menu'
    navigationBarPosition:'top',
    tabsAlignment:        'leading',   // 'leading' | 'trailing' | 'center' | 'justified'
    closable:             false,
    focusOnNewTab:        false,
    props:                {} // HTML attributes for the root element
}
```

## Methods

### Building tabs

```javascript
.tab(label, content, key?)
.tabWithIcon(icon, label, content, key?)

.tab('Overview', OverviewPanel, 'overview')
.tabWithIcon(HomeIcon, 'Dashboard', DashboardPanel, 'dashboard')

.tabs([
    { key: 'home',    label: 'Home',    content: HomePanel },
    { key: 'profile', label: 'Profile', content: ProfilePanel }
])

.addTab(null, 'New Tab', EmptyPanel, 'tab-1')
.closeTab('settings')

.active('overview')
.active(Observable('overview'))
```

### Appearance

```javascript
.pills()
.segmented()
.underline()
```

### Navigation position

```javascript
.navigationBarAtTop()
.navigationBarAtLeft()
.navigationBarAtRight()
.navigationBarAsDock()
```

### Alignment

```javascript
.tabsAtLeading()
.tabsAtTrailing()
.tabsAtCenter()
.tabsJustified()
```

### Behavior

```javascript
.sortable()
.closable()
.stickyHeader()
.focusOnNewTab()
.overflow('scroll')
.overflow('menu')
.addPlusButton((tabs) => {
    const key = `tab-${Date.now()}`;
    tabs.addTab(null, 'New Tab', EmptyPanel, key);
})
```

### Events

```javascript
.onChange((key)         => loadTabContent(key))
.onClickTab((key)       => console.log('Clicked:', key))
.onCloseTab((key)       => confirmClose(key))
.onBeforeTabClose((key) => confirm('Close this tab?'))
.onAddTab((key)         => console.log('Tab added:', key))
```

### Custom renderers

```javascript
.renderTab(($tab) => HStack([$tab.icon, Span($tab.label)]).spacing(4))
.renderCloseButton(() => Span('x'))
.renderPlusButton(() => Span('+'))
```

## Example

```javascript
Tabs()
    .tabWithIcon(HomeIcon,     'Dashboard', DashboardPanel,  'dashboard')
    .tabWithIcon(UsersIcon,    'Users',     UsersPanel,      'users')
    .tabWithIcon(SettingsIcon, 'Settings',  SettingsPanel,   'settings')
    .active('dashboard')
    .tabsJustified()
    .stickyHeader()
    .onChange((key) => Router.push({ name: key }))
```

---

## Theming

```css
:root {
    --tabs-border:              var(--gray-lite-3);
    --tabs-radius:              var(--radius-button);
    --tabs-font-size:           var(--description-size);
    --tabs-font-weight:         500;
    --tab-padding:              var(--space-cozy) var(--space-comfortable);
    --tab-color:                var(--gray);
    --tab-color-active:         var(--color-primary);
    --tab-color-hover:          var(--text-color);
    --tab-bg-hover:             var(--gray-lite-5);
    --tab-indicator-height:     2px;
    --tabs-content-padding:     var(--space-comfortable) 0;
}
```