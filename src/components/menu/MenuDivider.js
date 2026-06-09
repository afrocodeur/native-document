import BaseComponent from '../BaseComponent';


/**
 * Visual separator between items or groups in a Menu.
 *
 *
 * @example
 * menu.item('Edit').separator().item('Delete');
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function MenuDivider(props = {}) {
    if(!(this instanceof MenuDivider)) {
        return new MenuDivider(props);
    }

    this.$description = {
        props,
    };
    this.aria = { 'role': 'separator' };
}

BaseComponent.extends(MenuDivider);


MenuDivider.defaultTemplate = null;

/**
 * Registers the render template for MenuDivider.
 * @param {(description: {
 *     props: GlobalAttributes,
 * }, instance: MenuDivider) => NdChild} template
 */
MenuDivider.use = function(template) {
    MenuDivider.defaultTemplate = template;
};