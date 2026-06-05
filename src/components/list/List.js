import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import HasItems from '../$traits/has-items/HasItems';
import { $ } from '../../core/data/Observable';
import HasListItem from './HasListItem';

/**
 * Flexible list container supporting single/multi selection, checkbox or click-to-select modes, dividers, and inset styling.
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
 * @param {GlobalAttributes} [props]
 */
export default function List(props = {}) {
    if (!(this instanceof List)) {
        return new List(props);
    }

    this.$description = {
        selectable:       $(false),
        multiSelect:      $(false),
        selectedValues:   $.array(),
        inset:            $(0),
        divider:          false,
        items:            $.array(),
        render:           null,
        selectByCheckbox: $(false),
        selectByClick:    $(false),
        loopOnKeyboard:   $(false),
        props,
    };
}

List.defaultTemplate = null;

/**
 * Registers the render template for List.
 * @param {(description: {
 *     selectable:       ObservableItem<boolean>,
 *     multiSelect:      ObservableItem<boolean>,
 *     selectedValues:   ObservableArray<*>,
 *     inset:            ObservableItem<number>,
 *     divider:          boolean,
 *     data:             *|null,
 *     render:           ((desc: *, instance: List) => NdChild)|null,
 *     selectByCheckbox: ObservableItem<boolean>,
 *     selectByClick:    ObservableItem<boolean>,
 *     loopOnKeyboard:   ObservableItem<boolean>,
 *     items:            ObservableArray<*>,
 *     props:            GlobalAttributes,
 * }, instance: List) => NdChild} template
 */
List.use = function(template) {
    List.defaultTemplate = template;
};

BaseComponent.extends(List);
BaseComponent.use(List, HasItems, HasEventEmitter, HasListItem);


/**
 * @param {ObservableArray<*>|Observable<*[]>} observable
 * @returns {this}
 */
List.prototype.selectedValuesModel = function(observable) {
    this.$description.selectedValues = observable;
    return this;
};

/**
 * Inset padding in px applied to all items.
 * @param {number} [inset=0]
 * @returns {this}
 */
List.prototype.inset = function(inset = 0) {
    this.$description.inset.set(inset);
    return this;
};

/**
 * @param {boolean} [divider=true]
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
    this.$description.items = data;
    return this;
};

/**
 * @param {(item: *, event: MouseEvent) => void} handler
 * @returns {this}
 */
List.prototype.onItemClick = function(handler) {
    this.on('itemClick', handler);
    return this;
};

/**
 * @param {(item: *) => void} handler
 * @returns {this}
 */
List.prototype.onItemSelect = function(handler) {
    this.on('itemSelect', handler);
    return this;
};
