---
title: SVG Elements
description: SVG wrapper functions for building reactive graphics, icons, charts, and illustrations
---

# SVG Elements

NativeDocument provides wrapper functions for all standard SVG elements. They follow the same API as HTML elements and support reactive attributes via observables.

```javascript
import { SvgSvg, SvgCircle, SvgRect, SvgPath, SvgG } from 'native-document/elements';
```

---

## Basic Usage

SVG elements follow the same pattern as HTML elements:

```javascript
import { SvgSvg, SvgCircle, SvgRect, SvgLine, SvgText } from 'native-document/elements';

// Static SVG
const icon = SvgSvg({ width: 24, height: 24, viewBox: '0 0 24 24' }, [
    SvgCircle({ cx: 12, cy: 12, r: 10, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 })
]);
```

---

## Reactive Attributes

Pass observables as attribute values for dynamic graphics:

```javascript
import { Observable } from 'native-document';
import { SvgSvg, SvgCircle, SvgRect } from 'native-document/elements';

const progress  = Observable(0);   // 0 to 100
const isActive  = Observable(true);
const color     = Observable('#3b82f6');

// Progress circle
const circumference = 2 * Math.PI * 45;

const ProgressRing = SvgSvg({ width: 120, height: 120, viewBox: '0 0 120 120' }, [
    SvgCircle({
        cx: 60, cy: 60, r: 45,
        fill: 'none',
        stroke: '#e5e7eb',
        'stroke-width': 10
    }),
    SvgCircle({
        cx: 60, cy: 60, r: 45,
        fill: 'none',
        stroke: color,
        'stroke-width': 10,
        'stroke-dasharray': circumference,
        'stroke-dashoffset': progress.transform(p => circumference - (p / 100) * circumference),
        transform: 'rotate(-90 60 60)'
    })
]);

// Updates the ring as progress changes
progress.set(75);
```

---

## Practical Examples

### Icon component

```javascript
import { SvgSvg, SvgPath } from 'native-document/elements';

function Icon({ path, size = 24, color = 'currentColor' }) {
    return SvgSvg({
        width:   size,
        height:  size,
        viewBox: '0 0 24 24',
        fill:    'none',
        stroke:  color,
        'stroke-width': 2,
        'stroke-linecap':  'round',
        'stroke-linejoin': 'round'
    }, [
        SvgPath({ d: path })
    ]);
}

// Usage
const CheckIcon = Icon({ path: 'M20 6L9 17l-5-5' });
const CloseIcon = Icon({ path: 'M18 6L6 18M6 6l12 12', color: 'red' });
```

### Bar chart

```javascript
import { Observable } from 'native-document';
import { SvgSvg, SvgRect, SvgText, SvgG, ForEach } from 'native-document/elements';

const data = Observable.array([
    { label: 'Jan', value: 40 },
    { label: 'Feb', value: 65 },
    { label: 'Mar', value: 55 },
    { label: 'Apr', value: 80 },
]);

const width    = 400;
const height   = 200;
const padding  = 40;
const barWidth = (width - padding * 2) / data.val().length;
const max      = Math.max(...data.map(d => d.value));

const chart = SvgSvg({ width, height, viewBox: `0 0 ${width} ${height}` },
    ForEach(data, (item, index) => {
        const barHeight = (item.value / max) * (height - padding * 2);
        const x = index.transform(i => (i * barWidth) + padding);
        const y = height - padding - barHeight;

        return SvgG([
            SvgRect({
                x, y,
                width:  barWidth - 4,
                height: barHeight,
                fill:   '#3b82f6',
                rx:     4
            }),
            SvgText({
                x: x.format(v => v + (barWidth - 4) / 2),
                y: height - padding + 16,
                'text-anchor': 'middle',
                'font-size':   12,
                fill:          '#6b7280'
            }, item.label)
        ]);
    })
);
```

### Animated loading spinner

```javascript
import { SvgSvg, SvgCircle } from 'native-document/elements';

const Spinner = SvgSvg({
    width: 24, height: 24,
    viewBox: '0 0 24 24',
    class: 'animate-spin'
}, [
    SvgCircle({
        cx: 12, cy: 12, r: 10,
        fill: 'none',
        stroke: '#e5e7eb',
        'stroke-width': 3
    }),
    SvgCircle({
        cx: 12, cy: 12, r: 10,
        fill: 'none',
        stroke: '#3b82f6',
        'stroke-width':    3,
        'stroke-dasharray': '31.4 62.8',
        'stroke-linecap':  'round'
    })
]);
```

### Gradient fill

```javascript
import { SvgSvg, SvgDefs, SvgLinearGradient, SvgStop, SvgRect } from 'native-document/elements';

const GradientBox = SvgSvg({ width: 200, height: 100, viewBox: '0 0 200 100' }, [
    SvgDefs([
        SvgLinearGradient({ id: 'gradient', x1: '0%', y1: '0%', x2: '100%', y2: '0%' }, [
            SvgStop({ offset: '0%',   'stop-color': '#3b82f6' }),
            SvgStop({ offset: '100%', 'stop-color': '#8b5cf6' })
        ])
    ]),
    SvgRect({ width: 200, height: 100, fill: 'url(#gradient)', rx: 8 })
]);
```

---

## Full Element Reference

### Basic shapes
`SvgCircle`, `SvgRect`, `SvgEllipse`, `SvgLine`, `SvgPolyline`, `SvgPolygon`, `SvgPath`

### Structure
`SvgSvg`, `SvgG`, `SvgDefs`, `SvgUse`, `SvgSymbol`, `SvgSwitch`, `SvgForeignObject`

### Text
`SvgText`, `SvgTSpan`, `SvgTextPath`

### Gradients & patterns
`SvgLinearGradient`, `SvgRadialGradient`, `SvgStop`, `SvgPattern`

### Clipping & masking
`SvgClipPath`, `SvgMask`

### Markers & images
`SvgMarker`, `SvgImage`

### Filters
`SvgFilter`, `SvgFEBlend`, `SvgFEColorMatrix`, `SvgFEComposite`, `SvgFEFlood`, `SvgFEGaussianBlur`, `SvgFEMerge`, `SvgFEMergeNode`, `SvgFEOffset`, `SvgFETurbulence`, `SvgFEDisplacementMap`, `SvgFEDiffuseLighting`, `SvgFESpecularLighting`, `SvgFEDistantLight`, `SvgFEPointLight`, `SvgFESpotLight`, `SvgFEMorphology`, `SvgFEConvolveMatrix`, `SvgFEComponentTransfer`, `SvgFEFuncR`, `SvgFEFuncG`, `SvgFEFuncB`, `SvgFEFuncA`

### Animation
`SvgAnimate`, `SvgAnimateTransform`, `SvgAnimateMotion`, `SvgMPath`, `SvgSet`

### Metadata
`SvgDesc`, `SvgTitle`, `SvgMetadata`, `SvgView`, `SvgStyle`, `SvgScript`

---

## Notes

- All SVG elements are created with the correct SVG namespace (`http://www.w3.org/2000/svg`) automatically
- Attribute names follow SVG conventions: `stroke-width`, `viewBox`, `fill-opacity`, etc.
- Reactive attributes work the same as HTML elements - pass an observable as the value
- Use `.format()` for computed string values, `.transform()` for numeric transforms

---

## Next Steps

- **[Elements](./elements.md)** - HTML element wrappers
- **[Observables](./observables.md)** - Reactive attributes
- **[List Rendering](./list-rendering.md)** - ForEach for dynamic chart data