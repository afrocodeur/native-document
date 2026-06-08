---
title: Icons
description: Adapter-based icon system with chainable API and support for Tabler, Phosphor, and Google Material Icons
---

# Icons

NativeDocument provides an adapter-based icon system. Icon names are semantic and stable - switching from one icon library to another requires changing only the adapter and the CSS import.

```javascript
// Usage - always via the Icon namespace
Icon.search.fill()
Icon.star.fill().large()
Icon.arrowRight.bold().color('red')
Icon.user.fill().size(32)
```

---

## Setup

### 1. Register the adapter

In your app entry point (`main.js`):

```javascript
import { Icon }         from 'native-document/icons';
import TablerIconRender from 'native-document/ui/icon/tabler';

Icon.use(TablerIconRender, {
    variant: 'outline',  // default variant
    size:    'medium',   // default size: small | medium | large | extraLarge
});
```

### 2. Import the CSS

In the same entry point, import the icon font alongside your theme:

```javascript
// main.js
import 'native-document/src/ui/theme.scss';
import '@tabler/icons-webfont/dist/tabler-icons.css';
```

---

## Methods

### Variants

| Method | Sets variant to |
|---|---|
| `.thin()` | `'thin'` |
| `.light()` | `'light'` |
| `.regular()` | `'regular'` |
| `.bold()` | `'bold'` |
| `.fill()` | `'fill'` |
| `.duotone()` | `'duotone'` |
| `.variant(name)` | any custom string |

### Sizes

| Method | Sets size to |
|---|---|
| `.small()` | `'small'` - 16px |
| `.medium()` | `'medium'` - 24px |
| `.large()` | `'large'` - 32px |
| `.extraLarge()` | `'extraLarge'` - 48px |
| `.size(value)` | number in px or named string |

### Other

| Method | Parameters | Description |
|---|---|---|
| `.color(value)` | `value: string` | CSS color value |
| `.weight(value)` | `value: string` | Stroke weight (adapter-dependent) |

All methods accept `Observable` values - the icon updates automatically when the observable changes:

```javascript
const isDark = Observable(false);

Icon.star
    .variant(isDark.transform((d) => d ? 'fill' : 'outline'))
    .color(isDark.transform((d) => d ? 'gold' : 'currentColor'))
```

---

## Available icons

> The standard set covers the most common use cases. Each adapter maps these names to its own icon names - not every icon exists in every library.

### Navigation
`Icon.arrowLeft`, `Icon.arrowRight`, `Icon.arrowUp`, `Icon.arrowDown`, `Icon.chevronLeft`, `Icon.chevronRight`, `Icon.chevronUp`, `Icon.chevronDown`, `Icon.home`, `Icon.menu`, `Icon.close`, `Icon.back`, `Icon.forward`, `Icon.expand`, `Icon.collapse`, `Icon.fullscreen`, `Icon.fullscreenExit`

### Actions
`Icon.search`, `Icon.filter`, `Icon.sort`, `Icon.edit`, `Icon.delete`, `Icon.add`, `Icon.remove`, `Icon.save`, `Icon.copy`, `Icon.download`, `Icon.upload`, `Icon.share`, `Icon.refresh`, `Icon.more`, `Icon.settings`, `Icon.drag`, `Icon.resize`, `Icon.undo`, `Icon.redo`, `Icon.scan`, `Icon.print`, `Icon.import`, `Icon.export`

### Feedback
`Icon.check`, `Icon.checkCircle`, `Icon.error`, `Icon.warning`, `Icon.info`, `Icon.help`, `Icon.loading`, `Icon.success`

### User
`Icon.user`, `Icon.userCircle`, `Icon.users`, `Icon.lock`, `Icon.unlock`, `Icon.eye`, `Icon.eyeOff`, `Icon.bell`, `Icon.notification`

### Files & Media
`Icon.file`, `Icon.folder`, `Icon.image`, `Icon.document`, `Icon.attachment`, `Icon.link`, `Icon.externalLink`, `Icon.play`, `Icon.pause`, `Icon.stop`, `Icon.mute`, `Icon.sound`, `Icon.video`, `Icon.camera`

### Interface
`Icon.grid`, `Icon.list`, `Icon.calendar`, `Icon.clock`, `Icon.tag`, `Icon.tags`, `Icon.qrCode`, `Icon.barcode`

### Text editing
`Icon.bold`, `Icon.italic`, `Icon.underline`, `Icon.strikethrough`, `Icon.alignLeft`, `Icon.alignCenter`, `Icon.alignRight`, `Icon.alignJustify`, `Icon.orderedList`, `Icon.unorderedList`, `Icon.indent`, `Icon.outdent`, `Icon.scissors`, `Icon.fontColor`, `Icon.highlight`

### Data & charts
`Icon.barChart`, `Icon.lineChart`, `Icon.pieChart`, `Icon.areaChart`, `Icon.table`, `Icon.database`

### Commerce & finance
`Icon.shoppingCart`, `Icon.creditCard`, `Icon.wallet`, `Icon.bank`, `Icon.gift`, `Icon.percentage`, `Icon.dollar`, `Icon.euro`

### Communication
`Icon.mail`, `Icon.message`, `Icon.comment`, `Icon.phone`

### System & dev
`Icon.cloud`, `Icon.cloudUpload`, `Icon.cloudDownload`, `Icon.api`, `Icon.code`, `Icon.bug`, `Icon.tool`, `Icon.robot`

### Location
`Icon.map`, `Icon.compass`, `Icon.global`, `Icon.location`

### Shapes & objects
`Icon.star`, `Icon.heart`, `Icon.flag`, `Icon.trophy`, `Icon.medal`, `Icon.rocket`, `Icon.fire`, `Icon.thunder`, `Icon.smile`, `Icon.frown`, `Icon.like`, `Icon.dislike`, `Icon.safety`, `Icon.key`

---

## Custom icons

Create your own renderer that wraps the base adapter. Use NativeDocument elements for reactive support:

```javascript
import { Img, Span, ShowIf } from 'native-document/elements';
import TablerIconRender from 'native-document/ui/icon/tabler/TablerIconRender';

function MyIconRender($desc) {
    // Handle your custom icons
    if ($desc.name === 'logo' || $desc.name === 'dashboard') {
        const size = $desc.size?.__$Observable
            ? $desc.size.transform((s) => typeof s === 'number' ? `${s}px` : `${SIZES[s] ?? 24}px`)
            : `${typeof $desc.size === 'number' ? $desc.size : 24}px`;

        return Img({
            src: `/icons/${$desc.name}.svg`,
            'aria-hidden': 'true',
            style: {
                width:  size,
                height: size,
                color:  $desc.color ?? 'currentColor',
            },
        });
    }

    // Fall back to Tabler for everything else
    return TablerIconRender($desc);
}

Icon.use(MyIconRender, { size: 'medium' });
```

---

## Adapters

### Tabler Icons

> Outline and filled variants - the standard set covers the most common icons from Tabler's library.

**Install**

```bash
npm install @tabler/icons-webfont
```

**main.js**

```javascript
import { Icon }         from 'native-document/icons';
import TablerIconRender from 'native-document/ui/icon/tabler';
import 'native-document/src/ui/theme.scss';
import '@tabler/icons-webfont/dist/tabler-icons.css';

// Uncomment to enable .fill() variant
// import '@tabler/icons-webfont/dist/tabler-icons-filled.css';

Icon.use(TablerIconRender, { variant: 'outline', size: 'medium' });
```

**Supported variants**

| Variant | Description | Required CSS |
|---|---|---|
| `outline` (default) | Stroked icons | `tabler-icons.css` |
| `fill` | Filled icons | `tabler-icons-filled.css` |

**Example**

```javascript
Icon.search              // outline, medium
Icon.search.fill()       // filled
Icon.star.fill().large() // filled, 32px
```

---

### Phosphor Icons

> 6 weights - the standard set covers the most common icons from Phosphor's library.

**Install**

```bash
npm install @phosphor-icons/web
```

**main.js**

```javascript
import { Icon }           from 'native-document/icons';
import PhosphorIconRender from 'native-document/ui/icon/phosphor';
import 'native-document/src/ui/theme.scss';

// Check the exact path in your node_modules/@phosphor-icons/web/ directory
import '@phosphor-icons/web/src/regular/style.css';

// Import only the weights you need
// import '@phosphor-icons/web/src/thin/style.css';
// import '@phosphor-icons/web/src/light/style.css';
// import '@phosphor-icons/web/src/bold/style.css';
// import '@phosphor-icons/web/src/fill/style.css';
// import '@phosphor-icons/web/src/duotone/style.css';

Icon.use(PhosphorIconRender, { variant: 'regular', size: 'medium' });
```

> The CSS path may vary depending on the installed version. If you get a resolve error, run `ls node_modules/@phosphor-icons/web/` to find the correct path.

**Supported variants**

| Variant | Description | Required CSS |
|---|---|---|
| `thin` | Thinnest stroke | `thin/style.css` |
| `light` | Light stroke | `light/style.css` |
| `regular` (default) | Standard stroke | `regular/style.css` |
| `bold` | Bold stroke | `bold/style.css` |
| `fill` | Filled | `fill/style.css` |
| `duotone` | Two-tone | `duotone/style.css` |

**Example**

```javascript
Icon.search                // regular, medium
Icon.search.bold()         // bold
Icon.star.fill().large()   // filled, 32px
Icon.heart.duotone()       // duotone
```

---

### Google Material Icons

> Filled, outlined, round, sharp, two-tone - the standard set covers the most common icons from Material's library.

**Install**

```bash
npm install material-icons
```

**main.js**

```javascript
import { Icon }           from 'native-document/icons';
import MaterialIconRender from 'native-document/ui/icon/material';
import 'native-document/src/ui/theme.scss';
import 'material-icons/iconfont/filled.css';

// Import only the styles you need
// import 'material-icons/iconfont/outlined.css';
// import 'material-icons/iconfont/round.css';
// import 'material-icons/iconfont/sharp.css';
// import 'material-icons/iconfont/two-tone.css';

Icon.use(MaterialIconRender, { variant: 'fill', size: 'medium' });
```

**Supported variants**

| Variant | Description | Required CSS |
|---|---|---|
| `fill` / `regular` (default) | Filled icons | `filled.css` |
| `outline` | Outlined icons | `outlined.css` |
| `round` | Rounded icons | `round.css` |
| `sharp` | Sharp corners | `sharp.css` |
| `twoTone` | Two-tone icons | `two-tone.css` |

> Material Icons uses **ligatures** - the icon name is the text content of the element, converted to an icon by the font. This is handled automatically by the renderer.

**Example**

```javascript
Icon.search                       // filled, medium
Icon.search.variant('outline')    // outlined
Icon.star.large()                 // filled, 32px
```

---

## Next Steps

- **[Components Overview](./index.md)** - BaseComponent and renderer pattern
- **[Getting Started](./getting-started.md)** - Register default renderers
- **[Theming](../theming.md)** - CSS tokens reference