---
title: Date & Time Fields
description: DateField and TimeField for date and time input
---

# Date & Time Fields

```javascript
import { DateField, TimeField } from 'native-document/components';
```

## Default Renderers

```javascript
import { DateFieldRender, TimeFieldRender } from 'native-document/ui';

DateField.use(DateFieldRender);
TimeField.use(TimeFieldRender);
```

---

## `DateField`

```javascript
DateField('birthdate')
    .label('Date of birth')
    .model(birthdate)
    .minDate(new Date('1900-01-01'))
    .maxDate(new Date())
    .format('DD/MM/YYYY')
    .required()
```

### Additional methods

```javascript
.format(formatString)
.minDate(date)
.maxDate(date)
.min(date, message?)
.max(date, message?)
.between(start, end, message?)
.disabledDates(dates)
.withTime()
.range()
.modelStart(observable)
.modelEnd(observable)
.rangeSeparator(string)
.mondayAsFirstDay()
.sundayAsFirstDay()
.locale(locale)
.timezone(tz)
.useLocalTimezone()
.timeStep(seconds)
.fromToday()
.untilToday()
.onChange(handler)
.onClear(handler)
```

---

## `TimeField`

```javascript
TimeField('appointment')
    .label('Appointment time')
    .model(time)
    .min('09:00', 'Too early')
    .max('18:00', 'Too late')
    .clearable()
```

### Additional methods

```javascript
.format(formatString)
.step(seconds)
.clearable()
.range()
.modelStart(observable)
.modelEnd(observable)
.rangeSeparator(string)
.min(time, message?)
.max(time, message?)
.between(start, end, message?)
.after(time, message?)
.before(time, message?)
.onChange(handler)
.onClear(handler)
```
