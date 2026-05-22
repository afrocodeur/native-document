---
title: CheckboxGroupField
description: Multiple checkboxes where the value is an array of selected values
---

# CheckboxGroupField

```javascript
import { CheckboxGroupField } from 'native-document/components';

CheckboxGroupField(name, props?)
```

## Default Renderer

```javascript
import { CheckboxGroupFieldRender } from 'native-document/ui';

CheckboxGroupField.use(CheckboxGroupFieldRender);
```

## Methods

| Method | Parameters | Description |
|---|---|---|
| `.model(observable)` | `observable: Observable<*[]>` | Two-way binding - array of selected values |
| `.label(text)` | `text: NdChild` | Label for the field group |
| `.disabled(val)` | `val: boolean \| Observable<boolean>` | Disable the field |
| `.option(value, label, props?)` | `value: *`, `label: NdChild`, `props?: object` | Add a checkbox option |
| `.options(items)` | `items: { value, label }[]` | Add multiple options at once |
| `.layout(type)` | `'vertical' \| 'horizontal' \| 'grid'` | Layout of the checkboxes. Default `'vertical'` |
| `.vertical()` | - | Shorthand for `.layout('vertical')` |
| `.horizontal()` | - | Shorthand for `.layout('horizontal')` |
| `.grid()` | - | Shorthand for `.layout('grid')` |
| `.required(message?)` | `message?: string` | Validation - at least one must be selected |
| `.minChecked(n, message?)` | `n: number`, `message?: string` | Minimum number of selections |
| `.maxChecked(n, message?)` | `n: number`, `message?: string` | Maximum number of selections |
| `.exactChecked(n, message?)` | `n: number`, `message?: string` | Exact number of selections required |

## Example

```javascript
const interests = Observable([]);

CheckboxGroupField('interests')
    .label('Select your interests')
    .model(interests)
    .option('frontend', 'Frontend')
    .option('backend',  'Backend')
    .option('devops',   'DevOps')
    .option('mobile',   'Mobile')
    .grid()
    .minChecked(1, 'Select at least one interest')
```
