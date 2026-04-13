import BaseComponent from "../BaseComponent";

export default function DropdownDivider(props = {}) {
    if(!(this instanceof DropdownDivider)) {
        return new DropdownDivider();
    }
    this.$description  = {
        type: 'divider',
        props
    };
}

BaseComponent.extends(DropdownDivider);

DropdownDivider.defaultTemplate = null;

DropdownDivider.use = function(template) {
    DropdownDivider.defaultTemplate = template;
};


DropdownDivider.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};
