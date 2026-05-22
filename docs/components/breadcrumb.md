---
title: Breadcrumb
description: Breadcrumb navigation component with custom separators and click handlers
---

# Breadcrumb

```javascript
import { Breadcrumb } from 'native-document/components';

Breadcrumb(props?)
```

## Default Renderer

```javascript
import { BreadcrumbRender } from 'native-document/ui';

Breadcrumb.use(BreadcrumbRender);
```

## Methods

```javascript
// Add items
.item(label, href?, value?)
.items([{ label, href, value }, ...])
.removeItem(index)

// Bind to an observable array
.bind(Observable.array([...]))

// Separator
.separator('/')
.separator(ChevronIcon)
.renderSeparator(($description) => Span(' > '))

// Events
.onItemClick((item, index) => Router.push(item.href))

// Custom renderers
.renderItem(($item) => Link({ href: $item.href }, $item.label))
```

## Example

```javascript
Breadcrumb()
    .item('Home', '/')
    .item('Products', '/products')
    .item('Laptops', '/products/laptops')
    .item('MacBook Pro')  // current - no href
    .separator('/')
    .onItemClick((item) => {
        if (item.href) {
            Router.push(item.href);
        }
    })
```

## Reactive Binding

```javascript
const crumbs = Observable.array([
    { label: 'Home',     href: '/' },
    { label: 'Products', href: '/products' }
]);

Breadcrumb().bind(crumbs).separator(ChevronRight)

// Update dynamically
crumbs.push({ label: 'Laptops', href: '/products/laptops' });
```

---

## Theming

```css
:root {
    --breadcrumb-font-size:       var(--description-size);
    --breadcrumb-color:           var(--gray);
    --breadcrumb-color-active:    var(--text-color);
    --breadcrumb-color-hover:     var(--color-primary);
    --breadcrumb-separator-color: var(--gray-lite-2);
    --breadcrumb-separator:       '/';
    --breadcrumb-gap:             var(--space-cozy);
}
```