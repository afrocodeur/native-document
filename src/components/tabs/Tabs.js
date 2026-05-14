import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import { $ } from "../../core/data/Observable";


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

Tabs.use = function(template) {
    Tabs.defaultTemplate = template;
};

Tabs.prototype.parentEmit = HasEventEmitter.prototype.emit;
Tabs.prototype.emit = function(eventName, ...args) {
    this.parentEmit.call(this, eventName, ...args);
    this.parentEmit.call(this, 'change');
};

Tabs.prototype.sortable = function() {
    this.$description.sortable = true;
    return this;
};
Tabs.prototype.pills = function() {
    this.$description.tabAppearance = 'pills';
    return this;
};
Tabs.prototype.segmented = function() {
    this.$description.tabAppearance = 'segmented';
    return this;
};

Tabs.prototype.addPlusButton = function(callback) {
    this.$description.addPlusButton = true;
    this.$description.addPLusCallback = callback;
    return this;
};

Tabs.prototype.closable = function(mode = true) {
    this.$description.closable = mode;
    return this;
};

Tabs.prototype.renderCloseButton = function(renderFn) {
    this.$description.renderCloseButton = renderFn;
    return this;
};

Tabs.prototype.renderPlusButton = function(renderFn) {
    this.$description.renderPlusButton = renderFn;
    return this;
};

Tabs.prototype.overflow = function(overflow) {
    this.$description.overflow = overflow;
    return this;
};

Tabs.prototype.scrollOnTabOverflow = function() {
    this.$description.overflow = 'scroll';
    return this;
};

Tabs.prototype.menuOnTabOverflow = function() {
    this.$description.overflow = 'menu';
    return this;
};

Tabs.prototype.focusOnNewTab = function(mode = true) {
    this.$description.focusOnNewTab = mode;
    return this;
};

Tabs.prototype.stickyHeader = function(mode = true) {
    this.$description.stickyHeader = mode;
    return this;
};

Tabs.prototype.addTab = function(icon, label, content, key) {
    const tab = { icon, label, content, key };
    this.$description.tabs[key] = tab;
    this.emit('addTab', tab);
    return this;
};

Tabs.prototype.tab = function(label, content, key) {
    return this.addTab(null, label, content, key);
};

Tabs.prototype.tabWithIcon = function(icon, label, content, key) {
    return this.addTab(icon, label, content, key);
};

Tabs.prototype.tabs = function(tabs) {
    for(const item of tabs) {
        this.addTab(item.icon, item.label, item.content, item.key);
    }
    return this;
};
Tabs.prototype.closeTab = function(key) {
    delete this.$description.tabs[key];
    this.emit('closeTab', key);
    return this;
};

Tabs.prototype.active = function(key) {
    this.$description.active.set(key);
    return this;
};

Tabs.prototype.navigationBarPosition = function(position) {
    this.$description.navigationBarPosition = position;
    return this;
};
Tabs.prototype.navigationBarAtLeft = function() {
    this.$description.navigationBarPosition = 'left';
    return this;
};
Tabs.prototype.navigationBarAtRight = function() {
    this.$description.navigationBarPosition = 'right';
    return this;
};
Tabs.prototype.navigationBarAtTop = function() {
    this.$description.navigationBarPosition = 'top';
    return this;
}
Tabs.prototype.navigationBarAsDock = function() {
    this.$description.navigationBarPosition = 'dock';
    return this;
};

Tabs.prototype.tabsAtLeading = function() {
    this.$description.tabsAlignment = 'leading';
    return this;
};

Tabs.prototype.tabsAtTrailing = function() {
    this.$description.tabsAlignment = 'trailing';
    return this;
};
Tabs.prototype.tabsAtCenter = function() {
    this.$description.tabsAlignment = 'center';
    return this;
};
Tabs.prototype.tabsJustified = function() {
    this.$description.tabsAlignment = 'justified';
    return this;
};

// Events
Tabs.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};
Tabs.prototype.onBeforeTabClose = function(handler) {
    this.on('beforeTabClose', handler);
    return this;
};

Tabs.prototype.onClickTab = function(handler) {
    this.on('clickTab', handler);
    return this;
};

Tabs.prototype.onCloseTab = function(handler) {
    this.on('closeTab', handler);
    return this;
};

Tabs.prototype.onAddTab = function(handler) {
    this.on('addTab', handler);
    return this;
};


Tabs.prototype.renderTab = function(renderFn) {
    this.$description.renderTab = renderFn;
    return this;
};
Tabs.prototype.renderNavigationBar = function(renderFn) {
    return this.$description.renderNavigationBar = renderFn;
};
