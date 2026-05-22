---
title: FormControl
description: Form container with group validation, error handling, and submit management
---

# FormControl

```javascript
import { FormControl } from 'native-document/components';
```

## Default Renderer

```javascript
import { FormControlRender } from 'native-document/ui';

FormControl.use(FormControlRender);
```

## Methods

```javascript
// Fields
.fields((group) => {
    group.add(StringField('name').label('Name').required())
    group.add(EmailField('email').label('Email').required())
})
.get(fieldName)          // get a field instance by name

// Layout
.layout(($description) => Div($description.fields))

// Validation
.validate(allValues?)    // returns Promise<boolean>
.trigger(...fieldNames)  // trigger specific fields
.errorsMode('inline')    // 'inline' | 'summary' | 'both'
.errorsAtTop()
.errorsAtBottom()
.errorsPosition(position)
.renderErrors(($description) => element)
.dispatchErrors(mapper?)
.summarizeErrors()
.dispatchAndSummarize(mapper?)
.dispatchServerErrors(error)

// State
.disable(fieldName?)    // disable all or specific field
.enable(fieldName?)
.reset()
.resetField(name)

// Values
.values()               // returns { name: value } object

// Watch
.watch(fieldName, (value) => console.log(value))

// Submit
.onSubmit((values) => {})
.onPreventSubmit((values) => {})
.onDebouncedSubmit((values) => {}, delay?)
.onSuccess((values) => {})
.onError((error) => {})
.onChange((values) => {})
.onReset(() => {})
.submit(event?)
```

## Example

```javascript
const control = FormControl()
    .fields((group) => {
        group.add(StringField('name').label('Name').required())
        group.add(EmailField('email').label('Email').required())
        group.add(PasswordField('password').label('Password').required().minLength(8))
    })
    .onSubmit(async (values) => {
        const valid = await control.validate();
        if (valid) {
            await createUser(values);
        }
    })
    .onError((error) => {
        control.dispatchErrors(error);
    })
```
