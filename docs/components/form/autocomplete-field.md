---
title: AutocompleteField
description: Text input with suggestions from a data source, with debounce and async support
---

# AutocompleteField

```javascript
import { AutocompleteField } from 'native-document/components';

AutocompleteField(name, props?)
```

## Default Renderer

```javascript
import { AutocompleteFieldRender } from 'native-document/ui';

AutocompleteField.use(AutocompleteFieldRender);
```

## Methods

| Method | Parameters | Description |
|---|---|---|
| `.source(dataSource)` | `dataSource: *[] \| ObservableArray \| (query: string) => Promise<*[]>` | Static array, reactive array, or async function |
| `.labelKey(key)` | `key: string` | Property to display in the suggestion list. Default `'label'` |
| `.valueKey(key)` | `key: string` | Property to use as the bound value. Default `'id'` |
| `.minChars(n)` | `n: number` | Minimum characters before triggering source. Default `2` |
| `.debounce(ms)` | `ms: number` | Wait after typing stops before calling source. Default `300` |
| `.maxResults(n)` | `n: number` | Maximum number of suggestions shown. Default `10` |
| `.clearable()` | - | Show a clear button |
| `.required(message?)` | `message?: string` | Validation - field required |
| `.oneOf(values, message?)` | `values: *[]`, `message?: string` | Restrict value to a predefined list |
| `.onSelect(handler)` | `handler: (item) => void` | Fired when a suggestion is selected |
| `.renderItem(fn)` | `fn: (item) => NdChild` | Custom suggestion item renderer |

## Static source example

```javascript
const country = Observable(null);

AutocompleteField('country')
    .label('Country')
    .model(country)
    .source(Observable.array(countries))
    .labelKey('name')
    .valueKey('code')
    .placeholder('Search country...')
    .minChars(1)
    .required()
```

## Async source example

```javascript
const userId = Observable(null);

AutocompleteField('user')
    .label('Assign to')
    .model(userId)
    .source(async (query) => {
        const res = await fetch(`/api/users?q=${query}`);
        return res.json();
    })
    .labelKey('name')
    .valueKey('id')
    .minChars(2)
    .debounce(300)
    .maxResults(8)
    .renderItem(($user) =>
        HStack([
            Avatar($user.avatar).small(),
            VStack([
                Span($user.name),
                Span({ class: 'text-sm text-muted' }, $user.email)
            ]).spacing(2)
        ]).spacing(8)
    )
    .onSelect((item) => console.log('Selected:', item.name))
```
