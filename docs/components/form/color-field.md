---
title: ColorField
description: Color picker field with format options and presets
---

# ColorField

```javascript
import { ColorField } from 'native-document/components';

ColorField(name, props?)
```

## Default Renderer

```javascript
import { ColorFieldRender } from 'native-document/ui';

ColorField.use(ColorFieldRender);
```

## Methods

All shared Field methods apply, plus:

| Method | Parameters | Description |
|---|---|---|
| `.format(type)` | `'hex' \| 'rgb'` | Output format |
| `.presets(colors)` | `colors: string[]` | Array of preset color strings shown as swatches |
| `.hex(message?)` | `message?: string` | Validate that the value is a valid hex color |
| `.rgb(message?)` | `message?: string` | Validate that the value is a valid RGB color |

## Example

```javascript
ColorField('brandColor')
    .label('Brand Color')
    .model(color)
    .format('hex')
    .presets(['#3b82f6', '#10b981', '#f59e0b', '#ef4444'])
```

## Reactive theme example

```javascript
import { Store } from 'native-document';

const ThemeStore = Store.group('theme', (g) => {
    g.createPersistent('primary', '#3b82f6');
    g.createPersistent('accent',  '#10b981');
});

ColorField('primary')
    .label('Primary color')
    .model(ThemeStore.use('primary'))
    .format('hex')
    .presets(['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'])

ColorField('accent')
    .label('Accent color')
    .model(ThemeStore.use('accent'))
    .format('hex')
    .presets(['#10b981', '#14b8a6', '#22c55e', '#84cc16'])
```
