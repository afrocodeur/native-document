import BaseComponent from '../BaseComponent';

export default function Spacer(props = {}) {
    if (!(this instanceof Spacer)) {
        return new Spacer(props);
    }
    BaseComponent.call(this, props);
    this.$description = {
        type: 'spacer',
        props,
    };
}
BaseComponent.extends(Spacer);

Spacer.defaultTemplate = null;
/**
 *
 *
 * Registers the render template for Spacer.
 * @param {(description: {
 *     type: 'spacer',
 *     props: GlobalAttributes,
 * }, instance: Spacer) => NdChild} template
 */
Spacer.use = function(template) {
    Spacer.defaultTemplate = template;
};