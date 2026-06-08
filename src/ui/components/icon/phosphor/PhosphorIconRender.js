import './phosphor.css';
import MAP from './phosphor.map.js';
import { Span } from '../../../../core/elements';

const SIZES = {
    small:      16,
    medium:     24,
    large:      32,
    extraLarge: 48,
};

// Variant -> CSS weight class
// regular uses 'ph' (no suffix), others use 'ph-{variant}'
const VARIANT_CLASS = {
    thin:    'ph-thin',
    light:   'ph-light',
    regular: 'ph',
    bold:    'ph-bold',
    fill:    'ph-fill',
    duotone: 'ph-duotone',
};

/**
 * Renders a Phosphor icon as a <span> element using CSS webfont classes.
 *
 * Variants: thin, light, regular (default), bold, fill, duotone
 * Each variant requires its own CSS - see phosphor.css.
 *
 * @param {object} $desc
 * @param {string} $desc.name
 * @param {'thin'|'light'|'regular'|'bold'|'fill'|'duotone'|Observable<string>|null} $desc.variant
 * @param {'small'|'medium'|'large'|'extraLarge'|number|Observable<string|number>|null} $desc.size
 * @param {string|Observable<string>|null} $desc.color
 * @returns {HTMLElement}
 */
export default function PhosphorIconRender($desc) {
    const phosphorName = MAP[$desc.name] ?? $desc.name;
    const style        = {};

    let className;

    if($desc.variant?.__$Observable) {
        className = $desc.variant.transform((variant) => {
            const weightClass = VARIANT_CLASS[variant] ?? 'ph';
            return `${weightClass} ph-${phosphorName}`;
        });
    } else {
        const weightClass = VARIANT_CLASS[$desc.variant] ?? 'ph';
        className = `${weightClass} ph-${phosphorName}`;
    }

    if($desc.size?.__$Observable) {
        style.fontSize = $desc.size.transform((size) => {
            const px = typeof size === 'number' ? size : (SIZES[size] ?? SIZES.medium);
            return `${px}px`;
        });
    } else {
        const px = typeof $desc.size === 'number' ? $desc.size : (SIZES[$desc.size] ?? SIZES.medium);
        style.fontSize = `${px}px`;
    }

    if($desc.color) {
        style.color = $desc.color;
    }

    return Span({
        'aria-hidden': 'true',
        class: className,
        style,
    });
}
