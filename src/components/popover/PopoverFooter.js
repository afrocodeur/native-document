import BaseComponent from '../BaseComponent';

/**
 * Optional footer slot for a Popover.
 *
 *
 * @example
 * const footer = new PopoverFooter(
 *     HStack(Button(Span('Cancel')), Button(Span('Apply')))
 * );
 *
 * @constructor
 * @param {NdChild} [content]
 * @param {GlobalAttributes} [config={}]
 */
export default function PopoverFooter(content, config = {}) {
    if(!(this instanceof PopoverFooter)) {
        return new PopoverFooter(content, config);
    }

    this.$description = {
        content: content || null,
        data: null,
        render: null,
        ...config,
    };
    this.aria = {  };
}

BaseComponent.extends(PopoverFooter);

PopoverFooter.defaultTemplate = null;

/**
 * Registers the render template for PopoverFooter.
 * @param {(description: {
 *     content: NdChild|null,
 *     data: *|null,
 *     render: ((desc: *, instance: PopoverFooter) => NdChild)|null,
 * }, instance: PopoverFooter) => NdChild} template
 */
PopoverFooter.use = function(template) {
    PopoverFooter.defaultTemplate = template.popoverFooter;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
PopoverFooter.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

/**
 * @param {*} data
 * @returns {this}
 */
PopoverFooter.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};