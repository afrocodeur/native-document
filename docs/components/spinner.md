---
title: Spinner
description: Loading indicator with multiple types, sizes, and overlay support
---

# Spinner

```javascript
import { Spinner } from 'native-document/components';

Spinner(props?)
```

A loading indicator.

## Default Renderer

```javascript
import { SpinnerRender } from 'native-document/ui';

Spinner.use(SpinnerRender);
```

## `$description`

```javascript
{
    type:              'circle',  // 'circle' | 'dots' | 'bars' | 'pulse' | 'ring'
    variant:           'primary',
    color:             null,
    size:              'small',   // 'xs' | 'small' | 'medium' | 'large'
    label:             null,
    labelPosition:     null,      // 'top' | 'bottom' | 'left' | 'right'
    overlay:           null,
    backdrop:          null,
    fullScreenOverlay: null,
    speed:             'normal',  // 'slow' | 'normal' | 'fast'
    props:             {} // HTML attributes for the root element
}
```

## Methods

```javascript
// Type
.circle()
.dots()
.bars()
.pulse()
.ring()

// Size
.extraSmall()
.small()
.medium()
.large()

// Style
.primary()
.color('#3b82f6')
.speed('fast')

// Label
.label('Loading...')
.labelPosition('bottom')

// Overlay
.overlay()
.fullScreenOverlay()
```

## Example

```javascript
ShowIf(isLoading, () => Spinner().large().label('Loading...'))
```

---

## Theming

```css
:root {
    --spinner-size-extra-small: 16px;
    --spinner-size-small:       24px;
    --spinner-size-medium:      36px;
    --spinner-size-large:       48px;
    --spinner-size-extra-large: 64px;
    --spinner-speed-slow:       1.2s;
    --spinner-speed-normal:     0.8s;
    --spinner-speed-fast:       0.4s;
    --spinner-thickness:        3px;
    --spinner-color:            var(--color-primary);
    --spinner-color-primary:    var(--color-primary);
    --spinner-color-secondary:  var(--color-secondary-text);
    --spinner-color-success:    var(--color-success);
    --spinner-color-danger:     var(--color-danger);
    --spinner-color-warning:    var(--color-warning);
}
```