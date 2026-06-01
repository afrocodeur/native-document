import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import { $ } from '../../core/data/Observable';


/**
 * Tabbed content panels. Supports closable tabs, drag-to-sort, overflow menu/scroll, pills/segmented appearance, and dynamic tab management.
 *
 *
 * @example
 * const tabs = new Tabs()
 *     .tab('Overview', OverviewPanel(), 'overview')
 *     .tab('Analytics', AnalyticsPanel(), 'analytics')
 *     .tabWithIcon(SettingsIcon(), 'Settings', SettingsPanel(), 'settings')
 *     .closable(true)
 *     .overflow('scroll')
 *     .onCloseTab((key) => console.log(\`closed: \${key}\`))
 *     .onChange(() => console.log('tab changed'));
 *
 * Tabs.use((description, instance) => {
 *     return Div({ class: 'tabs' });
 * });
 * 
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function Tabs(props = {}) {
    if(!(this instanceof Tabs)) {
        return new Tabs();
    }
    BaseComponent.apply(this, props);
    this.$description = {
        active: $(''),
        tabs: {},
        sortable: false,
        tabAppearance: 'segmented',
        addPlusButton: null,
        addPLusCallback: null,
        stickyHeader: false,
        overflow: 'scroll',
        navigationBarPosition: 'top',
        tabsAlignment: 'leading',
        closable: false,
        focusOnNewTab: false,
        closeIcon: null,
        renderCloseButton: null,
        renderPlusButton: null,
        props,
    };
}

BaseComponent.extends(Tabs);
BaseComponent.use(Tabs, HasEventEmitter);

Tabs.defaultTemplate = null;

/**
 * Registers the render template for Tabs.
 * @param {(description: {
 *     active: Observable<string>,
 *     tabs: Record<string, { icon?: NdChild, label: NdChild, content: NdChild, key: string }>,
 *     sortable: boolean,
 *     tabAppearance: 'segmented'|'pills'|string,
 *     addPlusButton: boolean|null,
 *     stickyHeader: boolean,
 *     overflow: 'scroll'|'menu',
 *     navigationBarPosition: 'top'|'bottom'|'left'|'right'|'dock',
 *     tabsAlignment: 'leading'|'trailing'|'center'|'justified',
 *     closable: boolean|'icon',
 *     focusOnNewTab: boolean,
 *     renderCloseButton: ((desc: *) => NdChild)|null,
 *     renderPlusButton: ((desc: *) => NdChild)|null,
 *     props: GlobalAttributes,
 * }, instance: Tabs) => NdChild} template
 */
Tabs.use = function(template) {
    Tabs.defaultTemplate = template;
};

Tabs.prototype.parentEmit = HasEventEmitter.prototype.emit;

/**
 * @param {string} eventName
 * @param {...*} args
 */
Tabs.prototype.emit = function(eventName, ...args) {
    this.parentEmit.call(this, eventName, ...args);
    this.parentEmit.call(this, 'change');
};

/**
 * @returns {this}
 */
Tabs.prototype.sortable = function() {
    this.$description.sortable = true;
    return this;
};

/**
 * @returns {this}
 */
Tabs.prototype.pills = function() {
    this.$description.tabAppearance = 'pills';
    return this;
};

/**
 * @returns {this}
 */
Tabs.prototype.segmented = function() {
    this.$description.tabAppearance = 'segmented';
    return this;
};

/**
 * @param {Function} callback
 * @returns {this}
 */
Tabs.prototype.addPlusButton = function(callback) {
    this.$description.addPlusButton = true;
    this.$description.addPLusCallback = callback;
    return this;
};

/**
 * @param {boolean|'icon'} [mode=true]
 * @returns {this}
 */
Tabs.prototype.closable = function(mode = true) {
    this.$description.closable = mode;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Tabs.prototype.renderCloseButton = function(renderFn) {
    this.$description.renderCloseButton = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Tabs.prototype.renderPlusButton = function(renderFn) {
    this.$description.renderPlusButton = renderFn;
    return this;
};

/**
 * @param {'scroll'|'menu'} overflow
 * @returns {this}
 */
Tabs.prototype.overflow = function(overflow) {
    this.$description.overflow = overflow;
    return this;
};

/**
 * @returns {this}
 */
Tabs.prototype.scrollOnTabOverflow = function() {
    this.$description.overflow = 'scroll';
    return this;
};

/**
 * @returns {this}
 */
Tabs.prototype.menuOnTabOverflow = function() {
    this.$description.overflow = 'menu';
    return this;
};

/**
 * @param {*} [mode]
 * @returns {this}
 */
Tabs.prototype.focusOnNewTab = function(mode = true) {
    this.$description.focusOnNewTab = mode;
    return this;
};

/**
 * @param {*} [mode]
 * @returns {this}
 */
Tabs.prototype.stickyHeader = function(mode = true) {
    this.$description.stickyHeader = mode;
    return this;
};

/**
 * @param {NdChild|null} icon
 * @param {NdChild} label
 * @param {NdChild} content
 * @param {string} key
 * @returns {this}
 */
Tabs.prototype.addTab = function(icon, label, content, key) {
    const tab = { icon, label, content, key };
    this.$description.tabs[key] = tab;
    this.emit('addTab', tab);
    return this;
};

/**
 * @param {NdChild} label
 * @param {NdChild} content
 * @param {string} key
 * @returns {this}
 */
Tabs.prototype.tab = function(label, content, key) {
    return this.addTab(null, label, content, key);
};

/**
 * @param {NdChild} icon
 * @param {NdChild} label
 * @param {NdChild} content
 * @param {string} key
 * @returns {this}
 */
Tabs.prototype.tabWithIcon = function(icon, label, content, key) {
    return this.addTab(icon, label, content, key);
};

/**
 * @param {{ icon?: NdChild, label: NdChild, content: NdChild, key: string }[]} tabs
 * @returns {this}
 */
Tabs.prototype.tabs = function(tabs) {
    for(const item of tabs) {
        this.addTab(item.icon, item.label, item.content, item.key);
    }
    return this;
};

/**
 * @param {string} key
 * @returns {this}
 */
Tabs.prototype.closeTab = function(key) {
    delete this.$description.tabs[key];
    this.emit('closeTab', key);
    return this;
};

/**
 * @param {string} key
 * @returns {this}
 */
Tabs.prototype.active = function(key) {
    this.$description.active.set(key);
    return this;
};

/**
 * @param {'top'|'bottom'|'left'|'right'|'dock'} position
 * @returns {this}
 */
Tabs.prototype.navigationBarPosition = function(position) {
    this.$description.navigationBarPosition = position;
    return this;
};

/**
 * @returns {this}
 */
Tabs.prototype.navigationBarAtLeft = function() {
    this.$description.navigationBarPosition = 'left';
    return this;
};

/**
 * @returns {this}
 */
Tabs.prototype.navigationBarAtRight = function() {
    this.$description.navigationBarPosition = 'right';
    return this;
};

/**
 * @returns {this}
 */
Tabs.prototype.navigationBarAtTop = function() {
    this.$description.navigationBarPosition = 'top';
    return this;
};

/**
 * @returns {this}
 */
Tabs.prototype.navigationBarAsDock = function() {
    this.$description.navigationBarPosition = 'dock';
    return this;
};

/**
 * @returns {this}
 */
Tabs.prototype.tabsAtLeading = function() {
    this.$description.tabsAlignment = 'leading';
    return this;
};

/**
 * @returns {this}
 */
Tabs.prototype.tabsAtTrailing = function() {
    this.$description.tabsAlignment = 'trailing';
    return this;
};

/**
 * @returns {this}
 */
Tabs.prototype.tabsAtCenter = function() {
    this.$description.tabsAlignment = 'center';
    return this;
};

/**
 * @returns {this}
 */
Tabs.prototype.tabsJustified = function() {
    this.$description.tabsAlignment = 'justified';
    return this;
};

// Events

/**
 * @param {Function} handler
 * @returns {this}
 */
Tabs.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};

/**
 * @param {(key: string) => boolean|void} handler
 * @returns {this}
 */
Tabs.prototype.onBeforeTabClose = function(handler) {
    this.on('beforeTabClose', handler);
    return this;
};

/**
 * @param {(key: string) => void} handler
 * @returns {this}
 */
Tabs.prototype.onClickTab = function(handler) {
    this.on('clickTab', handler);
    return this;
};

/**
 * @param {(key: string) => void} handler
 * @returns {this}
 */
Tabs.prototype.onCloseTab = function(handler) {
    this.on('closeTab', handler);
    return this;
};

/**
 * @param {(tab: { icon?: NdChild, label: NdChild, content: NdChild, key: string }) => void} handler
 * @returns {this}
 */
Tabs.prototype.onAddTab = function(handler) {
    this.on('addTab', handler);
    return this;
};

/**
 * @param {(tab: { icon?: NdChild, label: NdChild, content: NdChild, key: string }) => NdChild} renderFn
 * @returns {this}
 */
Tabs.prototype.renderTab = function(renderFn) {
    this.$description.renderTab = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Tabs.prototype.renderNavigationBar = function(renderFn) {
    return this.$description.renderNavigationBar = renderFn;
};
