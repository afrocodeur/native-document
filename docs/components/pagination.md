---
title: Pagination
description: Standalone pagination component with first/last, ellipsis, and custom renderers
---

# Pagination

```javascript
import { Pagination } from 'native-document/components';

Pagination(props?)
```

Standalone pagination. Also built into `DataTable`.

## Default Renderer

```javascript
import { PaginationRender } from 'native-document/ui';

Pagination.use(PaginationRender);
```

## Methods

```javascript
// State
.currentPage(Observable(1))
.totalPages(Observable(10))
.totalItems(Observable(200))
.pageSize(20)
.disabled(Observable(false))

// Display
.siblingCount(1)      // pages shown around current page
.boundaryCount(1)     // pages shown at start and end
.showFirstLast()
.showPreviousNext()

// Navigation (programmatic)
.goToPage(3)
.next()
.previous()
.first()
.last()
.hasNext()
.hasPrevious()

// Events
.onPageChange((page) => fetchData(page))
.onChange((page) => fetchData(page))  // alias

// Custom renderers
.renderPage(($page) => Button($page.label))
.renderEllipsis(() => Span('...'))
.renderPrevious(() => Span('Prev'))
.renderNext(() => Span('Next'))
.renderFirst(() => Span('First'))
.renderLast(() => Span('Last'))
```

## Example

```javascript
const page  = Observable(1);
const total = Observable(50);

Pagination()
    .currentPage(page)
    .totalPages(total)
    .siblingCount(2)
    .showFirstLast()
    .onPageChange((p) => {
        page.set(p);
        fetchUsers(p);
    })
```

---

## Theming

```css
:root {
    --pagination-gap:       var(--space-cozy);
    --pagination-font-size: var(--description-size);
    --page-size:            36px;
    --page-radius:          var(--radius-button);
    --page-color:           var(--text-color);
    --page-bg-hover:        var(--gray-lite-5);
    --page-bg-active:       var(--color-primary);
    --page-color-active:    var(--white);
    --page-color-disabled:  var(--gray-lite-2);
}
```