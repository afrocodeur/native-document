import BaseComponent from '../BaseComponent';
import HasItems from '../$traits/has-items/HasItems';

/**
 * Groups ListItem instances under a header/footer inside a List.
 *
 *
 * @example
 * const group = new ListGroup(Span('Favourites'))
 *     .inset(true)
 *     .renderHeader((desc, instance) => H3(desc.header));
 *
 * @constructor
 * @param {NdChild} [label]
 * @param {GlobalAttributes} [config={}]
 */
export default function ListGroup(label, config = {}) {
    if(!(this instanceof ListGroup)) {
        return new ListGroup(label, config);
    }

    this.$description = {
        header: label || null,
        footer: null,
        items: [],
        inset: false,
        data: null,
        renderHeader: null,
        renderFooter: null,
        render: null,
        ...config,
    };
}

BaseComponent.extends(ListGroup);
BaseComponent.use(ListGroup, HasItems);

ListGroup.defaultTemplate = null;

/**
 * Registers the render template for ListGroup.
 * @param {(description: {
 *     header: NdChild|null,
 *     footer: NdChild|null,
 *     items: *[],
 *     inset: boolean,
 *     data: *|null,
 *     renderHeader: ((desc: *, instance: ListGroup) => NdChild)|null,
 *     renderFooter: ((desc: *, instance: ListGroup) => NdChild)|null,
 *     render: ((desc: *, instance: ListGroup) => NdChild)|null,
 *     props: GlobalAttributes,
 * }, instance: ListGroup) => NdChild} template
 */
ListGroup.use = function(template) {
    ListGroup.defaultTemplate = template;
};

/**
 * @param {NdChild} header
 * @returns {this}
 */
ListGroup.prototype.header = function(header) {
    this.$description.header = header;
    return this;
};

/**
 * @param {NdChild} title
 * @returns {this}
 */
ListGroup.prototype.title = function(title) {
    return this.header(title);
};

/**
 * @param {NdChild} footer
 * @returns {this}
 */
ListGroup.prototype.footer = function(footer) {
    this.$description.footer = footer;
    return this;
};

/**
 * @param {number} [inset]
 * @returns {this}
 */
ListGroup.prototype.inset = function(inset = true) {
    this.$description.inset = inset;
    return this;
};

/**
 * @param {*} data
 * @returns {this}
 */
ListGroup.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
ListGroup.prototype.renderHeader = function(renderFn) {
    this.$description.renderHeader = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
ListGroup.prototype.renderFooter = function(renderFn) {
    this.$description.renderFooter = renderFn;
    return this;
};