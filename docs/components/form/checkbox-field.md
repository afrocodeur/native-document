---
title: CheckboxField
description: Single checkbox with two-way boolean binding
---

# CheckboxField

```javascript
import { CheckboxField } from 'native-document/components';

CheckboxField(name, props?)
```

## Default Renderer

```javascript
import { CheckboxFieldRender } from 'native-document/ui';

CheckboxField.use(CheckboxFieldRender);
```

## Methods

| Method | Parameters | Description |
|---|---|---|
| `.model(observable)` | `observable: Observable<boolean>` | Two-way boolean binding |
| `.label(text)` | `text: NdChild` | Label displayed next to the checkbox |
| `.disabled(val)` | `val: boolean \| Observable<boolean>` | Disable the field |
| `.required(message?)` | `message?: string` | Validation - field required |
| `.checked()` | - | Returns the current checked value (getter) |

## Example

```javascript
const agreed = Observable(false);

CheckboxField('terms')
    .label('I agree to the terms and conditions')
    .model(agreed)
    .required('You must accept the terms')
```
