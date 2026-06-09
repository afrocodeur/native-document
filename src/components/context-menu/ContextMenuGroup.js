import MenuGroup from '../menu/MenuGroup';

/**
 *
 *
 * @constructor
 * @param {NdChild} label
 * @param {GlobalAttributes} [config]
 */
export default function ContextMenuGroup(label, config) {
    if(!(this instanceof ContextMenuGroup)) {
        return new ContextMenuGroup(label, config);
    }

    MenuGroup.call(this, label, config);

    this.aria = { 'role': 'group' };
}


ContextMenuGroup.defaultTemplate = null;

/**
 * Registers the render template for ContextMenuGroup.
 * @param {(description: {
 *     [key: string]: *
 * }, instance: ContextMenuGroup) => NdChild} template
 */
ContextMenuGroup.use = function(template) {
    ContextMenuGroup.defaultTemplate = template;
};