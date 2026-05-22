---
title: RadioField
description: Group of radio buttons where only one can be selected
---

# RadioField

```javascript
import { RadioField } from 'native-document/components';

RadioField(name, props?)
```

## Default Renderer

```javascript
import { RadioFieldRender } from 'native-document/ui';

RadioField.use(RadioFieldRender);
```

## Methods

| Method | Parameters | Description |
|---|---|---|
| `.model(observable)` | `observable: Observable` | Two-way binding - value of the selected option |
| `.label(text)` | `text: NdChild` | Label for the field group |
| `.disabled(val)` | `val: boolean \| Observable<boolean>` | Disable the field |
| `.option(value, label, props?)` | `value: *`, `label: NdChild`, `props?: object` | Add a radio option |
| `.options(items)` | `items: { value, label }[]` | Add multiple options at once |
| `.layout(type)` | `'vertical' \| 'horizontal' \| 'grid'` | Layout of the radio buttons. Default `'vertical'` |
| `.vertical()` | - | Shorthand for `.layout('vertical')` |
| `.horizontal()` | - | Shorthand for `.layout('horizontal')` |
| `.grid()` | - | Shorthand for `.layout('grid')` |
| `.required(message?)` | `message?: string` | Validation - field required |
| `.checked()` | - | Returns the current checked value (getter) |

## Example

```javascript
const plan = Observable('monthly');

RadioField('plan')
    .label('Choose a plan')
    .model(plan)
    .option('monthly',  'Monthly - $9/mo')
    .option('yearly',   'Yearly - $99/yr')
    .option('lifetime', 'Lifetime - $299')
    .horizontal()
    .required('Please select a plan')
```
