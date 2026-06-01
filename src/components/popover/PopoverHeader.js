import BaseComponent from '../BaseComponent';

/**
 * Optional header slot for a Popover, with an optional close button.
 *
 *
 * @example
 * const header = new PopoverHeader(Span('Filter options'))
 *     .showClose(true)
 *     .render((desc, instance) => H4(desc.content));
 *
 * @constructor
 * @param {NdChild} [content]
 * @param {GlobalAttributes} [config={}]
 */
export default function PopoverHeader(content, config = {}) {
    if(!(this instanceof PopoverHeader)) {
        return new PopoverHeader(content, config);
    }

    this.$description = {
        content: content || null,
        showClose: false,
        data: null,
        render: null,
        ...config,
    };
}

BaseComponent.extends(PopoverHeader);

PopoverHeader.defaultTemplate = null;

/**
 * Registers the render template for PopoverHeader.
 * @param {(description: {
 *     content: NdChild|null,
 *     showClose: boolean,
 *     data: *|null,
 *     render: ((desc: *, instance: PopoverHeader) => NdChild)|null,
 * }, instance: PopoverHeader) => NdChild} template
 */
PopoverHeader.use = function(template) {
    PopoverHeader.defaultTemplate = template.popoverHeader;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
PopoverHeader.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

PopoverHeader.prototype.showClose = function(show = true) {
    this.$description.showClose = show;
    return this;
};

/**
 * @param {*} data
 * @returns {this}
 */
PopoverHeader.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};