---
title: TextAreaField
description: Multi-line text input with auto-grow and character counter
---

# TextAreaField

```javascript
import { TextAreaField } from 'native-document/components';

TextAreaField(name, props?)
```

## Default Renderer

```javascript
import { TextAreaFieldRender } from 'native-document/ui';

TextAreaField.use(TextAreaFieldRender);
```

## Methods

All shared Field methods apply (`model`, `label`, `placeholder`, `required`, `disabled`, `readonly`, `minLength`, `maxLength`…), plus:

| Method | Parameters | Description |
|---|---|---|
| `.rows(n)` | `n: number` | Number of visible rows |
| `.cols(n)` | `n: number` | Number of visible columns |
| `.resize(type)` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | CSS resize behavior |
| `.autoGrow(enabled?)` | `enabled?: boolean` | Grow height automatically as content increases |
| `.characterCounter(enabled?)` | `enabled?: boolean` | Show current / max character count |
| `.wordCount(min?, max?, message?)` | `min?: number`, `max?: number`, `message?: string` | Validate word count |

## Example

```javascript
TextAreaField('message')
    .label('Message')
    .placeholder('Write your message...')
    .model(message)
    .required()
    .rows(5)
    .autoGrow()
    .characterCounter()
    .maxLength(500)
```

## Validation example

```javascript
const bio = Observable('');

TextAreaField('bio')
    .label('About you')
    .placeholder('Tell us about yourself...')
    .model(bio)
    .required('Bio is required')
    .minLength(20, 'At least 20 characters')
    .maxLength(500)
    .rows(4)
    .autoGrow()
    .characterCounter()
    .resize('none')
```
