import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import HasItems from '../$traits/has-items/HasItems';
import HasListItem from './HasListItem';
import { $ } from '../../core/data/Observable';

/**
 * A collapsible group of ListItems inside a List. Can hold items, dividers, and nested groups.
 *
 * @example
 * ListGroup('Workspace')
 *     .icon(FolderIcon())
 *     .collapsable()
 *     .item('Dashboard', DashboardIcon())
 *     .item('Analytics', ChartIcon());
 *
 * // From data
 * ListGroup('Reports')
 *     .from(reports, (report) =>
 *         ListItem().label(report.name).value(report.id)
 *     );
 *
 * ListGroup.use((description, instance) => {
 *     return Div({ class: 'list-group' });
 * });
 *
 * @constructor
 * @param {NdChild} label
 * @param {GlobalAttributes} [props={}]
 */
export default function ListGroup(label, props = {}) {
    if (!(this instanceof ListGroup)) {
        return new ListGroup(label, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        selectable:       $(false),
        multiSelect:      $(false),
        selectedValues:   $.array(),
        label:       label,
        icon:        null,
        items:       $.array(),
        render:      null,
        collapsable: false,
        collapsed:   null,
        visibility:  $(true),
        selectByCheckbox: $(false),
        selectByClick:    $(false),
        loopOnKeyboard:   $(false),
        props,
    };
}

BaseComponent.extends(ListGroup);
BaseComponent.use(ListGroup, HasItems, HasEventEmitter, HasListItem);

HasListItem.components.ListGroup = ListGroup;

ListGroup.defaultTemplate = null;
ListGroup.prototype.__$ListInstance = true;

/**
 * Registers the render template for ListGroup.
 * @param {(description: {
 *     label:       NdChild,
 *     icon:        NdChild|null,
 *     items:       ObservableArray<ListItem|ListGroup|ListDivider>,
 *     itemBuilder: (item: *) => ListItem|ListGroup|ListDivider,
 *     data:        *|null,
 *     render:      ((desc: *, instance: ListGroup) => NdChild)|null,
 *     collapsable: boolean,
 *     collapsed:   ObservableItem<boolean>|null,
 *     visibility:  ObservableItem<boolean>,
 *     props:       GlobalAttributes,
 * }, instance: ListGroup) => NdChild} template
 */
ListGroup.use = function(template) {
    ListGroup.defaultTemplate = template;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
ListGroup.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * @param {boolean} [mode=true]
 * @param {NdChild} [openedIcon]
 * @param {NdChild} [closedIcon]
 * @returns {this}
 */
ListGroup.prototype.collapsable = function(mode = true, openedIcon, closedIcon) {
    this.$description.collapsable = mode;
    this.$description.collapsed   = this.$description.collapsed || $(false);
    this.$description.collapsableOpenedIcon = openedIcon || null;
    this.$description.collapsableClosedIcon = closedIcon || null;
    return this;
};

/**
 * @param {boolean} [mode=true]
 * @returns {this}
 */
ListGroup.prototype.collapsed = function(mode = true) {
    if (!this.$description.collapsed) {
        this.$description.collapsed = $(mode);
    } else {
        this.$description.collapsed.set(mode);
    }
    return this;
};

/**
 * @param {boolean|Observable<boolean>} mode
 * @returns {this}
 */
ListGroup.prototype.visibility = function(mode) {
    this.$description.visibility = BaseComponent.obs(mode);
    return this;
};

/**
 * @param {*} data
 * @returns {this}
 */
ListGroup.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};
