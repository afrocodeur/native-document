---
title: Theming
description: Customize NativeDocument's visual style by overriding SCSS tokens - colors, typography, spacing, radius, shadows, and animations
---

# Theming

NativeDocument's UI layer is built on CSS custom properties (variables). Every visual aspect of the framework - colors, typography, spacing, radius, shadows, animations - is a token that can be overridden to match your brand.

---

## Setup

The theme is included via the main SCSS entry point:

```scss
@use 'native-document/src/ui/tokens/index.scss';
```

To customize, import the index **after** defining your overrides, or create a theme file that you import instead:

```scss
// my-theme.scss
@use 'native-document/src/ui/tokens/index.scss';

:root {
    --color-primary: #6366f1;
    --font: 'Geist', sans-serif;
    --radius-card: 12px;
}
```

Then in your entry point:

```javascript
import './my-theme.scss';
```

---

## Colors

### Palette

Raw color values. Used by semantic tokens (see below) - override these to shift the entire palette at once.

```scss
:root {
    /* Chromatic */
    --red:    #ff383c;
    --orange: #ff8d28;
    --yellow: #ffcc00;
    --green:  #34c759;
    --mint:   #00c8b3;
    --teal:   #00c3d0;
    --cyan:   #00c0e8;
    --blue:   #0088ff;
    --indigo: #6155f5;
    --purple: #cb30e0;
    --pink:   #ff2d55;
    --brown:  #ac7f5e;

    /* Grays */
    --gray:        #8e8e93;
    --gray-lite-1: #aeaeb2;
    --gray-lite-2: #c7c7cc;
    --gray-lite-3: #d1d1d6;
    --gray-lite-4: #e5e5ea;
    --gray-lite-5: #f2f2f7;
    --white:        #ffffff;
    --black:        #000000;

    /* Base */
    --background:       white;
    --background-color: white;
    --text-color:       black;
}
```

### Contrasted variants

High-contrast versions of each color - used for hover states and accessible text. Override to adjust hover behavior:

```scss
:root {
    --contrasted-blue:   #1e6ef4;
    --contrasted-green:  #008932;
    --contrasted-red:    #e9152d;
    --contrasted-yellow: #a16a00;
    /* ... one for each chromatic color */
}
```

### Semantic tokens

Map palette colors to component roles. This is the recommended layer to override for branding:

```scss
:root {
    --color-primary:        var(--blue);
    --color-primary-hover:  var(--contrasted-blue);

    --color-secondary:      var(--gray-lite-4);
    --color-secondary-hover: var(--gray-lite-3);
    --color-secondary-text: var(--text-color);

    --color-danger:         var(--red);
    --color-danger-hover:   var(--contrasted-red);

    --color-success:        var(--green);
    --color-success-hover:  var(--contrasted-green);

    --color-warning:        var(--yellow);
    --color-warning-hover:  var(--contrasted-yellow);

    --color-info:           var(--cyan);
    --color-info-hover:     var(--contrasted-cyan);

    --color-ghost:          transparent;
    --color-ghost-hover:    var(--gray-lite-5);
    --color-ghost-text:     var(--text-color);

    --color-link:           var(--blue);
    --color-link-hover:     var(--contrasted-blue);
}
```

### Dark mode

Dark mode overrides are applied automatically via `@media (prefers-color-scheme: dark)`. You can also force a mode with a class:

```html
<html class="dark-mode">  <!-- force dark -->
<html class="light-mode"> <!-- force light -->
```

To override dark mode colors:

```scss
@media (prefers-color-scheme: dark) {
    :root {
        --blue:  #3b9eff;
        --green: #30d158;
    }
}
```

---

## Typography

```scss
:root {
    --font: Inter, Arial, sans-serif;

    /* Scale */
    --diablo-detail-size: 0.5rem;   /* 8px  - smallest label */
    --diablo-size:        0.6rem;   /* 10px */
    --hint-size:          0.7rem;   /* 11px - tooltips, hints */
    --note-size:          0.8rem;   /* 13px - captions */
    --description-size:   0.9rem;   /* 14px - secondary text */
    --field-size:         0.9rem;   /* 14px - form fields */
    --text-size:          1rem;     /* 16px - body */
    --important-size:     1.25rem;  /* 20px */

    /* Headings */
    --h1-font-size: 2.5rem;   /* 40px */
    --h2-font-size: 1.6rem;   /* 26px */
    --h3-font-size: 1.4rem;   /* 22px */
    --h4-font-size: 1.5rem;   /* 24px */
    --h5-font-size: 1.25rem;  /* 20px */
    --h6-font-size: 1.15rem;  /* 18px */
}
```

### Custom font example

```scss
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap');

:root {
    --font: 'Geist', sans-serif;
}
```

---

## Spacing

8 named steps from `tiny` (4px) to `spacious` (48px):

```scss
:root {
    --space-tiny:             0.25rem;  /* 4px  */
    --space-tight:            0.35rem;  /* 6px  */
    --space-cozy:             0.5rem;   /* 8px  */
    --space-cozy-comfortable: 0.75rem;  /* 12px */
    --space-comfortable:      1rem;     /* 16px */
    --space-relaxed:          1.5rem;   /* 24px */
    --space-loose:            2rem;     /* 32px */
    --space-spacious:         3rem;     /* 48px */

    --container-padding: 1rem;
    --container-margin:  0rem;
}
```

---

## Border radius

```scss
:root {
    --radius-none:   0;
    --radius-small:  0.25rem;  /* 4px  */
    --radius-medium: 0.5rem;   /* 8px  */
    --radius-large:  1rem;     /* 16px */
    --radius-round:  50%;

    /* Component-specific */
    --radius-button: 5px;
    --radius-card:   5px;
    --radius-modal:  12px;
    --radius-pill:   35px;
}
```

To round all buttons and cards:

```scss
:root {
    --radius-button: 8px;
    --radius-card:   12px;
}
```

---

## Shadows

```scss
:root {
    /* Scale */
    --shadow-none:      none;
    --shadow-xs:        0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-sm:        0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
    --shadow-md:        0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);
    --shadow-lg:        0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
    --shadow-xl:        0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
    --shadow-double-xl: 0 25px 50px rgba(0, 0, 0, 0.25);

    /* Component-specific */
    --shadow-card:     0 4px 6px rgba(0, 0, 0, 0.07);
    --shadow-button:   0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-modal:    0 20px 25px rgba(0, 0, 0, 0.15);
    --shadow-dropdown: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-tooltip:  0 4px 8px rgba(0, 0, 0, 0.12);

    /* Interactive */
    --shadow-focus:   0 0 0 3px var(--shadow-focus-color);
    --shadow-outline: 0 0 0 3px var(--shadow-outline-color);
    --shadow-glow:    0 0 20px var(--shadow-glow-color);
    --shadow-inner:   inset 0 2px 4px var(--shadow-inner-color);

    /* Focus ring color */
    --shadow-focus-color:   rgba(59, 130, 246, 0.5);
    --shadow-outline-color: rgba(59, 130, 246, 0.5);
    --shadow-glow-color:    rgba(59, 130, 246, 0.3);
}
```

To change the focus ring color to match your brand:

```scss
:root {
    --shadow-focus-color:   rgba(99, 102, 241, 0.5);
    --shadow-outline-color: rgba(99, 102, 241, 0.5);
    --shadow-glow-color:    rgba(99, 102, 241, 0.3);
}
```

---

## Animation

```scss
:root {
    /* Durations */
    --fast:      0.2s;
    --natural:   0.3s;
    --medium:    0.5s;
    --slow:      1s;
    --very-slow: 5s;
}
```

To slow down all transitions (useful for accessibility or debugging):

```scss
:root {
    --fast:    0.3s;
    --natural: 0.5s;
    --medium:  0.8s;
}
```

---

## Opacity

```scss
:root {
    --opacity-disabled: 0.5;
    --opacity-backdrop: 0.7;
    --opacity-ghost:    0.1;
    --opacity-faint:    0.2;
    --opacity-subtle:   0.3;
    /* ... full scale from 0.1 to 1 */
}
```

---

## Z-index layers

```scss
:root {
    --floor-layer:        0;
    --tooltip-layer:      2;
    --dropdown-layer:     4;
    --overlay-layer:      10000;
    --modal-layer:        10001;
    --z-stack-z-index:    10000;
}
```

---

## Breakpoints

```scss
:root {
    --mobile-width:       320px;
    --tablet-width:       768px;
    --desktop-width:      1024px;
    --wide-desktop-width: 1280px;
    --fullhd-width:       1440px;
}
```

Utility classes applied automatically:

| Class | Visible on |
|---|---|
| `.mobile-only` | Mobile only (hidden above 768px) |
| `.desktop-only` | Desktop only (hidden below 768px) |
| `.at-least-tablet` | Tablet and above |

---

## Complete theme example

```scss
// themes/brand.scss
@use 'native-document/src/ui/tokens/index.scss';

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
    /* Brand colors */
    --blue:              #6366f1;
    --contrasted-blue:   #4f46e5;

    /* Semantic */
    --color-primary:       var(--blue);
    --color-primary-hover: var(--contrasted-blue);

    /* Focus ring matches brand */
    --shadow-focus-color:   rgba(99, 102, 241, 0.5);
    --shadow-outline-color: rgba(99, 102, 241, 0.5);
    --shadow-glow-color:    rgba(99, 102, 241, 0.3);

    /* Typography */
    --font: 'Inter', sans-serif;

    /* Rounder corners */
    --radius-button: 8px;
    --radius-card:   12px;
    --radius-modal:  16px;

    /* Slightly slower animations */
    --fast:    0.25s;
    --natural: 0.35s;
}

@media (prefers-color-scheme: dark) {
    :root {
        --blue:            #818cf8;
        --contrasted-blue: #6366f1;
    }
}
```

---

## Next Steps

- **[Components Overview](./components/index.md)** - BaseComponent and renderer pattern
- **[Getting Started](./components/getting-started.md)** - Register default renderers
