---
title: SimpleTable
description: Lightweight table component for static or observable data with custom cell renderers
---

# SimpleTable

```javascript
import { SimpleTable } from 'native-document/components';

SimpleTable(props?)
```

A lightweight table for static or observable data.

## Default Renderer

```javascript
import { SimpleTableRender } from 'native-document/ui';

SimpleTable.use(SimpleTableRender);
```

## Methods

| Method | Parameters | Description |
|---|---|---|
| `.column(key, title, props?, callback?)` | `key: string`, `title: string`, `props?: object`, `callback?: (value, row) => element` | Add a column. `callback` renders a custom cell. |
| `.group(title, fn)` | `title: string`, `fn: (group) => void` | Group columns under a shared header. |
| `.data(data)` | `data: array \| ObservableArray` | Static array or reactive observable array |
| `.empty(element)` | `element: NdChild` | Content shown when data is empty |
| `.noHeader()` | - | Hide the table header row |
| `.onRowClick(handler)` | `handler: (row) => void` | Fired when a row is clicked |
| `.rowProps(fn)` | `fn: (row) => object` | Dynamic HTML attributes per row |

## Example

```javascript
SimpleTable()
    .column('name',  'Name')
    .column('email', 'Email')
    .column('role',  'Role', {}, (value) => Badge(value).primary())
    .column('actions', '', {}, (value, row) =>
        HStack([
            Button('Edit')
                .small()
                .nd.onClick(() => edit(row)),
            Button('Delete')
                .small()
                .danger()
                .nd.onClick(() => remove(row))
        ]).spacing(4)
    )
    .data(users)
    .empty(Div('No users found'))
    .onRowClick((row) => openUserDetail(row))
```

## Column Groups

Group related columns under a shared header:

```javascript
SimpleTable()
    .column('name', 'Name')
    .group('Address', (group) => {
        group.column('city',    'City')
        group.column('country', 'Country')
        group.column('zip',     'ZIP')
    })
    .column('actions', '', {}, (value, row) => Button('Edit').small())
    .data(users)
```

---

## SimpleTable vs DataTable

| | SimpleTable | DataTable |
|---|---|---|
| **Sorting** | Manual | Built-in |
| **Filtering / Search** | Manual | Built-in |
| **Pagination** | Manual | Built-in |
| **Selection** | No | Yes |
| **Server-side** | Manual | Built-in |
| **Use when** | Small static or observable list | Large dataset with sort/filter/pagination |

See **[DataTable](./data-table.md)** for the full-featured alternative.


---

## Theming

```css
:root {
    --simple-table-font-size:       var(--description-size);
    --simple-table-cell-padding-v:  var(--space-cozy);
    --simple-table-cell-padding-h:  var(--space-comfortable);
    --simple-table-border-color:    var(--color-border-tertiary);
    --simple-table-header-color:    var(--color-text-secondary);
    --simple-table-header-bg:       var(--color-background-secondary);
    --simple-table-header-weight:   600;
    --simple-table-hover-bg:        var(--color-background-secondary);
    --simple-table-empty-color:     var(--color-text-secondary);
}
```