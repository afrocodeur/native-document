import BaseComponent from '../BaseComponent';

/**
 * Versatile content container with optional image, header, footer, actions. Supports clickable, hoverable, loading, and horizontal layouts.
 *
 *
 * @example
 * const card = new Card()
 *     .title(Span('Card title'))
 *     .subtitle(Span('Subtitle'))
 *     .image('cover.jpg', 'top')
 *     .content(P('Main content goes here.'))
 *     .action('View more', () => navigate('/detail'))
 *     .elevated()
 *     .clickable((e) => console.log('card clicked'));
 *
 * Card.use((description, instance) => {
 *     return Div({ class: 'card' }, description.title, description.content);
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [config={}]
 */
export default function Card(config = {}) {
    if(!(this instanceof Card)) {
        return new Card(config);
    }
    this.$description = {
        ...config,
    };
};

BaseComponent.extends(Card);

Card.defaultTemplate = null;

/**
 * Registers the render template for Card.
 * @param {(description: {
 *     [key: string]: unknown,
 *     props: GlobalAttributes,
 * }, instance: Card) => NdChild} template
 */
Card.use = function(template) {};

/**
 * @param {NdChild} title
 * @returns {this}
 */
Card.prototype.title = function(title) {
    return this;
};

/**
 * @param {NdChild} title
 * @returns {this}
 */
Card.prototype.subtitle = function(title) {
    return this;
};

/**
 * @param {string} src
 * @param {'top'|'bottom'|'left'|'right'} [position='top']
 * @returns {this}
 */
Card.prototype.image = function(src, position = 'top') {
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
Card.prototype.content = function(content) {
    return this;
};

// Appearance

/**
 * @param {string} name
 * @returns {this}
 */
Card.prototype.variant = function(name) {
    return this;
};

/**
 * @returns {this}
 */
Card.prototype.outlined = function() {
    return this;
};

/**
 * @returns {this}
 */
Card.prototype.elevated = function() {
    return this;
};

/**
 * @returns {this}
 */
Card.prototype.flat = function() {
    return this;
};

// Behavior
/**
 * @param {Function} handler
 * @returns {this}
 */
Card.prototype.clickable = function(handler) {
    return this;
};

/**
 * @returns {this}
 */
Card.prototype.hoverable = function() {
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [isLoading]
 * @returns {this}
 */
Card.prototype.loading = function(isLoading = true) {
    return this;
};

// Layout

/**
 * @returns {this}
 */
Card.prototype.horizontal = function() {
    return this;
};

// Events
/**
 * @param {Function} handler
 * @returns {this}
 */
Card.prototype.onClick = function(handler) {
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Card.prototype.onHover = function(handler) {
    return this;
};

/**
 * @returns {this}
 */
Card.prototype.clearActions = function() {
    this.$description.actions = [];
    return this;
};

/**
 * @param {NdChild} label
 * @param {() => void} callback
 * @returns {this}
 */
Card.prototype.action = function(label, callback) {
    this.$description.actions.push({ label, callback });
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Card.prototype.renderImage = function(renderFn) {
    this.$description.renderImage = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Card.prototype.renderHeader = function(renderFn) {
    this.$description.renderHeader = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Card.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Card.prototype.renderFooter = function(renderFn) {
    this.$description.renderFooter = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} layoutFn
 * @returns {this}
 */
Card.prototype.layout = function(layoutFn) {
    this.$description.layout = layoutFn;
    return this;
};

/**
 * @returns {HTMLElement|DocumentFragment}
 */
Card.prototype.toNdElement = function() {
    return this;
};