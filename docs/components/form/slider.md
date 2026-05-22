---
title: Slider
description: Range input component with single value, range mode, marks, and tooltips
---

# Slider

```javascript
import { Slider } from 'native-document/components';

Slider(name, props?)
```

## Default Renderer

```javascript
import { SliderFieldRender } from 'native-document/ui';

Slider.use(SliderFieldRender);
```

## Methods

### Value

| Method | Parameters | Description |
|---|---|---|
| `.model(observable)` | `observable: Observable<number>` | Two-way binding for single value |
| `.modelStart(observable)` | `observable: Observable<number>` | Two-way binding for range start |
| `.modelEnd(observable)` | `observable: Observable<number>` | Two-way binding for range end |
| `.defaultValue(value)` | `value: number` | Initial value |
| `.range(enabled?)` | `enabled?: boolean` | Enable range mode (two handles) |
| `.min(value)` | `value: number` | Minimum value |
| `.max(value)` | `value: number` | Maximum value |
| `.step(value)` | `value: number` | Step increment |

### Display

| Method | Parameters | Description |
|---|---|---|
| `.showValue(enabled?)` | `enabled?: boolean` | Display the current value |
| `.showTooltip(enabled?)` | `enabled?: boolean` | Show tooltip on the handle |
| `.tooltipFormat(fn)` | `fn: (value) => string` | Format the tooltip value |
| `.renderTooltip(fn)` | `fn: ($description) => NdChild` | Custom tooltip renderer |
| `.renderThumb(fn)` | `fn: ($description) => NdChild` | Custom thumb renderer |
| `.renderCursor(fn)` | `fn: ($description) => NdChild` | Custom cursor renderer |

### Marks

| Method | Parameters | Description |
|---|---|---|
| `.marks(marks)` | `marks: { value, label }[]` | Define tick marks |
| `.showMarks(enabled?)` | `enabled?: boolean` | Show tick marks |
| `.snapToMarks(enabled?)` | `enabled?: boolean` | Snap handle to nearest mark |

### Style

| Method | Parameters | Description |
|---|---|---|
| `.primary()` | - | Primary color variant |
| `.secondary()` | - | Secondary color variant |
| `.success()` | - | Success color variant |
| `.warning()` | - | Warning color variant |
| `.danger()` | - | Danger color variant |
| `.info()` | - | Info color variant |
| `.color(hex)` | `hex: string` | Custom handle color |
| `.trackColor(hex)` | `hex: string` | Custom track color |
| `.fillColor(hex)` | `hex: string` | Custom fill color |
| `.fullColor(hex)` | `hex: string` | Color for the full track |

### Layout

| Method | Parameters | Description |
|---|---|---|
| `.vertical(enabled?)` | `enabled?: boolean` | Vertical orientation |
| `.height(px)` | `px: number` | Height in px (vertical mode) |
| `.reverse(enabled?)` | `enabled?: boolean` | Reverse the track direction |

### State

| Method | Parameters | Description |
|---|---|---|
| `.disabled(condition?)` | `condition?: boolean \| Observable<boolean>` | Disable the slider |
| `.readonly(condition?)` | `condition?: boolean` | Read-only mode |

### Events

| Method | Parameters | Description |
|---|---|---|
| `.onChange(handler)` | `handler: (value) => void` | Fires on every value change |
| `.onComplete(handler)` | `handler: (value) => void` | Fires when the user releases the handle |

## Example

```javascript
// Single value
const volume = Observable(70);

Slider('volume')
    .model(volume)
    .min(0)
    .max(100)
    .step(5)
    .showTooltip()
    .tooltipFormat((v) => `${v}%`)
    .primary()

// Range
const priceMin = Observable(100);
const priceMax = Observable(500);

Slider('price')
    .range()
    .modelStart(priceMin)
    .modelEnd(priceMax)
    .min(0)
    .max(1000)
    .step(50)
    .showValue()

// Vertical with marks
Slider('temperature')
    .model(Observable(20))
    .min(-10)
    .max(40)
    .vertical()
    .height(200)
    .marks([
        { value: -10, label: '-10' },
        { value: 0,   label: '0'   },
        { value: 20,  label: '20'  },
        { value: 40,  label: '40'  }
    ])
    .showMarks()
    .snapToMarks()
```
