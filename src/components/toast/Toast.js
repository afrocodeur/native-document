import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import {Observable} from '../../core/data/Observable';

/**
 * Non-blocking notification toast. Supports type variants, duration, pause-on-hover, actions, and positioning.
 *
 * @example
 * const toast = new Toast(Span('File saved successfully'))
 *     .success()
 *     .duration(4000)
 *     .closable(true)
 *     .pauseOnHover(true)
 *     .atTopTrailing()
 *     .action('View', () => navigate('/files'))
 *     .onClose(() => console.log('dismissed'));
 *
 * Toast.use((description, instance) => {
 *     return Div({ class: \`toast toast--\${description.type}\` }, description.content);
 * });
 *
 * @constructor
 * @param {NdChild} content
 * @param {GlobalAttributes} [props={}]
 */
export default function Toast(content, props = {}) {
    if (!(this instanceof Toast)) {
        return new Toast(content, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        visibility: Observable(true),
        type: null,
        title: null,
        content,
        icon: null,
        showIcon: true,
        duration: 5000,
        closable: true,
        pauseOnHover: true,
        position: 'top-trailing',
        actions: [],
        render: null,
        props,
    };
}

BaseComponent.extends(Toast);
BaseComponent.use(Toast, HasEventEmitter);

Toast.defaultTemplate = null;

/**
 * Registers the render template for Toast.
 * @param {(description: {
 *     visibility: Observable<boolean>,
 *     type: 'info'|'success'|'warning'|'error'|string|null,
 *     title: NdChild|null,
 *     content: NdChild,
 *     icon: NdChild|null,
 *     showIcon: boolean,
 *     duration: number,
 *     closable: boolean,
 *     pauseOnHover: boolean,
 *     position: 'top-leading'|'top-trailing'|'top-center'|'bottom-leading'|'bottom-trailing'|'bottom-center',
 *     actions: Array<{ label: NdChild, handler: Function|null, variant: string|null }>,
 *     render: ((desc: *, instance: Toast) => NdChild)|null,
 *     props: GlobalAttributes,
 * }, instance: Toast) => NdChild} template
 */
Toast.use = function(template) {
    Toast.defaultTemplate = template;
};

// Types
/**
 * @param {string} type
 * @returns {this}
 */
Toast.prototype.type = function(type) {
    this.$description.type = type;
    return this;
};

/**
 * @returns {this}
 */
Toast.prototype.info = function() {
    this.$description.type = 'info';
    return this;
};

/**
 * @returns {this}
 */
Toast.prototype.success = function() {
    this.$description.type = 'success';
    return this;
};

/**
 * @returns {this}
 */
Toast.prototype.warning = function() {
    this.$description.type = 'warning';
    return this;
};

/**
 * @returns {this}
 */
Toast.prototype.error = function() {
    this.$description.type = 'error';
    return this;
};

/**
 * @param {NdChild} title
 * @returns {this}
 */
Toast.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
Toast.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
Toast.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * @param {boolean} [show]
 * @returns {this}
 */
Toast.prototype.showIcon = function(show = true) {
    this.$description.showIcon = show;
    return this;
};

// Behavior
/**
 * @param {number} ms
 * @returns {this}
 */
Toast.prototype.duration = function(ms) {
    this.$description.duration = ms;
    return this;
};

/**
 * @param {boolean} [closable]
 * @returns {this}
 */
Toast.prototype.closable = function(closable = true) {
    this.$description.closable = closable;
    return this;
};

/**
 * @param {*} [pauseOnHover]
 * @returns {this}
 */
Toast.prototype.pauseOnHover = function(pauseOnHover = true) {
    this.$description.pauseOnHover = pauseOnHover;
    return this;
};

// Position

/**
 * @param {'top-leading'|'top-trailing'|'top-center'|'bottom-leading'|'bottom-trailing'|'bottom-center'} position
 * @returns {this}
 */
Toast.prototype.position = function(position) {
    this.$description.position = position;
    return this;
};

/**
 * @returns {this}
 */
Toast.prototype.atTopLeading = function() {
    return this.position('top-leading');
};

/**
 * @returns {this}
 */
Toast.prototype.atTopTrailing = function() {
    return this.position('top-trailing');
};

/**
 * @returns {this}
 */
Toast.prototype.atBottomLeading = function() {
    return this.position('bottom-leading');
};

/**
 * @returns {this}
 */
Toast.prototype.atBottomTrailing = function() {
    return this.position('bottom-trailing');
};

/**
 * @returns {this}
 */
Toast.prototype.atTopCenter = function() {
    return this.position('top-center');
};

/**
 * @returns {this}
 */
Toast.prototype.atBottomCenter = function() {
    return this.position('bottom-center');
};

/**
 * @param {NdChild} label
 * @param {(() => void)} [handler]
 * @param {string|null} [variant=null]
 * @returns {this}
 */
Toast.prototype.action = function(label, handler, variant = null) {
    handler = handler || (() => this.close());
    this.$description.actions.push({ label, handler, variant });
    return this;
};

Toast.prototype.close = function() {
    this.$description.visibility?.set(false);
    this.emit('close');
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Toast.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};

Toast.prototype.show = BaseComponent.prototype.toNdElement;