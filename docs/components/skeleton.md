---
title: Skeleton
description: Placeholder that mimics content shape while loading
---

# Skeleton

```javascript
import { Skeleton } from 'native-document/components';

Skeleton(props?)
```

A placeholder that mimics the shape of content while it loads.

## Default Renderer

```javascript
import { SkeletonRender } from 'native-document/ui';

Skeleton.use(SkeletonRender);
```

## `$description`

```javascript
{
    type:             'rect',    // 'rect' | 'circle' | 'text' | 'avatar' | 'image'
    variant:          'pulse',   // 'pulse' | 'wave'
    borderRadiusType: 'rounded',
    lines:            null,      // number - for text type
    width:            null,
    height:           null,
    loading:          null,      // Observable<boolean>
    repeat:           null,      // number - repeat N times
    props:            {} // HTML attributes for the root element
}
```

## Methods

```javascript
// Type
.rect()
    .circle()
    .text(lines?)
    .avatar()
    .image()

    // Animation
    .pulse()
    .wave()

    // Size
    .width(200)
    .height(100)
    .size(width, height)

    // Shape
    .rounded()
    .pill()
    .smooth()

    // Options
    .lines(3)
    .repeat(4)
    .loading(isLoading)
```

## Built-in Presets

Skeleton ships with four ready-to-use presets:

### `Skeleton.card(type?)`

A card with an image area and text lines below:

```javascript
Skeleton.card()
Skeleton.card('featured') // adds type as extra CSS class
```

### `Skeleton.list(items?)`

A list of rows with avatar and text lines. Default: 3 items:

```javascript
Skeleton.list()
Skeleton.list(5)
```

### `Skeleton.table(rows?, cols?)`

A table with a header row and data rows. Default: 5 rows, 4 cols:

```javascript
Skeleton.table()
Skeleton.table(10, 6)
```

### `Skeleton.paragraph(lines?)`

A block of text lines. Default: 3 lines:

```javascript
Skeleton.paragraph()
Skeleton.paragraph(5)
```

---

## Custom Presets

Register your own reusable shapes with `Skeleton.preset()` or `Skeleton.presets()`:

```javascript
Skeleton.preset('userRow', (skeleton) => {
    return skeleton.avatar().circle().size(40, 40);
});

// Register multiple at once
Skeleton.presets({
    title:   (s) => s.rect().width(200).height(24).rounded(),
    avatar:  (s) => s.circle().size(48, 48),
});

// Usage
Skeleton.userRow()
Skeleton.title()
```

## Example

```javascript
ShowIf(isLoading, () =>
    VStack([
        Skeleton().avatar().circle().size(48, 48),
        Skeleton().text(3)
    ]).spacing(8)
)
```

---

## Theming

```css
:root {
    --skeleton-color:          var(--gray-lite-4);
    --skeleton-highlight:      var(--gray-lite-5);
    --skeleton-radius:         var(--radius-button);
    --skeleton-wave-duration:  1.6s;
    --skeleton-pulse-duration: 1.2s;
}
```