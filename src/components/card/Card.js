import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';

/**
 * Versatile content container with optional image, header, footer, actions. Supports clickable, hoverable, loading, and horizontal layouts.
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
 * @param {GlobalAttributes} [props={}]
 */
export default function Card(props = {}) {
    if (!(this instanceof Card)) {
        return new Card(props);
    }

    this.$description = {
        title:         null,
        subtitle:      null,
        image:         null,
        imagePosition: 'top',
        content:       null,
        variant:       null,
        loading:       null,
        horizontal:    false,
        hoverable:     false,
        actions:       [],
        renderImage:   null,
        renderHeader:  null,
        renderContent: null,
        renderFooter:  null,
        renderActions: null,
        layout:        null,
        props,
    };
    this.aria = {};
}

BaseComponent.extends(Card);
BaseComponent.use(Card, HasEventEmitter);

Card.defaultTemplate = null;

/**
 * Registers the render template for Card.
 * @param {(description: {
 *     title: NdChild|null,
 *     subtitle: NdChild|null,
 *     image: string|null,
 *     imagePosition: 'top'|'bottom'|'left'|'right',
 *     content: NdChild|null,
 *     variant: 'elevated'|'outlined'|'flat'|string|null,
 *     loading: Observable<boolean>|null,
 *     horizontal: boolean,
 *     hoverable: boolean,
 *     actions: { label: NdChild, callback: () => void }[],
 *     renderImage: ((desc: *, instance: Card) => NdChild)|null,
 *     renderHeader: ((desc: *, instance: Card) => NdChild)|null,
 *     renderContent: ((desc: *, instance: Card) => NdChild)|null,
 *     renderFooter: ((desc: *, instance: Card) => NdChild)|null,
 *     renderActions: ((desc: *, instance: Card) => NdChild)|null,
 *     layout: ((slots: { header: NdChild, content: NdChild, footer: NdChild, image: NdChild, actions: NdChild }, instance: Card) => NdChild)|null,
 *     props: GlobalAttributes,
 * }, instance: Card) => NdChild} template
 */
Card.use = function(template) {
    Card.defaultTemplate = template;
};

/**
 * @param {NdChild} title
 * @returns {this}
 */
Card.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};

/**
 * @param {NdChild} subtitle
 * @returns {this}
 */
Card.prototype.subtitle = function(subtitle) {
    this.$description.subtitle = subtitle;
    return this;
};

/**
 * @param {string} src
 * @param {'top'|'bottom'|'left'|'right'} [position='top']
 * @returns {this}
 */
Card.prototype.image = function(src, position = 'top') {
    this.$description.image         = src;
    this.$description.imagePosition = position;
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
Card.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

// Appearance

/**
 * @param {string} name
 * @returns {this}
 */
Card.prototype.variant = function(name) {
    this.$description.variant = name;
    return this;
};

/**
 * @returns {this}
 */
Card.prototype.elevated = function() {
    return this.variant('elevated');
};

/**
 * @returns {this}
 */
Card.prototype.outlined = function() {
    return this.variant('outlined');
};

/**
 * @returns {this}
 */
Card.prototype.flat = function() {
    return this.variant('flat');
};

// Behavior

/**
 * @param {Function} handler
 * @returns {this}
 */
Card.prototype.clickable = function(handler) {
    return this.onClick(handler);
};

/**
 * @returns {this}
 */
Card.prototype.hoverable = function() {
    this.$description.hoverable = true;
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [isLoading=true]
 * @returns {this}
 */
Card.prototype.loading = function(isLoading = true) {
    this.$description.loading = BaseComponent.obs(isLoading);
    return this;
};

// Layout

/**
 * @returns {this}
 */
Card.prototype.horizontal = function() {
    this.$description.horizontal = true;
    return this;
};

// Actions

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
 * @returns {this}
 */
Card.prototype.clearActions = function() {
    this.$description.actions = [];
    return this;
};

// Events

/**
 * @param {Function} handler
 * @returns {this}
 */
Card.prototype.onClick = function(handler) {
    this.on('click', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Card.prototype.onHover = function(handler) {
    this.on('hover', handler);
    return this;
};

// Custom renderers

/**
 * @param {(desc: *, instance: Card) => NdChild} renderFn
 * @returns {this}
 */
Card.prototype.renderImage = function(renderFn) {
    this.$description.renderImage = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: Card) => NdChild} renderFn
 * @returns {this}
 */
Card.prototype.renderHeader = function(renderFn) {
    this.$description.renderHeader = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: Card) => NdChild} renderFn
 * @returns {this}
 */
Card.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: Card) => NdChild} renderFn
 * @returns {this}
 */
Card.prototype.renderFooter = function(renderFn) {
    this.$description.renderFooter = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: Card) => NdChild} renderFn
 * @returns {this}
 */
Card.prototype.renderActions = function(renderFn) {
    this.$description.renderActions = renderFn;
    return this;
};

/**
 * @param {(slots: { header: NdChild, content: NdChild, footer: NdChild, image: NdChild, actions: NdChild }, instance: Card) => NdChild} layoutFn
 * @returns {this}
 */
Card.prototype.layout = function(layoutFn) {
    this.$description.layout = layoutFn;
    return this;
};
