---
title: Accordion
description: Headless Accordion component with multiple expand, variants, and item management
---

# Accordion

```javascript
import { Accordion, AccordionItem } from 'native-document/components';
```

```javascript
Accordion(props?)
```


## Default Renderers

```javascript
import { AccordionRender, AccordionItemRender } from 'native-document/ui';

Accordion.use(AccordionRender);
AccordionItem.use(AccordionItemRender);
```

---

## `$description`

```javascript
{
    items:           [],    // AccordionItem[]
        multiple:        null,  // boolean - allow multiple open at once
        variant:         null,  // string
        renderContent:   null,  // (item) => element - custom content renderer
        renderIndicator: null,  // (item) => element - custom indicator renderer
        props:           {} // HTML attributes for the root element
}
```

## Methods

### Adding items

```javascript
// Add by title + content
Accordion()
    .item('Section 1', Div('Content 1'))
    .item('Section 2', Div('Content 2'), { expanded: true, disabled: false })

// Add AccordionItem instance
Accordion()
    .item(
        AccordionItem()
            .title('Section')
            .content(Div('Content'))
    )

// Add multiple at once
Accordion()
    .items([
        { title: 'A', content: Div('Content A') },
        { title: 'B', content: Div('Content B') }
    ])
```

### Behavior

```javascript
.multiple()         // allow multiple panels open at once
    .multiple(false)    // only one panel at a time (default)
```

### Variants

```javascript
.bordered()    // adds borders
    .separated()   // space between items
    .flush()       // no borders, no padding
```

### Expand / Collapse

```javascript
.expanded(key, true)   // expand item by key
    .expanded(key, false)  // collapse item by key
    .expandAll()
    .collapseAll()
    .isExpanded(key)       // returns boolean
    .getByKey(key)         // returns AccordionItem
```

### Remove items

```javascript
.removeItemById(id)
    .remove(item => item.id === 'my-id') // filter function
```

### Events

```javascript
Accordion()
    .onExpand((item)   => console.log('Expanded:', item.title))
    .onCollapse((item) => console.log('Collapsed:', item.title))
```

### Custom renderers

```javascript
.renderContent(($item) => Div({ class: 'custom-body' }, $item.content))
    .renderIndicator(($item) => $item.expanded.transform(e => e ? '-' : '+'))
```

## `AccordionItem`

```javascript
AccordionItem()
    .identifyBy('item-1')
    .title('Section Title')
    .content(Div('Content'))
    .icon(InfoIcon)
    .expanded()
    .collapsible()
    .disabled()
    .showIndicator()
    .renderHeader(($item) => Div({ class: 'header' }, $item.title))
    .renderContent(($item) => Div({ class: 'body' }, $item.content))
    .renderIndicator(($item) => $item.expanded.transform(e => e ? '-' : '+'))
    .onExpand(() => console.log('Expanded'))
    .onCollapse(() => console.log('Collapsed'))
```

## Example

```javascript
const faq = Accordion()
    .bordered()
    .item('What is NativeDocument?',
        P('A reactive JavaScript framework without Virtual DOM.')
    )
    .item('How do I install it?',
        Div([
            P('Use the CLI:'),
            Pre('nd create my-app')
        ]),
        { expanded: true }
    )
    .item('Is it free?', P('Yes, MIT licensed.'))
    .onExpand(item => trackFAQ(item.id))

document.body.appendChild(faq)
```

---

## Theming

```css
:root {
    --accordion-border:           var(--gray-lite-3);
    --accordion-radius:           var(--radius-card);
    --accordion-font-size:        var(--description-size);
    --accordion-header-padding:   var(--space-comfortable);
    --accordion-content-padding:  var(--space-comfortable);
    --accordion-header-color:     var(--text-color);
    --accordion-header-color-hover: var(--text-color);
    --accordion-header-bg-hover:  var(--gray-lite-5);
    --accordion-indicator-color:  var(--gray);
    --accordion-transition:       0.2s ease;
}
```