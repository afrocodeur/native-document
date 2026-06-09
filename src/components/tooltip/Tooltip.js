import {Observable} from '../../core/data/Observable';
import {NDElement} from '../../core/wrappers/NDElement';
import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import DebugManager from '../../core/utils/debug-manager';

/**
 * Contextual tooltip anchored to a trigger element. Supports hover/click/focus interactions, position, arrow, and interactive mode.
 *
 * @example
 * const tooltip = new Tooltip(Span('This is a helpful hint'))
 *     .trigger(iconEl)
 *     .onHovered()
 *     .position('top')
 *     .arrow(true)
 *     .hideDelay(200)
 *     .info();
 *
 * Tooltip.use((description, instance) => {
 *     return Div({ class: 'tooltip' }, description.title, description.content);
 * });
 *
 * @constructor
 * @param {NdChild} content
 * @param {GlobalAttributes} [props={}]
 */
export default function Tooltip(content, props = {}) {
    if (!(this instanceof Tooltip)) {
        return new Tooltip(content, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        trigger: null,
        interaction: 'hover',
        content,
        position: 'top',
        title: null,
        isOpen: Observable(false),
        offset: 8,
        shift: {},
        hideDelay: 0,
        arrow: true,
        interactive: true,
        variant: null,
        updatePositionOn: null,
        props,
    };
    this.aria = { 'role': 'tooltip' };
}

BaseComponent.extends(Tooltip);
BaseComponent.use(Tooltip, HasEventEmitter);

Tooltip.defaultTemplate = null;


/**
 * Registers the render template for Tooltip.
 * @param {(description: {
 *     trigger: HTMLElement|NDElement|null,
 *     interaction: 'hover'|'click'|'focus',
 *     content: NdChild,
 *     position: 'top'|'bottom'|'left'|'right',
 *     title: NdChild|null,
 *     isOpen: Observable<boolean>,
 *     offset: number,
 *     shift: Record<string, number>,
 *     hideDelay: number,
 *     arrow: boolean,
 *     interactive: boolean,
 *     variant: string|null,
 *     updatePositionOn: Observable<*>|null,
 *     props: GlobalAttributes,
 * }, instance: Tooltip) => NdChild} template
 */
Tooltip.use = function(template) {
    Tooltip.defaultTemplate = template;
    if(!NDElement.prototype.tooltip) {
        NDElement.prototype.tooltip = function(content, props) {
            this.ghostDom((content instanceof Tooltip)
                ? content.trigger(this.$element)
                : Tooltip(content, props).trigger(this.$element));
            return this;
        };
    }
    if(!BaseComponent.prototype.tooltip) {
        BaseComponent.prototype.tooltip = function(content, props) {
            this.postBuild(() => {
                if(content instanceof Tooltip) {
                    this.ghostDom(content.trigger(this.$element));
                } else {
                    this.ghostDom(Tooltip(content, props).trigger(this.$element));
                }
            });
            return this;
        };
    }
};

/**
 * @param {string} name
 * @param {(t: Tooltip) => Tooltip} callback
 */
Tooltip.preset = function(name, callback) {
    if (Tooltip.prototype[name] || Tooltip[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Tooltip.`);
        return;
    }
    Tooltip[name] = (content, props) => callback(new Tooltip(content, props));
};

/**
 * @param {Record<string, (t: Tooltip) => Tooltip>} presets
 */
Tooltip.presets = function(presets) {
    for (const name in presets) {
        Tooltip.preset(name, presets[name]);
    }
};

/**
 * @param {HTMLElement|NDElement} trigger
 * @returns {this}
 */
Tooltip.prototype.trigger = function(trigger) {
    this.$description.trigger = trigger;
    return this;
};

/**
 * @param {NdChild} title
 * @returns {this}
 */
Tooltip.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
Tooltip.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

/**
 * @param {string} variant
 * @returns {this}
 */
Tooltip.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.primary = function() {
    this.$description.variant = 'primary';
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.success = function() {
    this.$description.variant = 'success';
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.warning = function() {
    this.$description.variant = 'warning';
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.danger = function() {
    this.$description.variant = 'danger';
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.info = function() {
    this.$description.variant = 'info';
    return this;
};

/**
 * @param {'top'|'bottom'|'left'|'right'} position
 * @returns {this}
 */
Tooltip.prototype.position = function(position) {
    this.$description.position = position;
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.atTop = function() {
    this.$description.position = 'top';
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.atBottom = function() {
    this.$description.position = 'bottom';
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.atLeft = function() {
    this.$description.position = 'left';
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.atRight = function() {
    this.$description.position = 'right';
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.onClicked = function() {
    this.$description.interaction = 'click';
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.onHovered = function() {
    this.$description.interaction = 'hover';
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.onFocused = function() {
    this.$description.interaction = 'focus';
    return this;
};

/**
 * @param {number} ms
 * @returns {this}
 */
Tooltip.prototype.hideDelay = function(ms) {
    this.$description.hideDelay = ms;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Tooltip.prototype.arrow = function(enabled = true) {
    this.$description.arrow = enabled;
    return this;
};

/**
 * @param {boolean} [isInteractive=true]
 * @returns {this}
 */
Tooltip.prototype.interactive = function(isInteractive = true) {
    this.$description.interactive = isInteractive;
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.open = function() {
    this.$description.isOpen.set(true);
    this.emit('open');
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.close = function() {
    this.$description.isOpen.set(false);
    this.emit('close');
    return this;
};

/**
 * @returns {this}
 */
Tooltip.prototype.toggle = function() {
    this.$description.isOpen.val() ? this.close() : this.open();
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Tooltip.prototype.onOpen = function(handler) {
    this.on('open', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Tooltip.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};

/**
 * @param {number} offset
 * @returns {this}
 */
Tooltip.prototype.offset = function(offset) {
    this.$description.offset = offset;
    return this;
};

/**
 * @param {*} shift
 * @returns {this}
 */
Tooltip.prototype.shift = function(shift) {
    this.$description.shift = shift;
    return this;
};

/**
 * @param {*} updatePositionOn
 * @returns {this}
 */
Tooltip.prototype.updatePositionOn = function(updatePositionOn) {
    this.$description.updatePositionOn = updatePositionOn;
    return this;
};
