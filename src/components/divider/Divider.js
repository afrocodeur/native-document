import BaseComponent from '../BaseComponent';
import DebugManager from '../../core/utils/debug-manager';

/**
 * Visual separator between sections. Supports horizontal/vertical orientation, solid/dashed/dotted style, label, and indent.
 *
 *
 * @example
 * const divider = new Divider(Span('OR'))
 *     .horizontal()
 *     .dashed()
 *     .labelAtCenter()
 *     .color('#ccc')
 *     .spacing(16);
 *
 * Divider.use((description, instance) => {
 *     return Hr({ class: \`divider divider--\${description.variant}\` });
 * });
 *
 * @constructor
 * @param {NdChild} [label]
 * @param {GlobalAttributes} [props={}]
 */
export default function Divider(label, props = {}) {
    if(!(this instanceof Divider)) {
        return new Divider(label, props);
    }

    this.$description = {
        orientation: 'horizontal',
        variant: 'solid',
        thickness: 1,
        spacing: 16,
        label,
        labelPosition: 'center',
        color: null,
        render: null,
        inset: null,
        indent: null,
        leading: null,
        trailing: null,
        props,
    };
}

BaseComponent.extends(Divider);

Divider.defaultTemplate = null;

/**
 * Registers the render template for Divider.
 * @param {(description: {
 *     orientation: 'horizontal'|'vertical',
 *     variant: 'solid'|'dashed'|'dotted',
 *     thickness: number,
 *     spacing: number,
 *     label: NdChild|null,
 *     labelPosition: 'leading'|'center'|'trailing',
 *     color: string|null,
 *     render: ((desc: *, instance: Divider) => NdChild)|null,
 *     inset: number|null,
 *     indent: number|null,
 *     leading: number|null,
 *     trailing: number|null,
 *     props: GlobalAttributes,
 * }, instance: Divider) => NdChild} template
 */
Divider.use = function(template) {
    Divider.defaultTemplate = template;
};

/**
 * @param {string} name
 * @param {(d: Divider) => Divider} callback
 */
Divider.preset = function(name, callback) {
    if (Divider.prototype[name] || Divider[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in Divider.`);
        return;
    }
    Divider[name] = (label, props) => callback(new Divider(label, props));
};

/**
 * @param {Record<string, (d: Divider) => Divider>} presets
 */
Divider.presets = function(presets) {
    for (const name in presets) {
        Divider.preset(name, presets[name]);
    }
};

/**
 * @param {string} orientation
 * @returns {this}
 */
Divider.prototype.orientation = function(orientation) {
    this.$description.orientation = orientation;
    return this;
};

/**
 * @returns {this}
 */
Divider.prototype.horizontal = function() {
    this.$description.orientation = 'horizontal';
    return this;
};

/**
 * @returns {this}
 */
Divider.prototype.vertical = function() {
    this.$description.orientation = 'vertical';
    return this;
};

/**
 * @param {string} variant
 * @returns {this}
 */
Divider.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};

/**
 * @returns {this}
 */
Divider.prototype.solid = function() {
    this.$description.variant = 'solid';
    return this;
};

/**
 * @returns {this}
 */
Divider.prototype.dashed = function() {
    this.$description.variant = 'dashed';
    return this;
};

/**
 * @returns {this}
 */
Divider.prototype.dotted = function() {
    this.$description.variant = 'dotted';
    return this;
};

/**
 * @param {number} thickness
 * @returns {this}
 */
Divider.prototype.thickness = function(thickness) {
    this.$description.thickness = thickness;
    return this;
};

/**
 * @param {number} spacing
 * @returns {this}
 */
Divider.prototype.spacing = function(spacing) {
    this.$description.spacing = spacing;
    return this;
};

/**
 * @param {number} inset
 * @returns {this}
 */
Divider.prototype.inset = function(inset) {
    this.$description.inset = inset;
    return this;
};

/**
 * @param {NdChild} leading
 * @returns {this}
 */
Divider.prototype.leading = function(leading) {
    this.$description.leading = leading;
    return this;
};

/**
 * @param {NdChild} trailing
 * @returns {this}
 */
Divider.prototype.trailing = function(trailing) {
    this.$description.trailing = trailing;
    return this;
};

/**
 * @param {NdChild} leading
 * @param {NdChild} trailing
 * @returns {this}
 */
Divider.prototype.indent = function(leading, trailing) {
    this.leading(leading);
    this.trailing(trailing);
    return this;
};

/**
 * @param {NdChild} label
 * @returns {this}
 */
Divider.prototype.label = function(label) {
    this.$description.label = label;
    return this;
};

/**
 * @param {string} position
 * @returns {this}
 */
Divider.prototype.labelPosition = function(position) {
    this.$description.labelPosition = position;
    return this;
};

/**
 * @returns {this}
 */
Divider.prototype.labelAtLeading = function() {
    this.$description.labelPosition = 'leading';
    return this;
};

/**
 * @returns {this}
 */
Divider.prototype.labelAtCenter = function() {
    this.$description.labelPosition = 'center';
    return this;
};

/**
 * @returns {this}
 */
Divider.prototype.labelAtTrailing = function() {
    this.$description.labelPosition = 'trailing';
    return this;
};

/**
 * @param {string} color
 * @returns {this}
 */
Divider.prototype.color = function(color) {
    this.$description.color = color;
    return this;
};