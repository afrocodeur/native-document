import MAP from './tabler.map.js';
import {Italic, Span} from '../../../../core/elements';

const SIZES = {
    small:      16,
    medium:     24,
    large:      32,
    extraLarge: 48,
};

import './tabler.css';

/**
 * Renders a Tabler icon as an <i> element using CSS webfont classes.
 *
 * Variants:
 *   - outline (default) : ti ti-{name}          requires tabler-icons.css
 *   - fill              : ti ti-{name}-filled    requires tabler-icons-filled.css
 *
 * @param {object} $desc
 * @param {string} $desc.name
 * @param {'outline'|'fill'|null} $desc.variant
 * @param {'small'|'medium'|'large'|'extraLarge'|number|null} $desc.size
 * @param {string|null} $desc.color
 * @returns {HTMLElement}
 */
export default function TablerIconRender($desc) {
    const tablerName = MAP[$desc.name] ?? $desc.name;
    const style = {};

    let className = '';
    if($desc.variant?.__$Observable) {
        className = $desc.variant.format((variant) => {
            if(variant === 'fill') {
                return `ti ti-${tablerName}-filled`;
            }
            return `ti ti-${tablerName}`;
        });
    } else {
        className = ($desc.variant === 'fill') ? `ti ti-${tablerName}-filled` : `ti ti-${tablerName}`;
    }

    let px;

    style.fontSize = $desc.size?.__$Observable
        ? $desc.size.transform((size) => `${typeof size === 'number' ? size : (SIZES[size] ?? SIZES.medium)}px`)
        : `${typeof $desc.size === 'number' ? $desc.size : (SIZES[$desc.size] ?? SIZES.medium)}px`;

    if($desc.color) {
        style.color = $desc.color;
    }
    console.log(style);

    return Italic({
        'aria-hidden': 'true',
        style,
        class: className,
    });
}
