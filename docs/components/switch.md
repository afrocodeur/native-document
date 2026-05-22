---
title: Switch
description: Toggle switch component with two-way binding, variants, icons, and inner labels
---

# Switch

```javascript
import { Switch } from 'native-document/components';

Switch(props?)
```

## Default Renderer

```javascript
import { SwitchRender } from 'native-document/ui';

Switch.use(SwitchRender);
```

## `$description`

```javascript
{
    value:         Observable(false),
    label:         null,
    labelPosition: Observable('right'), // 'left' | 'right' | 'top' | 'bottom'
    variant:       Observable('primary'),
    outline:       false,
    disabled:      false,
    loading:       false,
    readonly:      false,
    onIcon:        null,
    offIcon:       null,
    innerOnLabel:  null,
    innerOffLabel: null,
    props:         {} // HTML attributes for the root element
}
```

## Methods

```javascript
// Binding
.model(Observable(false))

// Label
.label('Enable notifications')
.labelPosition('left')  // 'left' | 'right' | 'top' | 'bottom'

// Inner labels (inside the toggle)
.innerLabel('Yes', 'No')

// Icons
.icon(SunIcon, MoonIcon)  // onIcon, offIcon

// Variants
.primary()
.success()
.danger()
.warning()
.ghost()
.outline()

// State
.disabled(Observable(false))
.loading(Observable(false))
.readonly(true)

// Programmatic
.toggle()
.on()
.off()

// Events
.onChange((value) => console.log('Changed:', value))
.onOn(()  => console.log('Switched on'))
.onOff(() => console.log('Switched off'))
```

## Example

```javascript
const darkMode = Observable(false);

Switch()
    .model(darkMode)
    .label('Dark mode')
    .icon(SunIcon, MoonIcon)
    .innerLabel('On', 'Off')
    .onChange((value) => applyTheme(value ? 'dark' : 'light'))
```

---

## Theming

```css
:root {
    --switch-width:            44px;
    --switch-height:           24px;
    --switch-thumb-size:       18px;
    --switch-thumb-offset:     3px;
    --switch-border-width:     0px;
    --switch-track-bg:         var(--gray-lite-3);
    --switch-track-bg-active:  var(--color-primary);
    --switch-thumb-bg:         var(--background);
    --switch-thumb-shadow:     0 1px 3px rgba(0, 0, 0, 0.2);
    --switch-transition:       0.2s ease;
    --switch-label-gap:        var(--space-cozy);
}
```