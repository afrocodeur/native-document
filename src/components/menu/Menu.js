import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import HasItems from '../$traits/has-items/HasItems';
import MenuGroup from './MenuGroup';
import HasMenuItem from './HasMenuItem';
import { $ } from '../../core/data/Observable';

/**
 * Navigation or action menu. Supports horizontal/vertical/inline orientation, keyboard navigation, nested groups, active item tracking.
 *
 *
 * @example
 * const menu = new Menu()
 *     .vertical()
 *     .closeOnSelect(true)
 *     .keyboardLoop(true)
 *     .item('Dashboard', () => navigate('/dashboard'))
 *     .item('Settings', () => navigate('/settings'))
 *     .separator()
 *     .group('Reports', ReportIcon(), (group) => {
 *         group.item('Monthly').item('Annual');
 *     })
 *     .onItemClick((item, e) => console.log(item));
 *
 * Menu.use((description, instance) => {
 *     return Nav({ class: 'menu' }, description.items);
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function Menu(props = {}) {

    if(!(this instanceof Menu)) {
        return new Menu(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        items: $.array(),
        render: null,
        orientation: 'horizontal',
        closeOnSelect: true,
        keyboardLoop: true,
        activeItem: $(null),
        active: null,
        compactThreshold: 60,
        clickFirst: false,
        menuActive: $(null),
        isMenuActivated: $(false),
        compact: $(null),
        props,
    };

}

BaseComponent.extends(Menu);
BaseComponent.use(Menu, HasItems, HasEventEmitter, HasMenuItem);

Menu.defaultTemplate = null;

/**
 * Registers the render template for Menu.
 * @param {(description: {
 *     items: Observable<Array<MenuItem|MenuGroup|MenuDivider>>,
 *     render: ((desc: *, instance: Menu) => NdChild)|null,
 *     orientation: 'horizontal'|'vertical'|'inline',
 *     closeOnSelect: boolean,
 *     keyboardLoop: boolean,
 *     activeItem: Observable<MenuItem|null>,
 *     active: ((item: MenuItem) => boolean)|null,
 *     compactThreshold: number,
 *     clickFirst: boolean,
 *     props: GlobalAttributes,
 * }, instance: Menu) => NdChild} template
 */
Menu.use = function(template) {
    Menu.defaultTemplate = template;
};

/**
 * @param {(data: *) => *} resolver
 * @returns {this}
 */
Menu.prototype.dataResolver = function(resolver) {
    this.$description.dataResolver = resolver;
    return this;
};

/**
 * @param {NdChild} title
 * @returns {this}
 */
Menu.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};

/**
 * @param {string} orientation
 * @returns {this}
 */
Menu.prototype.orientation = function(orientation) {
    this.$description.orientation = orientation;
    return this;
};

/**
 * @returns {this}
 */
Menu.prototype.horizontal = function() {
    this.$description.orientation = 'horizontal';
    return this;
};

/**
 * @returns {this}
 */
Menu.prototype.vertical = function() {
    this.$description.orientation = 'vertical';
    return this;
};

/**
 * @returns {this}
 */
Menu.prototype.inline = function() {
    this.$description.orientation = 'inline';
    return this;
};

/**
 * @param {*} [close]
 * @returns {this}
 */
Menu.prototype.closeOnSelect = function(close = true) {
    this.$description.closeOnSelect = close;
    return this;
};

/**
 * @param {*} [keyboardLoop]
 * @returns {this}
 */
Menu.prototype.keyboardLoop = function(keyboardLoop = true) {
    this.$description.keyboardLoop = keyboardLoop;
    return this;
};

/**
 * @param {*} data
 * @returns {this}
 */
Menu.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

/**
 * @param {(item: MenuItem) => boolean} callback
 * @returns {this}
 */
Menu.prototype.active = function(callback) {
    this.$description.active = callback;
    return this;
};

/**
 * @param {(item: MenuItem, event: MouseEvent) => void} handler
 * @returns {this}
 */
Menu.prototype.onItemClick = function(handler) {
    this.on('itemClick', handler);
    return this;
};

/**
 * @param {(item: MenuItem) => void} handler
 * @returns {this}
 */
Menu.prototype.onItemSelect = function(handler) {
    this.on('itemSelect', handler);
    return this;
};

/**
 * @param {NdChild} label
 * @param {NdChild} icon
 * @param {(group: MenuGroup) => void} builder
 * @param {GlobalAttributes} [props={}]
 * @returns {this}
 */
Menu.prototype.group = function(label, icon, builder, props = {}) {
    const group = new MenuGroup(label, props);
    group.icon(icon);
    builder && builder(group);
    return this.add(group);
};

/**
 * @param {string} key
 * @returns {MenuItem|undefined}
 */
Menu.prototype.getItem = function(key) {
    return this.$description.items.find(
        item => item.$description.key === key || item.$description.label === key,
    );
};

/**
 * @param {number} [width]
 * @returns {this}
 */
Menu.prototype.compactThreshold = function(width = 60) {
    this.$description.compactThreshold = width;
    return this;
};

/**
 * @param {*} [mode]
 * @returns {this}
 */
Menu.prototype.clickFirst = function(mode = true) {
    this.$description.clickFirst = mode;
    return this;
};