---
title: Number Fields
description: NumberField and RangeField for numeric input
---

# Number Fields

```javascript
import { NumberField, RangeField } from 'native-document/components';
```

## Default Renderers

```javascript
import { NumberFieldRender, RangeFieldRender } from 'native-document/ui';

NumberField.use(NumberFieldRender);
RangeField.use(RangeFieldRender);
```

---

## `NumberField`

```javascript
NumberField('quantity')
    .label('Quantity')
    .model(quantity)
    .min(1, 'Minimum 1')
    .max(100, 'Maximum 100')
    .step(1)
    .required()
```

### Additional methods

```javascript
.min(value, message?)
.max(value, message?)
.between(min, max, message?)
.integer(message?)
.positive(message?)
.unsigned(message?)   // alias for positive
.negative(message?)
.multipleOf(n, message?)
.step(value)
.decimals(count?)
.prefix(text)
.suffix(text)
```

---

## `RangeField`

A range slider bound to a field model.

```javascript
RangeField('volume')
    .label('Volume')
    .model(volume)
    .min(0)
    .max(100)
    .step(5)
```
