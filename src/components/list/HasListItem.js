import ListDivider from './ListDivider';
import List from './List';
import BaseComponent from '../BaseComponent';

const EMPTY_OPTIONS = {};

/**
 * Trait that adds item/group/divider management to List and ListGroup.
 * Mirrors the HasMenuItem pattern.
 *
 * @constructor
 */
export default function HasListItem() {}

HasListItem.components = {
    ListItem:  null,
    ListGroup: null,
};


/**
 * @param {ObservableArray<*>|*[]} list
 * @returns {this}
 */
HasListItem.prototype.selectInto = function(list) {
    this.$description.selectedValues = list;
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [selectable=true]
 * @returns {this}
 */
HasListItem.prototype.selectable = function(selectable = true) {
    this.$description.selectable = BaseComponent.obs(selectable);
    return this;
};

/**
 * Select items on click. Mutually exclusive with selectByCheckbox.
 * @returns {this}
 */
HasListItem.prototype.selectByClick = function() {
    this.$description.selectByClick.set(true);
    this.$description.selectByCheckbox.set(false);
    return this;
};

/**
 * Select items via a checkbox. Mutually exclusive with selectByClick.
 * @returns {this}
 */
HasListItem.prototype.selectByCheckbox = function() {
    this.$description.selectByClick.set(false);
    this.$description.selectByCheckbox.set(true);
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [multi=true]
 * @returns {this}
 */
HasListItem.prototype.multiSelect = function(multi = true) {
    this.$description.multiSelect = BaseComponent.obs(multi);
    this.$description.selectable.set(true);
    return this;
};

/**
 * @param {boolean} loopOnKeyboard
 * @returns {this}
 */
HasListItem.prototype.loopOnKeyboard = function(loopOnKeyboard) {
    this.$description.loopOnKeyboard = loopOnKeyboard;
    return this;
};

/**
 * @param {ListItem|ListGroup|ListDivider} item
 * @returns {this}
 */
HasListItem.prototype.add = function(item) {
    if (item === this) {
        return this;
    }
    item.$parent = this;
    this.$description.items.push(item);
    return this;
};

/**
 * @param {NdChild} label
 * @param {NdChild|((item: ListItem) => void)} [iconOrBuilder]
 * @param {((item: ListItem) => void)} [builder]
 * @returns {this}
 */
HasListItem.prototype.item = function(label, iconOrBuilder, builder) {
    const ListItem = HasListItem.components.ListItem;
    const item = new ListItem();
    item.$parent = this;

    item.label(label);

    if (typeof iconOrBuilder === 'function') {
        iconOrBuilder(item);
    } else if (iconOrBuilder) {
        item.icon(iconOrBuilder);
        if (typeof builder === 'function') {
            builder(item);
        }
    }

    this.$description.items.push(item);
    return this;
};

/**
 * @param {NdChild} label
 * @param {NdChild|((group: ListGroup) => void)} [iconOrBuilder]
 * @param {((group: ListGroup) => void)} [builder]
 * @returns {this}
 */
HasListItem.prototype.group = function(label, iconOrBuilder, builder) {
    const ListGroup = HasListItem.components.ListGroup;
    const group = new ListGroup(label);
    group.$parent = this;

    if (typeof iconOrBuilder === 'function') {
        iconOrBuilder(group);
    } else if (iconOrBuilder) {
        group.icon(iconOrBuilder);
        if (typeof builder === 'function') {
            builder(group);
        }
    }

    this.$description.items.push(group);
    return this;
};

/**
 * @returns {this}
 */
HasListItem.prototype.divider = function() {
    const divider = new ListDivider();
    divider.$parent = this;
    this.$description.items.push(divider);
    return this;
};


/**
 * Populate items from a data source using a builder function.
 * The builder receives each data item and must return a ListItem or ListGroup.
 *
 * @param {ObservableArray<*>|*[]} source
 * @param {(item: *) => ListItem|ListGroup} builder
 * @returns {this}
 */
HasListItem.prototype.from = function(source, builder) {
    this.$description.items = source;
    this.$description.itemBuilder = (...args) => {
        if(args[0].__$ListInstance) {
            return args[0];
        }
        const item = builder(...args);
        item.$parent = this;
        return item;
    };
    return this;
};
