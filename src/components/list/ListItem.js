import BaseComponent from "../BaseComponent";
import Validator from "../../core/utils/validator";
import {$ } from '../../core/data/Observable';

/**
 * A single row inside a List. Supports leading/trailing slots, icon, selection, divider, and disabled state.
 *
 *
 * @example
 * const item = new ListItem(Span('Item label'))
 *     .icon(StarIcon())
 *     .trailing(Span('chevron >'))
 *     .selectable()
 *     .divider(true);
 *
 * ListItem.use((description, instance) => {
 *     return Li(description.leading, description.content, description.trailing);
 * });
 *
 * @constructor
 * @param {NdChild} [content]
 * @param {GlobalAttributes} [config={}]
 */
export default function ListItem(content, config = {}) {
    if(!(this instanceof ListItem)) {
        return new ListItem(content, config);
    }

    this.$description = {
        content: content || null,
        icon: null,
        trailing: null,
        leading: null,
        disabled: false,
        selectable: false,
        selected: false,
        divider: false,
        data: null,
        render: null,
        ...config
    };
}

BaseComponent.extends(ListItem);

ListItem.defaultTemplate = null;

/**
 * Registers the render template for ListItem.
 * @param {(description: {
 *     content: NdChild|null,
 *     icon: NdChild|null,
 *     trailing: NdChild|null,
 *     leading: NdChild|null,
 *     disabled: boolean,
 *     selectable: boolean,
 *     selected: boolean|Observable<boolean>,
 *     divider: boolean,
 *     data: *|null,
 *     render: ((desc: *, instance: ListItem) => NdChild)|null,
 *     props: GlobalAttributes,
 * }, instance: ListItem) => NdChild} template
 */
ListItem.use = function(template) {
    ListItem.defaultTemplate = template;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
ListItem.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

/**
 * @param {NdChild} label
 * @returns {this}
 */
ListItem.prototype.label = function(label) {
    this.$description.content = label;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
ListItem.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * @param {NdChild} leading
 * @returns {this}
 */
ListItem.prototype.leading = function(leading) {
    this.$description.leading = leading;
    return this;
};

/**
 * @param {NdChild} trailing
 * @returns {this}
 */
ListItem.prototype.trailing = function(trailing) {
    this.$description.trailing = trailing;
    return this;
};


/**
 * @param {boolean|Observable<boolean>} [disabled=true]
 * @returns {this}
 */
ListItem.prototype.disabled = function(disabled = true) {
    this.$description.disabled = disabled;
    return this;
};

/**
 * @returns {this}
 */
ListItem.prototype.selectable = function() {
    this.$description.selectable = true;
    if(Validator.isObservable(this.$description.selected)) {
        return this;
    }
    this.$description.selected = $(false);
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [selected]
 * @returns {this}
 */
ListItem.prototype.selected = function(selected = true) {
    if(Validator.isObservable(this.$description.selected)) {
        this.$description.selected.set(selected);
        return this;
    }
    this.$description.selected = selected;
    return this;
};

/**
 * @param {NdChild} [show]
 * @returns {this}
 */
ListItem.prototype.divider = function(show = true) {
    this.$description.divider = show;
    return this;
};

/**
 * @param {*} data
 * @returns {this}
 */
ListItem.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};
