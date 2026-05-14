import DropdownItem from "./DropdownItem";
import BaseComponent from "../BaseComponent";
import DropdownDivider from "./DropdownDivider";
import { $ } from "../../core/data/Observable";
import {normalizeDropdownItem} from "./helpers";

export default function DropdownGroup(props) {
    if(!(this instanceof DropdownGroup)) {
        return new DropdownGroup(props);
    }

    DropdownItem.call(this, props);

    Object.assign(this.$description, {
        items: $.array([]),
    });
}

BaseComponent.extends(DropdownGroup, DropdownItem);

DropdownGroup.defaultTemplate = null;
DropdownGroup.use = function(template) {
    DropdownGroup.defaultTemplate = template;
};

DropdownGroup.prototype.add = function(item, props) {
    this.$description.items.push(normalizeDropdownItem(item, null, props));
    return this;
};

DropdownGroup.prototype.menu = DropdownGroup.prototype.add;
DropdownGroup.prototype.item = DropdownGroup.prototype.add;

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
