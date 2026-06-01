import BaseComponent from '../BaseComponent';

/**
 * Visual separator between groups or items inside a Dropdown.
 *
 *
 * @example
 * dropdown.add(item1).divider().add(item2);
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function DropdownDivider(props = {}) {
    if(!(this instanceof DropdownDivider)) {
        return new DropdownDivider();
    }
    this.$description  = {
        type: 'divider',
        props,
    };
}

BaseComponent.extends(DropdownDivider);

DropdownDivider.defaultTemplate = null;

/**
 * Registers the render template for DropdownDivider.
 * @param {(description: {
 *     [key: string]: *
 * }, instance: DropdownDivider) => NdChild} template
 */
DropdownDivider.use = function(template) {
    DropdownDivider.defaultTemplate = template;
};


/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
DropdownDivider.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};
