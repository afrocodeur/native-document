---
title: FieldCollection
description: Dynamic list of repeatable field groups with add, remove, and validation
---

# FieldCollection

```javascript
import { FieldCollection } from 'native-document/components';
```

## Default Renderer

```javascript
import { FieldCollectionRender } from 'native-document/ui';

FieldCollection.use(FieldCollectionRender);
```

## Methods

```javascript
// Fields definition
.fields((group) => {
    return {
        name: StringField('name').label('Name').required(),
        email: EmailField('email').label('Email')
    }
})

// Default item value
.data({ name: '', email: '' })

// Binding
.model(contacts)

// Render
.renderItem((fields, index, remove) => element)
.renderAdd(() => element)

// Animation
.transition('fade')

// Programmatic
.add()
.remove(item)
.clear()
.reset()
.value()     // get all values
.count()
.isEmpty()

// Validation
.min(count, message?)
.max(count, message?)
.validate(allValues?)

// Events
.onChange((items) => console.log(items))
.onAdd((item) => console.log('Added'))
.onRemove((item) => console.log('Removed'))
```

