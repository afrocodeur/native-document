---
title: DataTable
description: Full-featured data table with sorting, filtering, search, pagination, selection, export, and server-side support
---

# DataTable

```javascript
import { DataTable } from 'native-document/components';

DataTable(props?)
```

## Default Renderer

```javascript
import { DataTableRender } from 'native-document/ui';
import {
    PaginationRender,
    ButtonRender,
    DropdownRender, DropdownItemRender
} from 'native-document/ui';

DataTable.use(DataTableRender);
Pagination.use(PaginationRender);
Button.use(ButtonRender);
Dropdown.use(DropdownRender);
DropdownItem.use(DropdownItemRender);
```

---

## Columns

### `DataTable.column(key, title, props?, callback?)`

| Parameter | Type | Description |
|---|---|---|
| `key` | `string` | Data property name |
| `title` | `string` | Column header label |
| `props?` | `object` | HTML attributes for the header cell |
| `callback?` | `(column: Column) => void` | Configure the column via the Column API |

```javascript
DataTable()
    .column('name',  'Name')
    .column('email', 'Email')
    .column('role',  'Role', {}, (col) => col.sortable().center())
    .column('actions', '', {}, (col) =>
        col.render((value, row) =>
            Button('Edit').small().nd.onClick(() => edit(row))
        )
    )
```

### `Column` API

| Method | Parameters | Description |
|---|---|---|
| `.sortable(fn?)` | `fn?: (a, b) => number` | Enable sorting. Optional custom sort function. |
| `.searchable()` | - | Include in full-text search |
| `.hidden()` | - | Hidden by default (user can show it) |
| `.visible(condition)` | `condition: boolean \| Observable<boolean>` | Reactive visibility |
| `.align(align)` | `'left' \| 'center' \| 'right'` | Text alignment |
| `.center()` | - | Shorthand for `.align('center')` |
| `.right()` | - | Shorthand for `.align('right')` |
| `.pinned(orientation)` | `'left' \| 'right'` | Pin the column |
| `.pinnedAtLeft()` | - | Shorthand for `.pinned('left')` |
| `.pinnedAtRight()` | - | Shorthand for `.pinned('right')` |
| `.header(template)` | `template: NdChild` | Custom header cell content |
| `.render(fn)` | `fn: (value, row) => NdChild` | Custom cell renderer |
| `.value(fn)` | `fn: (row) => *` | Transform the cell value before render |
| `.onClick(handler)` | `handler: (value, row) => void` | Cell click handler |
| `.colspan(n)` | `n: number` | Cell colspan |
| `.rowspan(n)` | `n: number` | Cell rowspan |
| `.props(props)` | `props: object` | HTML attributes for all cells in this column |

### `DataTable.group(title, callback)` - Column Groups

Group related columns under a shared header:

```javascript
DataTable()
    .column('name', 'Name')
    .group('Address', (group) => {
        group.column('city',    'City')
        group.column('country', 'Country')
    })
    .data(users)
```

---

## Data

| Method | Parameters | Description |
|---|---|---|
| `.data(data)` | `data: ObservableArray` | Reactive data source |
| `.total(obs)` | `obs: Observable<number>` | Total count for server-side pagination |
| `.clientSide()` | - | NativeDocument handles sort, filter, and pagination |
| `.serverSide()` | - | You handle everything via callbacks |
| `.loading(obs)` | `obs: Observable<boolean>` | Show loading state |
| `.error(obs)` | `obs: Observable<*>` | Show error state |
| `.empty(content)` | `content: NdChild` | Content shown when no rows |

---

## Sorting

| Method | Parameters | Description |
|---|---|---|
| `.defaultSort(col, dir?)` | `col: string`, `dir?: 'asc' \| 'desc'` | Initial sort. Default dir: `'asc'` |
| `.multiSort(enabled?)` | `enabled?: boolean` | Allow sorting by multiple columns |
| `.onSort(handler)` | `handler: (col, dir, allSorts) => void` | Fires when sort changes |

---

## Search & Filter

| Method | Parameters | Description |
|---|---|---|
| `.searchable(enabled?)` | `enabled?: boolean` | Enable search input |
| `.filterable(enabled?)` | `enabled?: boolean` | Enable column filters |
| `.defaultFilters(filters)` | `filters: object` | Initial filter values |
| `.onSearch(handler)` | `handler: (query) => void` | Fires on search input |
| `.onFilter(handler)` | `handler: (filters) => void` | Fires when filters change |

---

## Pagination

| Method | Parameters | Description |
|---|---|---|
| `.pagination(pageSize)` | `pageSize: number` | Enable pagination with given page size |
| `.pageSizes(sizes)` | `sizes: number[]` | Page size options for the user |
| `.defaultPage(page)` | `page: number` | Initial page (1-indexed) |
| `.onPage(handler)` | `handler: (page, pageSize) => void` | Fires on page change |
| `.goToPage(page)` | `page: number` | Navigate to a specific page programmatically |

---

## Selection

| Method | Parameters | Description |
|---|---|---|
| `.selectable(enabled?)` | `enabled?: boolean` | Enable row selection |
| `.multiSelect(enabled?)` | `enabled?: boolean` | Allow selecting multiple rows |
| `.selectedRows(obs)` | `obs: ObservableArray` | Bind selected rows to an external observable |
| `.onSelect(handler)` | `handler: (selectedRows) => void` | Fires when selection changes |
| `.clearSelection()` | - | Clear all selected rows programmatically |

---

## Inline Editing

| Method | Parameters | Description |
|---|---|---|
| `.editable(enabled?)` | `enabled?: boolean` | Enable inline cell editing |
| `.onEdit(handler)` | `handler: (row, col, value) => void` | Fires when a cell is saved |
| `.onEditCancel(handler)` | `handler: (row, col) => void` | Fires when editing is cancelled |

---

## Export

| Method | Parameters | Description |
|---|---|---|
| `.export(label, format, filename?)` | `label: NdChild`, `format: 'csv' \| 'xlsx' \| string`, `filename?: string` | Add an export button |
| `.exportFileName(name)` | `name: string` | Default filename for all exports |
| `.onExport(handler)` | `handler: (format, rows) => void` | Custom export handler |

```javascript
DataTable()
    .export('Export CSV',  'csv',  'users.csv')
    .export('Export Excel', 'xlsx', 'users.xlsx')
    .onExport((format, rows) => console.log(format, rows))
```

---

## Expandable Rows

`.expandable(renderFn, expandedIcon?, collapsedIcon?)` - Render additional content below a row when expanded:

```javascript
DataTable()
    .expandable(
        (row) => Div({ class: 'row-detail' }, [
            P(['Email: ', row.email]),
            P(['Joined: ', row.joinedAt])
        ]),
        '▼',  // expanded icon
        '▶'   // collapsed icon
    )
```

---

## Master-Detail

`.masterDetail(renderFn)` - Render a full-width detail panel below the selected row:

```javascript
DataTable()
    .masterDetail((row) =>
        Div({ class: 'detail-panel' }, [
            H2(row.name),
            P(row.bio),
            DataTable()
                .data(row.orders)
                .column('id',    'Order ID')
                .column('total', 'Total')
        ])
    )
```

---

## Bulk Actions

`.bulkActions(actions)` - Actions applied to all selected rows. Requires `.selectable()`:

```javascript
DataTable()
    .selectable()
    .multiSelect()
    .bulkActions([
        { label: 'Delete',   action: (rows) => deleteAll(rows) },
        { label: 'Export',   action: (rows) => exportRows(rows) },
        { label: 'Activate', action: (rows) => activateAll(rows) }
    ])
```

---

## Row Events

| Method | Parameters | Description |
|---|---|---|
| `.onRowClick(handler)` | `handler: (row, event) => void` | Row click |
| `.onRowDoubleClick(handler)` | `handler: (row, event) => void` | Row double-click |
| `.onRowHover(handler)` | `handler: (row, event) => void` | Row hover |
| `.rowProps(fn)` | `fn: (row) => object` | Dynamic HTML attributes per row |

---

## Persistence

`.persist(key, options?)` - Save and restore sort, filters, search, page, and column visibility to localStorage:

| Option | Default | Description |
|---|---|---|
| `include` | `['sort', 'filters', 'search', 'page', 'pageSize', 'columns']` | Which state to persist |
| `storage` | `'localStorage'` | Storage backend |

```javascript
DataTable()
    .persist('users-table')
    .persist('users-table', { include: ['sort', 'pageSize'] })
```

---

## Other

| Method | Parameters | Description |
|---|---|---|
| `.labels(labels)` | `labels: object` | Override UI labels (search placeholder, empty text, etc.) |
| `.layout(fn)` | `fn: ($description, instance) => NdChild` | Fully custom table layout |
| `.refresh()` | - | Re-emit the current state to trigger a server-side reload |
| `.clearFilters()` | - | Clear all filters and search |

---

## Server-side Example

```javascript
const users     = Observable.array([]);
const total     = Observable(0);
const isLoading = Observable(false);

const fetchUsers = async ({ page = 1, pageSize = 20, sort, search } = {}) => {
    isLoading.set(true);
    const res = await API.users.list({ page, pageSize, sort, search });
    users.set(res.data);
    total.set(res.total);
    isLoading.set(false);
};

fetchUsers();

DataTable()
    .serverSide()
    .data(users)
    .total(total)
    .loading(isLoading)
    .column('name',  'Name',  {}, (col) => col.sortable())
    .column('email', 'Email', {}, (col) => col.sortable())
    .column('role',  'Role')
    .pagination(20)
    .pageSizes([10, 20, 50])
    .searchable()
    .selectable()
    .multiSelect()
    .bulkActions([
        { label: 'Delete', action: (rows) => deleteUsers(rows) }
    ])
    .export('CSV', 'csv', 'users.csv')
    .defaultSort('name', 'asc')
    .persist('users-table')
    .onPage((page, size) => fetchUsers({ page, pageSize: size }))
    .onSort((col, dir)   => fetchUsers({ sort: `${col}:${dir}` }))
    .onSearch((query)    => fetchUsers({ search: query }))

```


---

## Theming

```css
:root {
    --data-table-font-size:       var(--description-size);
    --data-table-cell-padding-v:  var(--space-cozy);
    --data-table-cell-padding-h:  var(--space-comfortable);
    --data-table-border-color:    var(--color-border-tertiary);
    --data-table-header-color:    var(--color-text-secondary);
    --data-table-header-bg:       var(--color-background-secondary);
    --data-table-header-weight:   500;
    --data-table-hover-bg:        var(--color-background-secondary);
    --data-table-selected-bg:     var(--color-background-info);
    --data-table-toolbar-bg:      var(--color-background-secondary);
    --data-table-bulk-bg:         var(--color-background-info);
    --data-table-pagination-bg:   var(--color-background-secondary);
    --data-table-spinner-size:    24px;
}
```

---

## Next Steps

- **[SimpleTable](./simple-table.md)** - Lightweight alternative without built-in sort/filter
- **[Pagination](./pagination.md)** - Standalone pagination component
