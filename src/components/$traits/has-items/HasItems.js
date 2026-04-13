import {$} from "../../../../index";

/**
 * Mixin for managing a collection of items with manipulation methods
 * @class
 */
export default function HasItems() {}


HasItems.prototype.trailing = () => {}

/**
 * Sets a dynamic observable array to store items
 * @param {ObservableArray?} [observableArray=null] - Observable array to use, or creates a new one if null
 * @returns {HasItems}
 */
HasItems.prototype.dynamic = function(observableArray = null) {
    this.$description.items = observableArray || $.array([]);
    return this;
};
HasItems.prototype.bind = HasItems.prototype.dynamic;

/**
 * Replaces all existing items with a new array of items
 * @param {Array} items - Array of new items
 * @returns {HasItems}
 */
HasItems.prototype.items = function(items) {
    this.$description.items.splice(0, this.$description.items.length, ...items);
    return this;
};


/**
 * Clears all items from the collection
 * @returns {HasItems}
 */
HasItems.prototype.clear = function() {
    const items = this.$description.items;
    if(Array.isArray(items)) {
        items.splice(0, items.length);
        return this;
    }
    items.clear();
    return this;
};

/**
 * Removes a specific item from the collection
 * @param {*} item - The item to remove
 * @returns {HasItems}
 */
HasItems.prototype.removeItem = function(item) {
    const items = this.$description.items;
    if(Array.isArray(items)) {
        const index = items.indexOf(item);
        if(index > -1) {
            items.splice(index, 1);
            return this;
        }
    }
    items.removeItem(item);
    return this;
};
