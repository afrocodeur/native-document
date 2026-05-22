---
title: String Fields
description: StringField, EmailField, PasswordField, TelField, UrlField, HiddenField
---

# String Fields

```javascript
import {
    StringField, EmailField, PasswordField,
    TelField, UrlField, HiddenField
} from 'native-document/components';
```

## Default Renderers

```javascript
import {
    StringFieldRender, EmailFieldRender, PasswordFieldRender,
    TelFieldRender, UrlFieldRender, HiddenFieldRender
} from 'native-document/ui';

StringField.use(StringFieldRender);
EmailField.use(EmailFieldRender);
PasswordField.use(PasswordFieldRender);
TelField.use(TelFieldRender);
UrlField.use(UrlFieldRender);
HiddenField.use(HiddenFieldRender);
```

---

## `StringField`

```javascript
StringField('username')
    .label('Username')
    .placeholder('Choose a username')
    .model(username)
    .required()
    .minLength(3, 'At least 3 characters')
    .maxLength(20)
    .pattern(/^[a-z0-9_]+$/, 'Lowercase, numbers, underscores only')
```

### Additional methods

```javascript
.minLength(min, message?)
.maxLength(max, message?)
.length(exact, message?)
.pattern(regex, message?)
.alphaOnly(message?)
.numericOnly(message?)
.alphaNumeric(message?)
.noSpaces(message?)
.lowercase(message?)
.uppercase(message?)
```

---

## `EmailField`

```javascript
EmailField('email')
    .label('Email')
    .model(email)
    .required()
    .allowedDomain(['company.com'], 'Only company emails allowed')
```

### Additional methods

```javascript
.email(message?)
.allowedDomain(domains, message?)
.notAllowedDomain(domains, message?)
```

---

## `PasswordField`

```javascript
PasswordField('password')
    .label('Password')
    .model(password)
    .required()
    .minLength(8)
    .strong('Password is too weak')
    .visibilityToggle()
    .showStrengthMeter()
```

### Additional methods

```javascript
.strong(message?)
.containsNumber(message?)
.containsUppercase(message?)
.containsLowercase(message?)
.containsSpecialChar(message?)
.visibilityToggle(enabled?, icons?)
.visibilityIcons(showIcon, hideIcon)
.showStrengthMeter()
.strengthLabels({ weak, fair, good, strong })
.same(fieldName, message?)      // must match another field
.different(fieldName, message?) // must differ from another field
```

---

## `TelField`

```javascript
TelField('phone').label('Phone').model(phone)
```

---

## `UrlField`

```javascript
UrlField('website').label('Website').model(url)
```

---

## `HiddenField`

```javascript
HiddenField('csrf').model(csrfToken)
```
