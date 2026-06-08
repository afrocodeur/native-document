import './material.css';
import MAP from './material.map.js';
import { Span } from '../../../../core/elements';

const SIZES = {
    small:      16,
    medium:     24,
    large:      32,
    extraLarge: 48,
};

// Variant -> CSS class
// Material Icons uses the class as the font-family selector
const VARIANT_CLASS = {
    fill:     'material-icons',
    regular:  'material-icons',
    outline:  'material-icons-outlined',
    round:    'material-icons-round',
    sharp:    'material-icons-sharp',
    twoTone:  'material-icons-two-tone',
};

/**
 * Renders a Google Material Icon as a <span> element using CSS webfont ligatures.
 * The icon name is the text content of the element — Material Icons uses ligatures.
 *
 * Variants: fill/regular (default), outline, round, sharp, twoTone
 * Each variant requires its own CSS - see material.css.
 *
 * @param {object} $desc
 * @param {string} $desc.name
 * @param {'fill'|'regular'|'outline'|'round'|'sharp'|'twoTone'|Observable<string>|null} $desc.variant
 * @param {'small'|'medium'|'large'|'extraLarge'|number|Observable<string|number>|null} $desc.size
 * @param {string|Observable<string>|null} $desc.color
 * @returns {HTMLElement}
 */
export default function MaterialIconRender($desc) {
    const materialName = MAP[$desc.name] ?? $desc.name;
    const style        = {};

    let className;

    if($desc.variant?.__$Observable) {
        className = $desc.variant.transform((variant) => {
            return VARIANT_CLASS[variant] ?? VARIANT_CLASS.fill;
        });
    } else {
        className = VARIANT_CLASS[$desc.variant] ?? VARIANT_CLASS.fill;
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

    // Material Icons uses ligatures — the icon name is the text content
    return Span({
        'aria-hidden': 'true',
        class:         className,
        style,
    }, materialName);
}
