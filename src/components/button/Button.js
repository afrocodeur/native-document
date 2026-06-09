import BaseComponent from '../BaseComponent';
import DebugManager from '../../core/utils/debug-manager';

/**
 * Interactive button with variants, sizes, icon placement, loading and disabled states. Use Button.use() to register a custom render template. Use Button.preset() to define named factory shortcuts.
 *
 *
 * @example
 * const btn = new Button(Span('Save'))
 *     .variant('primary')
 *     .size('medium')
 *     .icon(SaveIcon(), 'leading')
 *     .loading(isSubmitting)
 *     .disabled(false)
 *     .onClick(() => form.submit());
 *
 * // Custom render template
 * Button.use((description, instance) => {
 *     // description.label, description.variant, description.icon, description.loading...
 *     return Div(
 *         { class: \`btn btn--\${description.variant}\` },
 *         description.loading ? Spinner() : description.label
 *     );
 * });
 *
 * // Named preset
 * Button.preset('danger-sm', (instance) =>
 *     instance.variant('danger').size('small')
 * );
 * const deleteBtn = Button.preset('danger-sm')(Span('Delete'));
 *
 * @constructor
 * @param {NdChild} label
 * @param {GlobalAttributes} [props={}]
 */
export default function Button(label, props = {}) {
    if(!(this instanceof Button)) {
        return new Button(label, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        label: label,
        type: null,
        variant: null,
        size: null,
        icon: null,
        iconPosition: 'left',
        loading: null,
        disabled: null,
        template: null,
        block: null,
        borderRadiusType: null,
        outline: null,
        props,
    };
    this.aria = { 'role': 'button' };

    this.$element = null;
}

Button.defaultTemplate = null;

/**
 * Registers the render template for Button.
 * @param {(description: {
 *     label: NdChild,
 *     type: 'button'|'submit'|'reset'|null,
 *     variant: string|null,
 *     size: 'small'|'medium'|'large'|string|null,
 *     icon: NdChild|null,
 *     iconPosition: 'leading'|'trailing'|'top'|'bottom',
 *     loading: Observable<boolean>|null,
 *     disabled: Observable<boolean>|null,
 *     block: boolean|null,
 *     borderRadiusType: 'rounded'|'pill'|'circle'|'smooth'|null,
 *     outline: boolean|null,
 *     props: GlobalAttributes,
 * }, instance: Button) => NdChild} template
 */
Button.use = function(template = {}) {
    Button.defaultTemplate = template;
};

BaseComponent.extends(Button);

/**
 * @param {string} name
 * @param {(b: Button) => Button} callback
 */
Button.preset = function(name, callback) {
    if (Button.prototype[name] || Button[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Button.`);
        return;
    }
    Button[name] = (label, props) => callback(new Button(label, props));
};

/**
 * @param {Record<string, (b: Button) => Button>} presets
 */
Button.presets = function(presets) {
    for (const name in presets) {
        Button.preset(name, presets[name]);
    }
};

/**
 * @param {'button'|'submit'|'reset'} type
 * @returns {this}
 */
Button.prototype.type = function(type) {
    this.$description.type = type;
    return this;
};

/**
 * @param {string} variant
 * @returns {this}
 */
Button.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};

/**
 * @returns {this}
 */
Button.prototype.primary = function() {
    return this.variant('primary');
};

/**
 * @returns {this}
 */
Button.prototype.secondary = function() {
    return this.variant('secondary');
};

/**
 * @returns {this}
 */
Button.prototype.danger = function() {
    return this.variant('danger');
};

/**
 * @returns {this}
 */
Button.prototype.success = function() {
    return this.variant('success');
};

/**
 * @returns {this}
 */
Button.prototype.warning = function() {
    return this.variant('warning');
};

/**
 * @returns {this}
 */
Button.prototype.ghost = function() {
    return this.variant('ghost');
};

/**
 * @returns {this}
 */
Button.prototype.link = function() {
    return this.variant('link');
};

/**
 * @returns {this}
 */
Button.prototype.outline = function() {
    this.$description.outline = true;
    return this;
};

/**
 * @param {'small'|'medium'|'large'|string|null} size
 * @returns {this}
 */
Button.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};

/**
 * @returns {this}
 */
Button.prototype.small = function() {
    return this.size('small');
};

/**
 * @returns {this}
 */
Button.prototype.large = function() {
    return this.size('large');
};

/**
 * @returns {this}
 */
Button.prototype.medium = function() {
    return this.size('medium');
};

/**
 * @param {NdChild} icon
 * @param {'leading'|'trailing'|'top'|'bottom'} [iconPosition='leading']
 * @returns {this}
 */
Button.prototype.icon = function(icon, iconPosition = 'leading') {
    this.$description.icon = icon;
    this.$description.iconPosition = iconPosition;
    return this;
};

/**
 * @returns {this}
 */
Button.prototype.iconAtLeading = function() {
    this.$description.iconPosition = 'leading';
    return this;
};

/**
 * @returns {this}
 */
Button.prototype.iconAtTrailing = function() {
    this.$description.iconPosition = 'trailing';
    return this;
};

/**
 * @returns {this}
 */
Button.prototype.iconAtTop = function() {
    this.$description.iconPosition = 'top';
    return this;
};

/**
 * @returns {this}
 */
Button.prototype.iconAtBottom = function() {
    this.$description.iconPosition = 'bottom';
    return this;
};

/**
 * @returns {this}
 */
Button.prototype.iconOnly = function() {
    this.$description.iconOnly = true;
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [loading=true]
 * @returns {this}
 */
Button.prototype.loading = function(loading = true) {
    this.$description.loading = BaseComponent.obs(loading);
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [disabled=true]
 * @returns {this}
 */
Button.prototype.disabled = function(disabled = true) {
    this.$description.disabled = BaseComponent.obs(disabled);
    return this;
};

/**
 * @returns {this}
 */
Button.prototype.rounded = function() {
    this.$description.borderRadiusType = 'rounded';
    return this;
};

/**
 * @returns {this}
 */
Button.prototype.pill = function() {
    this.$description.borderRadiusType = 'pill';
    return this;
};

/**
 * @returns {this}
 */
Button.prototype.circle = function() {
    this.$description.borderRadiusType = 'circle';
    return this;
};

/**
 * @returns {this}
 */
Button.prototype.smooth = function() {
    this.$description.borderRadiusType = 'smooth';
    return this;
};

/**
 * @returns {this}
 */
Button.prototype.block = function() {
    this.$description.block = true;
    return this;
};
