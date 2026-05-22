---
title: SelectField
description: Select dropdown with search, multiple selection, groups, and custom item rendering
---

# SelectField

```javascript
import { SelectField } from 'native-document/components';

SelectField(name, props?)
```

## Default Renderer

```javascript
import { SelectFieldRender } from 'native-document/ui';

SelectField.use(SelectFieldRender);
```

## Methods

### Options

```javascript
.option(value, label, props?)
.option('fr', 'France')
.option('de', 'Germany', { disabled: true })
.options([
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' }
])
.options(Observable.array([...]))  // reactive
```

### Groups

```javascript
.groups([
    {
        label: 'Europe',
        options: [
            { value: 'fr', label: 'France' },
            { value: 'de', label: 'Germany' }
        ]
    },
    {
        label: 'Africa',
        options: [
            { value: 'sn', label: 'Senegal' }
        ]
    }
])
```

### Multiple selection

```javascript
.multiple()
.multipleDisplayAsText()          // "France, Germany"
.multipleDisplayAsTags()          // tag chips
.multipleDisplayAsCount()         // "3 selected"
.multipleDisplayAsTruncate(2)     // "France, Germany +1"
.removeSelected()                 // hide selected options from the list
```

### Binding & behavior

```javascript
.model(Observable(null))          // single selection
.model(Observable([]))            // multiple selection
.searchable()
.searchable(true, 'Search...')
.clearable()
.disabled(Observable(false))
.onChange((value) => console.log(value))
```

### Custom rendering

```javascript
.renderItem(($option) =>
    HStack([
        Img({ src: `/flags/${$option.value}.svg`, width: 20 }),
        Span($option.label)
    ]).spacing(8)
)
.selectedLabelRender(($option) => `${$option.label} (${$option.value})`)
.countRender((count) => `${count} countries selected`)
.truncateRender((visible, hidden) => `${visible} +${hidden} more`)
```

## Example

```javascript
SelectField('country')
    .label('Country')
    .model(country)
    .searchable()
    .clearable()
    .options(countriesList)
    .required('Please select a country')
    .onChange((value) => loadRegions(value))
```

## Multiple selection example

```javascript
const selected = Observable([]);

SelectField('tags')
    .label('Tags')
    .model(selected)
    .multiple()
    .multipleDisplayAsTags()
    .removeSelected()
    .options([
        { value: 'js',  label: 'JavaScript' },
        { value: 'ts',  label: 'TypeScript' },
        { value: 'py',  label: 'Python' },
    ])
```
