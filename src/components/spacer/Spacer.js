import BaseComponent from "../BaseComponent";

export function Spacer(props = {}) {
    if (!(this instanceof Spacer)) {
        return new Spacer(props);
    }
    BaseComponent.call(this, props);
    this.$description = {
        type: 'spacer',
        props
    };
}
BaseComponent.extends(Spacer);

Spacer.defaultTemplate = null;
Spacer.use = function(template) {
    Spacer.defaultTemplate = template;
};