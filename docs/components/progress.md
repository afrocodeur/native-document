---
title: Progress
description: Progress bar and circular progress indicator
---

# Progress

```javascript
import { Progress } from 'native-document/components';

Progress(props?)
```

## Default Renderer

```javascript
import { ProgressRender } from 'native-document/ui';

Progress.use(ProgressRender);
```

## `$description`

```javascript
{
    value:            null,   // number | Observable<number>
    type:             null,   // 'linear' | 'circular'
    variant:          null,
    max:              100,
    size:             null,
    stroke:           null,   // circular stroke width
    height:           null,   // linear height
    showValue:        null,
    showPercentage:   null,
    label:            null,
    format:           null,   // (value, max) => string
    indeterminate:    null,
    striped:          null,
    animated:         null,
    borderRadiusType: null,
    props:            {}
}
```

## Methods

| Method | Parameters | Description |
|---|---|---|
| `.value(val)` | `val: number \| Observable<number>` | Current value |
| `.max(val)` | `val: number` | Maximum value. Default `100` |
| `.type(type)` | `'linear' \| 'circular'` | Progress type |
| `.primary()` | - | Primary color variant |
| `.success()` | - | Success color variant |
| `.danger()` | - | Danger color variant |
| `.warning()` | - | Warning color variant |
| `.size(size)` | `'small' \| 'large'` | Size preset |
| `.height(px)` | `px: number` | Height in px (linear) |
| `.stroke(px)` | `px: number` | Stroke width in px (circular) |
| `.showValue()` | - | Display the numeric value |
| `.showPercentage()` | - | Display the percentage |
| `.label(text)` | `text: string` | Label beside the bar |
| `.format(fn)` | `fn: (value, max) => string` | Custom value formatter |
| `.indeterminate()` | - | Indeterminate animation (no known value) |
| `.striped()` | - | Striped style |
| `.animated()` | - | Animate the stripes |
| `.rounded()` | - | Rounded border radius |
| `.pill()` | - | Pill border radius |
| `.onComplete(handler)` | `handler: () => void` | Fires once when value reaches max |

## Example

```javascript
const progress = Observable(0);

Progress()
    .value(progress)
    .primary()
    .showPercentage()
    .striped()
    .animated()
    .onComplete(() => {
        Toast('Upload complete!').success().show();
    })
```


---

## Theming

```css
:root {
    --progress-height-small:             4px;
    --progress-height-medium:            8px;
    --progress-height-large:             14px;
    --progress-color:                    var(--gray-lite-4);
    --progress-color-primary:            var(--color-primary);
    --progress-color-secondary:          var(--color-secondary);
    --progress-color-success:            var(--color-success);
    --progress-color-danger:             var(--color-danger);
    --progress-color-warning:            var(--color-warning);
    --progress-color-info:               var(--color-info);
    --progress-circle-size:              80px;
    --progress-circle-thickness:         6px;
    --progress-label-size:               var(--note-size);
    --progress-label-color:              var(--gray);
    --progress-stripe-size:              20px;
    --progress-animation-duration:       1s;
    --progress-indeterminate-duration:   1.5s;
}
```