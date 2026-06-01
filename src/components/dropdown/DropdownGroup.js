import DropdownItem from './types/DropdownItem';
import BaseComponent from '../BaseComponent';
import DropdownDivider from './types/DropdownDivider';
import { $ } from '../../core/data/Observable';
import {normalizeDropdownItem} from './helpers';

/**
 * Groups DropdownItem instances under a heading inside a Dropdown.
 *
 *
 * @example
 * dropdown.group((group) => {
 *     group.add(new DropdownItem().value('en').content(Span('English')))
 *          .add(new DropdownItem().value('fr').content(Span('French')));
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
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

/**
 * Registers the render template for DropdownGroup.
 * @param {(description: {
 *     [key: string]: *
 * }, instance: DropdownGroup) => NdChild} template
 */
DropdownGroup.use = function(template) {
    DropdownGroup.defaultTemplate = template;
};

/**
 * @param {DropdownItem|NdChild|*} item
 * @param {GlobalAttributes} [props]
 * @returns {this}
 */
DropdownGroup.prototype.add = function(item, props) {
    this.$description.items.push(normalizeDropdownItem(item, null, props));
    return this;
};

/**
 * Alias for {@link DropdownGroup.prototype.add}
 */
DropdownGroup.prototype.menu = DropdownGroup.prototype.add;

/**
 * Alias for {@link DropdownGroup.prototype.add}
 */
DropdownGroup.prototype.item = DropdownGroup.prototype.add;

/**
 * @param {(group: DropdownGroup) => void} groupBuilder
 * @returns {this}
 */
DropdownGroup.prototype.group = function(groupBuilder) {
    const item = new DropdownGroup();
    groupBuilder && groupBuilder(item);
    this.$description.items.push(item);
    return this;
};

/**
 * @returns {this}
 */
DropdownGroup.prototype.divider = function() {
    this.$description.items.push(new DropdownDivider());
    return this;
};
