import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import { Observable } from '../../core/data/Observable';
import {ElementCreator} from '../../core/wrappers/ElementCreator';
import {NDElement} from '../../core/wrappers/NDElement';
import DebugManager from '../../core/utils/debug-manager';
import HasFullPosition from '../$traits/has-position/HasFullPosition';

/**
 * Floating panel anchored to a trigger element. Supports click/hover/focus interactions, arrow, position, header/footer slots, and focus trap.
 *
 *
 * @example
 * const popover = new Popover(Div('Popover content'))
 *     .trigger(myBtn)
 *     .onClicked()
 *     .position('bottom')
 *     .offset(8)
 *     .arrow(true)
 *     .closeOnEscape(true)
 *     .onOpen(() => console.log('open'));
 *
 * Popover.use((description, instance) => {
 *     return Div({ class: 'popover' }, description.header, description.content, description.footer);
 * });
 *
 * @constructor
 * @param {NdChild} content
 * @param {GlobalAttributes} [props={}]
 */
export default function Popover(content, props = {}) {
    if (!(this instanceof Popover)) {
        return new Popover(content, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        trigger: null,
        interaction: 'click',
        content,
        header: null,
        footer: null,
        isOpen: Observable(false),
        defaultOpen: false,
        modal: false,
        closeOnEscape: true,
        closeOnClickOutside: true,
        focusTrap: true,
        returnFocus: true,
        position: 'top',
        offset: 8,
        shift: {},
        arrow: true,
        data: null,
        renderContent: null,
        renderHeader: null,
        renderFooter: null,
        render: null,
        variant: null,
        matchTriggerWidth: null,
        matchTargetWidth: null,
        updatePositionOn: null,
        includeTriggerIntoGhost: true,
        props,
    };
    this.aria = { 'role': 'tooltip' };

    this.$element = null;

    if (this.$description.defaultOpen) {
        this.$description.isOpen.set(true);
    }
}

BaseComponent.extends(Popover);
BaseComponent.use(Popover, HasEventEmitter, HasFullPosition);

Popover.defaultTemplate = null;

/**
 * Registers the render template for Popover.
 * @param {(description: {
 *     trigger: HTMLElement|null,
 *     interaction: 'click'|'hover'|'focus',
 *     content: NdChild,
 *     header: NdChild|PopoverHeader|null,
 *     footer: NdChild|PopoverFooter|null,
 *     isOpen: Observable<boolean>,
 *     closeOnEscape: boolean,
 *     closeOnClickOutside: boolean,
 *     focusTrap: boolean,
 *     returnFocus: boolean,
 *     position: string,
 *     offset: number,
 *     shift: Record<string, number>,
 *     arrow: boolean,
 *     data: *|null,
 *     renderContent: ((desc: *, instance: Popover) => NdChild)|null,
 *     renderHeader: ((desc: *, instance: Popover) => NdChild)|null,
 *     renderFooter: ((desc: *, instance: Popover) => NdChild)|null,
 *     render: ((desc: *, instance: Popover) => NdChild)|null,
 *     variant: string|null,
 *     matchTriggerWidth: boolean|null,
 *     updatePositionOn: Observable<*>|null,
 *     props: GlobalAttributes,
 * }, instance: Popover) => NdChild} template
 */
Popover.use = function(template) {
    Popover.defaultTemplate = template;

    if(!NDElement.prototype.popover) {
        NDElement.prototype.popover = function(content, props) {
            this.ghostDom((content instanceof Popover)
                ? content.trigger(this.$element)
                : Popover(content, props).trigger(this.$element));
            return this;
        };
    }
    if(!BaseComponent.prototype.popover) {
        BaseComponent.prototype.popover = function(content, props) {
            this.postBuild(() => {
                if(content instanceof Popover) {
                    this.ghostDom(content.trigger(this.$element));
                } else {
                    this.ghostDom(Popover(content, props).trigger(this.$element));
                }
            });
            return this;
        };
    }

};

/**
 * @param {string} name
 * @param {Function} callback
 */
Popover.preset = function(name, callback) {
    if (Popover.prototype[name] || Popover[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Popover.`);
        return;
    }
    Popover[name] = (content, props) => callback(new Popover(content, props));
};

/**
 * @param {*} presets
 */
Popover.presets = function(presets) {
    for (const name in presets) {
        Popover.preset(name, presets[name]);
    }
};

/**
 * @param {HTMLElement|NDElement} trigger
 * @returns {this}
 */
Popover.prototype.trigger = function(trigger) {
    this.$description.trigger = ElementCreator.getChild(trigger);
    return this;
};

/**
 * @param {'click'|'hover'|'focus'} interaction
 * @returns {this}
 */
Popover.prototype.interaction = function(interaction) {
    this.$description.interaction = interaction;
};

/**
 * @returns {this}
 */
Popover.prototype.onClicked = function() {
    this.$description.interaction = 'click';
    return this;
};

/**
 * @returns {this}
 */
Popover.prototype.onHovered = function() {
    this.$description.interaction = 'hover';
    return this;
};

/**
 * @returns {this}
 */
Popover.prototype.onFocused = function() {
    this.$description.interaction = 'focus';
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
Popover.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

/**
 * @param {NdChild|PopoverHeader} header
 * @returns {this}
 */
Popover.prototype.header = function(header) {
    this.$description.header = header;
    return this;
};

/**
 * @param {NdChild|PopoverFooter} footer
 * @returns {this}
 */
Popover.prototype.footer = function(footer) {
    this.$description.footer = footer;
    return this;
};

/**
 * @param {*} [closeOnEscape]
 * @returns {this}
 */
Popover.prototype.closeOnEscape = function(closeOnEscape = true) {
    this.$description.closeOnEscape = closeOnEscape;
    return this;
};

/**
 * @param {*} [closeOnClickOutside]
 * @returns {this}
 */
Popover.prototype.closeOnClickOutside = function(closeOnClickOutside = true) {
    this.$description.closeOnClickOutside = closeOnClickOutside;
    return this;
};

/**
 * @param {*} [trap]
 * @returns {this}
 */
Popover.prototype.focusTrap = function(trap = true) {
    this.$description.focusTrap = trap;
    return this;
};

/**
 * @param {*} [returnFocus]
 * @returns {this}
 */
Popover.prototype.returnFocus = function(returnFocus = true) {
    this.$description.returnFocus = returnFocus;
    return this;
};

/**
 * @param {string} position
 * @returns {this}
 */
Popover.prototype.position = function(position) {
    this.$description.position = position;
    return this;
};

/**
 * @param {number} offset
 * @returns {this}
 */
Popover.prototype.offset = function(offset) {
    this.$description.offset = offset;
    return this;
};

/**
 * @param {*} [arrow]
 * @returns {this}
 */
Popover.prototype.arrow = function(arrow = true) {
    this.$description.arrow = arrow;
    return this;
};

/**
 * @param {*} shift
 * @returns {this}
 */
Popover.prototype.shift = function(shift) {
    this.$description.shift = shift;
    return this;
};

/**
 * @param {Observable<boolean>} observable
 * @returns {this}
 */
Popover.prototype.bindOpen = function(observable) {
    this.$description.isOpen = observable;
    return this;
};

/**
 * @param {*} data
 * @returns {this}
 */
Popover.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

/**
 * @returns {this}
 */
Popover.prototype.open = function() {
    this.$description.isOpen.set(true);
    this.emit('open');
    return this;
};


/**
 * @returns {this}
 */
Popover.prototype.close = function() {
    this.$description.isOpen.set(false);
    this.emit('close');
    return this;
};


/**
 * @returns {this}
 */
Popover.prototype.toggle = function() {
    this.$description.isOpen.val() ? this.close() : this.open();
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Popover.prototype.onOpen = function(handler) {
    this.on('open', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Popover.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Popover.prototype.renderTrigger = function(renderFn) {
    this.$description.renderTrigger = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Popover.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Popover.prototype.renderHeader = function(renderFn) {
    this.$description.renderHeader = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Popover.prototype.renderFooter = function(renderFn) {
    this.$description.renderFooter = renderFn;
    return this;
};

/**
 * @param {string} variant
 * @returns {this}
 */
Popover.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};

/**
 * @returns {this}
 */
Popover.prototype.primary = function() {
    this.$description.variant = 'primary';
    return this;
};

/**
 * @returns {this}
 */
Popover.prototype.success = function() {
    this.$description.variant = 'success';
    return this;
};

/**
 * @returns {this}
 */
Popover.prototype.warning = function() {
    this.$description.variant = 'warning';
    return this;
};

/**
 * @returns {this}
 */
Popover.prototype.danger = function() {
    this.$description.variant = 'danger';
    return this;
};

/**
 * @returns {this}
 */
Popover.prototype.info = function() {
    this.$description.variant = 'info';
    return this;
};

/**
 * @returns {this}
 */
Popover.prototype.matchTriggerWidth = function() {
    this.$description.matchTriggerWidth = true;
    return this;
};

/**
 * @param {*} updatePositionOn
 * @returns {this}
 */
Popover.prototype.updatePositionOn = function(updatePositionOn) {
    this.$description.updatePositionOn = updatePositionOn;
    return this;
};