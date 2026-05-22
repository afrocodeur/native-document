---
title: Form Fields
description: Complete form field components with built-in validation - StringField, EmailField, PasswordField, NumberField, TextAreaField, DateField, TimeField, ColorField, RangeField, ImageField, AutocompleteField, HiddenField, FieldCollection, FormControl
---

# Form Fields

```javascript
import {
    Field, FormControl, FieldCollection,
    StringField, EmailField, PasswordField,
    NumberField, TelField, UrlField, HiddenField,
    TextAreaField, ColorField, DateField, TimeField,
    RangeField, ImageField, AutocompleteField
} from '@native-document/components';
```

All form fields extend `Field`, which provides a consistent API for labels, validation, binding, and rendering.

---

## `Field` - Base API

All fields share these methods:

### Binding

```javascript
.model(observable)  // two-way binding - alias: .bind()
.default('value')   // default value
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
.clearable()   // show clear button
```

### Slots

```javascript
.leading(Icon)   // prefix content
.trailing(Icon)  // suffix content
.bottom(Div('Helper text'))
```

### Element props

```javascript
.wrapperProps({ class: 'form-group' })
.inputProps({ class: 'form-control', autocomplete: 'off' })
.labelProps({ class: 'form-label' })
.errorProps({ class: 'invalid-feedback' })
.hintProps({ class: 'form-text' })
```

### Validation

All fields use `HasValidation`:

```javascript
.required('This field is required')
.requiredIf(condition, 'Required when condition is true')
.custom((value, allValues) => {
    if (value.startsWith('bad')) {
        return 'Value cannot start with "bad"';
    }
    return true; // pass
})
.validateOn('blur')    // 'blur' | 'input' | 'change' (default: 'blur')
.clearErrorOn('focus') // 'focus' | 'input' (default: 'focus')
.showErrors()
.hideErrors()
.setError('Server-side error message')
.validate(allValues)   // returns true | errors array
```

### Observables

```javascript
field.value()               // get current value
field.setValue('new value')
field.$description.hasErrors   // Observable<boolean>
field.$description.errors      // ObservableArray
field.$description.isDirty     // Observable<boolean>
field.$description.isTouched   // Observable<boolean>
field.$description.focus       // Observable<boolean>
```

---

## Text Fields

### `StringField(name, type?, props?)`

General text input. Type defaults to `'text'`.

```javascript
StringField('username')
    .label('Username')
    .placeholder('Choose a username')
    .model(username)
    .required()
    .minLength(3, 'At least 3 characters')
    .maxLength(20)
    .pattern(/^[a-z0-9_]+$/, 'Lowercase, numbers, underscores only')
    .nd
```

### `EmailField(name)`

```javascript
EmailField('email').label('Email').model(email).required().nd
```

### `PasswordField(name)`

```javascript
PasswordField('password')
    .label('Password')
    .model(password)
    .required()
    .minLength(8)
    .showToggle()        // show/hide password button
    .strengthIndicator() // password strength meter
    .nd
```

### `TelField(name)` / `UrlField(name)` / `HiddenField(name)`

```javascript
TelField('phone').label('Phone').model(phone).nd
UrlField('website').label('Website').model(url).nd
HiddenField('csrf').model(csrfToken).nd
```

---

## `TextAreaField(name)`

```javascript
TextAreaField('message')
    .label('Message')
    .placeholder('Write your message...')
    .model(message)
    .required()
    .minLength(10)
    .maxLength(500)
    .rows(5)
    .autoResize()
    .nd
```

---

## `NumberField(name)`

```javascript
NumberField('quantity')
    .label('Quantity')
    .model(quantity)
    .min(1, 'Minimum 1')
    .max(100, 'Maximum 100')
    .step(1)
    .nd
```

---

## `DateField(name)` / `TimeField(name)`

```javascript
DateField('birthdate')
    .label('Date of birth')
    .model(birthdate)
    .min('1900-01-01')
    .max(new Date())
    .format('DD/MM/YYYY')
    .nd

TimeField('appointment')
    .label('Time')
    .model(time)
    .min('09:00')
    .max('18:00')
    .clearable()
    .nd
```

---

## `ColorField(name)`

```javascript
ColorField('brandColor')
    .label('Brand Color')
    .model(color)
    .format('hex')  // 'hex' | 'rgb' | 'hsl'
    .nd
```

---

## `RangeField(name)`

```javascript
RangeField('volume')
    .label('Volume')
    .model(volume)
    .min(0)
    .max(100)
    .step(5)
    .showValue()
    .nd
```

---

## `ImageField(name)`

Image upload with preview:

```javascript
ImageField('cover')
    .label('Cover Image')
    .model(imageUrl)
    .accept(['image/jpeg', 'image/png'])
    .maxSize(5 * 1024 * 1024)
    .preview()
    .nd
```

---

## `AutocompleteField(name)`

```javascript
AutocompleteField('country')
    .label('Country')
    .model(country)
    .source(Observable.array(countries))
    .searchKey('name')
    .valueKey('code')
    .placeholder('Search country...')
    .minChars(2)
    .nd
```

---

## `FormControl` - Form Container

`FormControl` wraps multiple fields and provides group validation:

```javascript
FormControl(props?)
    .field(StringField('name').label('Name').required())
    .field(EmailField('email').label('Email').required())
    .field(PasswordField('password').label('Password').required())
    .onSubmit(async (values) => {
        const valid = await control.validate();
        if (valid) {
            await createUser(values);
        }
    })
    .nd
```

### Methods

```javascript
.field(fieldInstance)         // add a field
.fields([field1, field2])
.validate()                   // validate all fields, returns true | false
.reset()                      // reset all fields
.values()                     // get { name: value } object
.getField('name')             // get field by name
.onSubmit((values) => {})
.onReset(() => {})
.props({ class: 'form' })
```

---

## `FieldCollection` - Repeatable Fields

A dynamic list of field groups that the user can add/remove:

```javascript
FieldCollection('contacts')
    .fields((group) => {
        group.add(StringField('name').label('Name').required())
        group.add(EmailField('email').label('Email'))
    })
    .data({ name: '', email: '' })   // default item
    .model(contacts)
    .renderAdd(() => Button('+ Add contact').ghost().nd)
    .renderItem(($item, index, remove) =>
        HStack([
            $item.name.nd,
            $item.email.nd,
            Button('Remove').danger().small().nd.onClick(() => remove())
        ]).spacing(8).nd
    )
    .nd
```


---

## Theming

Tokens partagés par tous les champs (`StringField`, `NumberField`, `TextAreaField`, etc.) :

```css
:root {
    --field-gap:                        var(--space-cozy);
    --field-font-size:                  var(--description-size);
    --field-label-size:                 var(--note-size);
    --field-label-color:                var(--text-color);
    --field-label-weight:               500;
    --field-input-height:               36px;
    --field-input-padding:              0 var(--space-comfortable);
    --field-input-radius:               var(--radius-button);
    --field-input-border:               var(--gray-lite-3);
    --field-input-border-focus:         var(--color-primary);
    --field-input-bg:                   var(--background);
    --field-input-color:                var(--text-color);
    --field-input-placeholder-color:    var(--gray-lite-2);
    --field-input-disabled-bg:          var(--gray-lite-5);
    --field-input-disabled-color:       var(--gray-lite-2);
    --field-error-size:                 var(--note-size);
    --field-error-color:                var(--color-danger);
    --field-hint-size:                  var(--note-size);
    --field-hint-color:                 var(--gray);
}
```

Tokens spécifiques au `Slider` / `RangeField` :

```css
:root {
    --slider-track-height:      4px;
    --slider-thumb-size:        18px;
    --slider-fill-color:        var(--color-primary);
    --slider-track-color:       var(--gray-lite-4);
    --slider-thumb-color:       var(--background);
    --slider-thumb-border:      var(--slider-fill-color);
    --slider-vertical-height:   200px;
}
```

Tokens spécifiques à `FileAvatarMode` :

```css
:root {
    --file-avatar-radius-circle: 50%;
    --file-avatar-radius-square: 12px;
    --file-avatar-badge-size:    26px;
}
```