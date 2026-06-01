
import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import HasItems from "../$traits/has-items/HasItems";

/**
 * Flexible list container supporting single/multi selection, checkbox or click-to-select modes, dividers, and inset styling.
 *
 *
 * @example
 * const list = new List()
 *     .selectable(true)
 *     .multiSelect(true)
 *     .withDivider(true)
 *     .onItemClick((item, e) => console.log(item))
 *     .onItemSelect((item) => console.log('selected', item));
 *
 * List.use((description, instance) => {
 *     return Ul({ class: 'list' });
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [config]
 */
export default function List(config = {}) {
    if(!(this instanceof List)) {
        return new List(config);
    }

    this.$description = {
        selectable: false,
        multiSelect: false,
        selectedValues: null,
        inset: false,
        divider: false,
        data: null,
        render: null,
        selectByCheckbox: false,
        selectByClick: false,
        loopOnKeyboard: true,
        ...config
    };

}

List.defaultTemplate = null;

/**
 * Registers the render template for List.
 * @param {(description: {
 *     selectable: boolean,
 *     multiSelect: boolean,
 *     selectedValues: Observable<*[]>|null,
 *     inset: boolean,
 *     divider: boolean,
 *     data: *|null,
 *     render: ((desc: *, instance: List) => NdChild)|null,
 *     selectByCheckbox: boolean,
 *     selectByClick: boolean,
 *     loopOnKeyboard: boolean,
 *     props: GlobalAttributes,
 * }, instance: List) => NdChild} template
 */
List.use = function(template) {
    List.defaultTemplate = template.list;
};

BaseComponent.extends(List);
BaseComponent.use(List, HasItems, HasEventEmitter);

List.defaultTemplate = null;

List.use = function(template) {
    List.defaultTemplate = template.list;
};

/**
 * @param {*} [selectable]
 * @returns {this}
 */
List.prototype.selectable = function(selectable = true) {
    this.$description.selectable = selectable;
    return this;
};

/**
 * @returns {this}
 */
List.prototype.selectByClick = function() {
    this.$description.selectByClick = true;
    this.$description.selectByCheckbox = false;
    return this;
};

/**
 * @returns {this}
 */
List.prototype.selectByCheckbox = function() {
    this.$description.selectByClick = false;
    this.$description.selectByCheckbox = true;
    return this;
};

/**
 * @param {*} [multi]
 * @returns {this}
 */
List.prototype.multiSelect = function(multi = true) {
    this.$description.multiSelect = multi;
    this.$description.selectable = true;
    return this;
};

/**
 * @param {Observable<*[]>} observable
 * @returns {this}
 */
List.prototype.selectedValuesModel = function(observable) {
    this.$description.selectedValues = observable;
    return this;
};

/**
 * @param {number} [inset]
 * @returns {this}
 */
List.prototype.inset = function(inset = true) {
    this.$description.inset = inset;
    return this;
};

/**
 * @returns {this}
 */
List.prototype.next = function() {
    // TODO:
    return this;
};

/**
 * @returns {this}
 */
List.prototype.preview = function() {
    // TODO:
    return this;
};

/**
 * @param {*} loopOnKeyboard
 * @returns {this}
 */
List.prototype.loopOnKeyboard = function(loopOnKeyboard) {
    this.$description.loopOnKeyboard = loopOnKeyboard;
    return this;
};

/**
 * @param {*} [divider]
 * @returns {this}
 */
List.prototype.withDivider = function(divider = true) {
    this.$description.divider = divider;
    return this;
};

/**
 * @param {*} data
 * @returns {this}
 */
List.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

/**
 * @param {(item: ListItem, event: MouseEvent) => void} handler
 * @returns {this}
 */
List.prototype.onItemClick = function(handler) {
    this.on('itemClick', handler);
    return this;
};

/**
 * @param {(item: ListItem) => void} handler
 * @returns {this}
 */
List.prototype.onItemSelect = function(handler) {
    this.on('itemSelect', handler);
    return this;
};