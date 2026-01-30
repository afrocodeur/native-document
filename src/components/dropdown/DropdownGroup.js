import DropdownItem from "./DropdownItem";
import BaseComponent from "../BaseComponent";
import DropdownDivider from "./DropdownDivider";


export default function DropdownGroup(config) {
    if(!(this instanceof DropdownGroup)) {
        return new DropdownGroup(config);
    }

    DropdownItem.call(this, config);

    Object.assign(this.$description, {
        renderItem: config.renderItem || null,
        items: config.items || []
    });
}

BaseComponent.extends(DropdownGroup, DropdownItem);

DropdownGroup.prototype.group = function(groupBuilder) {
    const item = new DropdownGroup();
    groupBuilder && groupBuilder(item);
    this.$description.items.push(item);
    return this;
};

DropdownGroup.prototype.divider = function() {
    this.$description.items.push(new DropdownDivider());
    return this;
};

DropdownGroup.prototype.renderItem = function(renderFn) {
    this.$description.renderItem = renderFn;
};


DropdownGroup.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
};

DropdownGroup.prototype.toNdElement = function() {

};