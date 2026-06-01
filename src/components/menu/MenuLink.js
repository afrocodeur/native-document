import MenuItem from './MenuItem';
import HasMenuItem from './HasMenuItem';


/**
 * A MenuItem that renders as an anchor (<a>). Inherits all MenuItem methods and adds target control.
 *
 *
 * @example
 * const link = new MenuLink()
 *     .label(Span('Docs'))
 *     .href('https://docs.example.com')
 *     .target('_blank')
 *     .icon(ExternalLinkIcon());
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function MenuLink(props = {}) {
    if(!(this instanceof MenuLink)) {
        return new MenuLink(props);
    }
    MenuItem.call(this, props);
}

MenuLink.prototype = Object.create(MenuItem.prototype);
MenuLink.prototype.constructor = MenuLink;

HasMenuItem.components.MenuLink = MenuLink;

MenuLink.defaultTemplate = null;

/**
 * Registers the render template for MenuLink.
 * @param {(description: {
 *     [key: string]: *
 * }, instance: MenuLink) => NdChild} template
 */
MenuLink.use = function(template) {
    MenuLink.defaultTemplate = template;
};

/**
 *
 * @param {*} target
 * @returns {this}
 */
MenuLink.prototype.target = function (target) {
    this.$description.target = target;
    return this;
};