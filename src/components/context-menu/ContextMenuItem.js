import MenuItem from '../menu/MenuItem';

/**
 *
 *
 * @constructor
 * @param {GlobalAttributes} [config]
 */
export default function ContextMenuItem(config) {
    if(!(this instanceof ContextMenuItem)) {
        return new ContextMenuItem(config);
    }

    MenuItem.call(this, config);

    this.aria = { 'role': 'menuitem' };
}


ContextMenuItem.defaultTemplate = null;

/**
 * Registers the render template for ContextMenuItem.
 * @param {(description: {
 *     [key: string]: *
 * }, instance: ContextMenuItem) => NdChild} template
 */
ContextMenuItem.use = function(template) {
    ContextMenuItem.defaultTemplate = template;
};