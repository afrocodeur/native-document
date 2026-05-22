---
title: Badge
description: Small inline label for status, count, or category
---

# Badge

```javascript
import { Badge } from 'native-document/components';

Badge(content, props?)
```

A small inline label for status, count, or category.

## Default Renderer

```javascript
import { BadgeRender } from 'native-document/ui';

Badge.use(BadgeRender);
```

## `$description`

```javascript
{
    appearance:       'filled',   // 'filled' | 'outlined' | 'ghost'
    borderRadiusType: 'pill',
    variant:          'primary',
    size:             'medium',
    content:          null,
    icon:             null,
    iconPosition:     'leading',
    props:            {} // HTML attributes for the root element
}
```

## Methods

```javascript
// Variants
.primary()
.secondary()
.success()
.danger()
.warning()
.info()

// Appearance
.filled()
.outlined()
.ghost()

// Size
.small()
.medium()
.large()

// Shape
.rounded()
.pill()
.circle()

// Icon
.icon(element, position?)

// Event
.onClick(handler)
```

## Example

```javascript
Badge('New').primary().pill()
Badge(count).danger()
Badge('Beta').outlined().warning()
```

---

## Theming

```css
:root {
    --badge-height-small:        18px;
    --badge-height-medium:       22px;
    --badge-height-large:        28px;
    --badge-padding-small:       0 var(--space-cozy);
    --badge-padding-medium:      0 var(--space-cozy-comfortable);
    --badge-padding-large:       0 var(--space-comfortable);
    --badge-font-size-small:     var(--diablo-size);
    --badge-font-size-medium:    var(--note-size);
    --badge-font-size-large:     var(--description-size);
    --badge-color-primary:       var(--color-primary);
    --badge-color-secondary:     var(--color-secondary);
    --badge-color-success:       var(--color-success);
    --badge-color-danger:        var(--color-danger);
    --badge-color-warning:       var(--color-warning);
    --badge-color-info:          var(--color-info);
}
```