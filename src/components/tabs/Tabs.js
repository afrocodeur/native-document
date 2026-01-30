import BaseComponent from "../BaseComponent";
import EventEmitter from "../../../src/core/utils/EventEmitter";


export default function Tabs(config = {}) {
    if(!(this instanceof Tabs)) {
        return new Tabs();
    }
    BaseComponent.apply(this);
    this.$description = {
        active: $(''),
        tabs: {},
        ...config,
    };

    this.tabsMap = {};
}

BaseComponent.extends(Tabs, EventEmitter);

Tabs.defaultTemplate = null;
Tabs.defaultTabTemplate = null;
Tabs.defaultNavigationBarTemplate = null;

Tabs.use = function(template) {};

Tabs.prototype.activateTab = function(key) {};
Tabs.prototype.closeTab = function(key) {};

Tabs.prototype.tab = function(label, content, key) {
    this.$description.tabs[key] = { label, content };
    this.tabsMap[key] = content;
    return this;
};
Tabs.prototype.tabs = function(tabs) {
    for(const item of tabs) {
        this.tab(item.label, item.content, item.key);
    }
    return this;
};
Tabs.prototype.removeTab = function(key) {
    delete this.$description.tabs[key];
    delete this.tabsMap[key];
    // Todo: remove tab from Match element
    this.active(Object.keys(this.$description.tabs)[0]);
    return this;
};

Tabs.prototype.active = function(key) {
    this.$description.active.set(key);
};
Tabs.prototype.defaultActive = function(key) {};
Tabs.prototype.getActive = function() {};

Tabs.prototype.navigationBarPosition = function(position) {
    this.$description.navigationBarPosition = position;
    return this;
};
Tabs.prototype.navigationBarAtLeft = function() {
    return this.navigationBarPosition('left');
};
Tabs.prototype.navigationBarAtRight = function() {
    return this.navigationBarPosition('right');
};
Tabs.prototype.navigationBarAtTop = function() {
    return this.navigationBarPosition('top');
}
Tabs.prototype.navigationBarAsDock = function() {
    return this.navigationBarPosition('dock');
};

// Events
Tabs.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};
Tabs.prototype.onBeforeChange = function(handler) {
    this.on('beforeChange', handler);
    return this;
};
Tabs.prototype.onTabClick = function(handler) {
    this.on('tabClick', handler);
    return this;
};
Tabs.prototype.onTabClose = function(handler) {
    this.on('tabClose', handler);
    return this;
};


Tabs.prototype.renderTab = function(renderFn) {
    this.$description.renderTab = renderFn;
    return this;
};
Tabs.prototype.renderNavigationBar = function(renderFn) {
    return this.$description.renderNavigationBar = renderFn;
};

Tabs.prototype.layout = function(layoutFn) {
    this.$description.layout = layoutFn;
    return this;
};

Tabs.prototype.$build = function() {

};

Tabs.prototype.toNdElement = function() {

};