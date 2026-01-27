import BaseComponent from "@components/BaseComponent";
import EventEmitter from "@src/core/utils/EventEmitter";
import DropdownGroup from "./DropdownGroup";
import DropdownTrigger from "./DropdownTrigger";
import DropdownDivider from "./DropdownDivider";

export default function Dropdown(config = {}) {
    if (!(this instanceof Dropdown)) {
        return new Dropdown(config);
    }

    this.$description = {
        trigger: null,
        items: [],
        position: 'bottom-start',
        offset: [0, 4],
        disabled: false,
        closeOnSelect: true,
        closeOnClickOutside: true,
        closeOnEscape: true,
        isOpen: $(false),
        maxHeight: null,
        searchable: false,
        searchPlaceholder: 'Search...',
        loopOnKeyboard: true,
        renderTrigger: null,
        renderItem: null,
        renderDivider: null,
        renderHeader: null,
        renderFooter: null,
        render: null,
        ...config,
    };

    this.$element = null;
}

BaseComponent.extends(Dropdown, EventEmitter);


Dropdown.defaultTemplate = null;

Dropdown.use = function(template) {
    Dropdown.defaultTemplate = template.render;
};

Dropdown.prototype.value = function(value) {
    this.$description.value = value;
    return this;
};

Dropdown.prototype.placeholder = function(placeholder) {
    this.$description.placeholder = placeholder;
    return this;
};

Dropdown.prototype.searchable = function(searchable, placeholder = null) {
    this.$description.searchable = searchable;
    if (placeholder) {
        this.$description.searchPlaceholder = placeholder;
    }
    return this;
};

Dropdown.prototype.searchPlaceholder = function(placeholder) {
    this.$description.searchPlaceholder = placeholder;
    return this;
};

Dropdown.prototype.closeOnClickOutside = function(closeOnClickOutside) {
    this.$description.closeOnClickOutside = closeOnClickOutside;
    return this;
};

Dropdown.prototype.closeOnEscape = function(closeOnEscape) {
    this.$description.closeOnEscape = closeOnEscape;
    return this;
};

Dropdown.prototype.closeOnSelect = function(closeOnSelect) {
    this.$description.closeOnSelect = closeOnSelect;
    return this;
};

Dropdown.prototype.maxHeight = function(maxHeight) {
    this.$description.maxHeight = maxHeight;
    return this;
};

Dropdown.prototype.trigger = function(trigger) {
    if (trigger instanceof DropdownTrigger) {
        trigger.setIsOpen(this.$description.isOpen);
        this.$description.trigger = trigger;
        return this;
    }

    this.$description.trigger = trigger;
    return this;
};

Dropdown.prototype.add = function(item) {
    this.$description.items.push(item);
    return this;
};
Dropdown.prototype.item = Dropdown.prototype.add;

Dropdown.prototype.items = function(items) {
    for(const item of items) {
        this.add(item);
    }
    return this;
};

Dropdown.prototype.group = function(groupBuilder) {
    const group = new DropdownGroup();
    groupBuilder && groupBuilder(group);
    this.$description.items.push(group);
    return this;
};

Dropdown.prototype.divider = function() {
    this.$description.items.push(new DropdownDivider());
    return this;
};

Dropdown.prototype.select = function(value) {
    this.$description.value?.set(value);
};

Dropdown.prototype.next = function() {

};

Dropdown.prototype.preview = function() {

};
Dropdown.prototype.loopOnKeyboard = function(loopOnKeyboard) {
    this.$description.loopOnKeyboard = loopOnKeyboard;
    return this;
};

Dropdown.prototype.onChange= function(handler) {
    this.on('change', handler);
    return this;
};

Dropdown.prototype.renderTrigger = function(renderFn) {
    this.$description.renderTrigger = renderFn;
    return this;
};

Dropdown.prototype.renderSearch = function(renderFn) {
    this.$description.renderSearch = renderFn;
    return this;
};

Dropdown.prototype.renderItem = function(renderFn) {
    this.$description.renderItem = renderFn;
    return this;
};

Dropdown.prototype.renderMenu = function(renderFn) {
    this.$description.renderMenu = renderFn;
    return this;
};

Dropdown.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};
