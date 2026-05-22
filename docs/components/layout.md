---
title: Layout Components
description: Stack, HStack, VStack, AbsoluteStack, FixedStack, RelativeStack - flexible layout building blocks
---

# Layout Components

Layout components provide flexible, semantic containers for building UI structure.

```javascript
import { HStack, VStack, Row, Col, AbsoluteStack, FixedStack, RelativeStack, Divider } from 'native-document/components';
import { Stack } from 'native-document/components'; // only needed to register the renderer
```

---

## `Stack` - Abstract Base

`Stack` is the abstract base class for all layout components. Do not use it directly - use `HStack`, `VStack`, `Row`, or `Col` instead.

All stack variants share the same `$description` structure and methods:

### `$description`

```javascript
{
    orientation:    'horizontal', // 'horizontal' | 'vertical'
        content:        [],
        spacing:        null,         // string | number
        alignment:      'center',     // 'leading' | 'center' | 'trailing' | 'stretch'
        justifyContent: 'between',    // 'start' | 'center' | 'end' | 'between' | 'around'
        wrap:           false,
        grow:           false,
        shrink:         false,
        reverse:        false,
        props:          {}
}
```

### Methods

```javascript
// Spacing
.spacing(8)

    // Alignment
    .alignLeading()     // alignment: 'leading'
    .alignCenter()      // alignment: 'center'
    .alignTrailing()    // alignment: 'trailing'
    .alignStretch()     // alignment: 'stretch'

    // Justify
    .justifyStart()
    .justifyCenter()
    .justifyEnd()
    .justifyBetween()
    .justifyAround()

    // Combined
    .center()           // alignCenter() + justifyCenter()

    // Other
    .wrap()
    .grow()
    .shrink()
    .reverse()
```

### Renderer

Each variant needs its own renderer registered separately:

```javascript
import { HStack, VStack } from 'native-document/components';
import { HStackRender, VStackRender } from 'native-document/ui';

HStack.use(HStackRender);
VStack.use(VStackRender);
// Row and Col share HStack and VStack renderers automatically
```

Or write your own:

```javascript
HStack.use(($description) => {
    return Div({
        class: buildStackClasses($description),
        style: $description.spacing ? { gap: $description.spacing + 'px' } : {},
        ...$description.props
    }, $description.content);
});
```

---

## `HStack` - Horizontal Stack

Alias for `Stack` with `orientation: 'horizontal'`. Also available as `Row`.

```javascript
HStack([
    Avatar(user.avatar),
    Div(user.name)
]).alignCenter().spacing(12)

// Row is an alias for HStack
Row([
    Button('Cancel').ghost(),
    Button('Save').primary()
]).justifyEnd().spacing(8)
```

---

## `VStack` - Vertical Stack

`Stack` with `orientation: 'vertical'` and `alignment: 'leading'` by default. Also available as `Col`.

```javascript
VStack([
    H2('Title'),
    P('Description'),
    Button('Action').primary()
]).spacing(16).alignStretch()

// Col is an alias for VStack
Col([Label('Name'), Input({ value: name })]).spacing(4)
```

---

## `AbsoluteStack` / `FixedStack` / `RelativeStack` - Positioned Containers

All three extend `PositionStack` and share the same API. They differ only in CSS `position`:

| Component | CSS position |
|---|---|
| `AbsoluteStack` | `absolute` |
| `FixedStack` | `fixed` |
| `RelativeStack` | `relative` |

### `$description`

```javascript
{
    position: 'absolute', // 'absolute' | 'fixed' | 'relative'
        content:  [],
        top:      null,  // string | number
        right:    null,
        bottom:   null,
        left:     null,
        width:    null,
        height:   null,
        zIndex:   null,
        anchor:   null,  // preset anchor shorthand
        props:    {}
}
```

### Methods

```javascript
AbsoluteStack(Div('Tooltip'))
    .top(0)
    .right(0)
    .width(200)
    .height(100)
    .zIndex(50)

    // Size helpers
    .fullWidth()        // width: '100%'
    .fullHeight()       // height: '100%'
    .fullSize()         // width + height: '100%'
    .size(200, 100)     // width: 200, height: 100
    .size(200)          // width: 200, height: 200

    // Z-index helpers
    .above(100)         // zIndex: 100
    .below()            // zIndex: -1

    // Anchor presets (position combinations)
    .fill()             // anchor: 'fill'
    .topLeading()       // anchor: 'top-leading'
    .atTopCenter()      // anchor: 'top-center'
    .atTopTrailing()    // anchor: 'top-trailing'
    .atCenterLeading()  // anchor: 'center-leading'
    .atCenter()         // anchor: 'center'
    .atCenterTrailing() // anchor: 'center-trailing'
    .atBottomLeading()  // anchor: 'bottom-leading'
    .atBottomCenter()   // anchor: 'bottom-center'
    .atBottomTrailing() // anchor: 'bottom-trailing'
```

### Example

```javascript
// Floating action button
const fab = FixedStack(
    Button(PlusIcon).circle().primary()
)
    .atBottomTrailing()
    .right(24)
    .bottom(24)
    .above(100)

// Overlay badge
const badge = AbsoluteStack(Span('3'))
    .atTopTrailing()
    .top(-8)
    .right(-8)
```

---

## `Divider`

A horizontal or vertical separator, optionally with a label.

```javascript
Divider(label?, props?)
```

### `$description`

```javascript
{
    label:       null,      // string | null
        orientation: 'horizontal', // 'horizontal' | 'vertical'
        props:       {}
}
```

### Methods

```javascript
Divider()           // horizontal, no label
Divider('OR')       // with label
Divider().vertical() // vertical

    .orientation('vertical')
    .vertical()
    .horizontal()
```

### Example

```javascript
VStack([
    Input({ placeholder: 'Email', value: email }),
    Input({ placeholder: 'Password', type: 'password', value: password }),
    Button('Sign in').primary().block(),
    Divider('OR'),
    Button('Continue with Google').ghost().block()
]).spacing(16)
```


---

## Theming

```css
:root {
    --divider-color:          var(--gray-lite-3);
    --divider-label-color:    var(--gray);
    --divider-label-size:     var(--note-size);
    --divider-label-gap:      var(--space-comfortable);
    --divider-thickness:      1px;
    --divider-spacing:        16px;
}
```

---

## Next Steps

- **[Getting Started](./getting-started.md)** - Register renderers
- **[Button](./button.md)** - Button component
- **[Modal](./modal.md)** - Modal with draggable and resizable