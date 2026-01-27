import BaseComponent from "@components/BaseComponent";

export default function DropdownDivider() {
    if(!(this instanceof DropdownDivider)) {
        return new DropdownDivider();
    }
    this.$description  = {
        type: 'divider'
    };
}

BaseComponent.extends(DropdownDivider);

DropdownDivider.defaultTemplate = null;

DropdownDivider.use = function(template) {
    DropdownDivider.defaultTemplate = template.divider;
};


DropdownDivider.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};
