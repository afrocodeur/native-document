---
title: Form Fields
description: Overview of all form field components and the shared Field API
---

# Form Fields

NativeDocument provides a complete set of form field components. All fields extend `Field` which provides a consistent API for binding, validation, labels, and rendering.

```javascript
import { Field } from 'native-document/components';
import { FieldRender } from 'native-document/ui';

Field.use(FieldRender);
```

---

## Shared Field API

All form fields share the following methods:

### Binding

```javascript
.model(observable)
.bind(observable)  // alias
.default('value')
```

### Labels & hints

```javascript
.label('Email address')
.placeholder('you@example.com')
.help('We will never share your email.')
.hint('Required')
```

### State

```javascript
.disabled(Observable(false))
.readonly(true)
.clearable()
```

### Slots

```javascript
.leading(Icon)        // prefix
.trailing(Icon)       // suffix
.bottom(Div('hint'))  // below the input
```

### HTML attributes

```javascript
.wrapperProps({ class: 'form-group' })
.inputProps({ autocomplete: 'off' })
.labelProps({ class: 'form-label' })
.errorProps({ class: 'invalid-feedback' })
.hintProps({ class: 'form-text' })
```

### Validation

```javascript
.required('This field is required')
.requiredIf(condition, 'Required when condition is true')
.custom((value, allValues) => {
    if (value.startsWith('bad')) {
        return 'Value cannot start with "bad"';
    }
    return true; // pass
})
.validateOn('blur')     // 'blur' | 'input' | 'change'
.clearErrorOn('focus')  // 'focus' | 'input'
.setError('Server-side error')
.showErrors()
.hideErrors()
.validate(allValues)    // returns true | false
```

### Observables on `$description`

```javascript
field.$description.hasErrors  // Observable<boolean>
field.$description.errors     // ObservableArray
field.$description.isDirty    // Observable<boolean>
field.$description.isTouched  // Observable<boolean>
field.$description.focus      // Observable<boolean>
```

---

## Available Fields

| File | Components |
|---|---|
| [String Field](./string-field.md) | `StringField`, `EmailField`, `PasswordField`, `TelField`, `UrlField`, `HiddenField` |
| [Number Field](./number-field.md) | `NumberField`, `RangeField` |
| [Textarea Field](./textarea-field.md) | `TextAreaField` |
| [Date Field](./date-field.md) | `DateField`, `TimeField` |
| [Select Field](./select-field.md) | `SelectField` |
| [Autocomplete Field](./autocomplete-field.md) | `AutocompleteField` |
| [Checkbox Field](./checkbox-field.md) | `CheckboxField` |
| [Checkbox Group Field](./checkbox-group-field.md) | `CheckboxGroupField` |
| [Radio Field](./radio-field.md) | `RadioField` |
| [Color Field](./color-field.md) | `ColorField` |
| [File Field](./file-field.md) | `FileField` + all modes |
| [Image Field](./image-field.md) | `ImageField` |
| [Slider](./slider.md) | `Slider` |
| [Field Collection](./field-collection.md) | `FieldCollection` |
| [Form Control](./form-control.md) | `FormControl` |
