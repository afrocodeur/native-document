import BaseComponent from '../BaseComponent';

/**
 * Visual separator between items in a List.
 *
 * @example
 * List()
 *     .item('Dashboard')
 *     .divider()
 *     .item('Settings')
 *
 * ListDivider.use((description, instance) => {
 *     return Li({ class: 'list-divider', role: 'separator' });
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props={}]
 */
export default function ListDivider(props = {}) {
    if (!(this instanceof ListDivider)) {
        return new ListDivider(props);
    }

    BaseComponent.call(this, props);

    this.$description = { props };
}

BaseComponent.extends(ListDivider);

ListDivider.defaultTemplate = null;

/**
 * Registers the render template for ListDivider.
 * @param {(description: { props: GlobalAttributes }, instance: ListDivider) => NdChild} template
 */
ListDivider.use = function(template) {
    ListDivider.defaultTemplate = template;
};
