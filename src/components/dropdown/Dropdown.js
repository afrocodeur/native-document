import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import DropdownGroup from "./DropdownGroup";
import DropdownDivider from "./DropdownDivider";
import DebugManager from "../../core/utils/debug-manager";
import HasFullPosition from "../$traits/has-position/HasFullPosition";
import { $ } from "../../core/data/Observable";
import {normalizeDropdownItem} from "./helpers";
import {NDElement} from "../../core/wrappers/NDElement";

export default function Dropdown(props = {}) {
    if (!(this instanceof Dropdown)) {
        return new Dropdown(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        trigger: null,
        items: $.array([]),
        position: 'bottom-start',
        interaction: 'click',
        offset: [0, 4],
        disabled: $(false),
        closeOnSelect: true,
        closeOnClickOutside: true,
        closeOnEscape: true,
        isOpen: $(false),
        maxHeight: null,
        searchable: false,
        searchValue: null,
        searchPlaceholder: 'Search...',
        loopOnKeyboard: true,
        renderItem: null,
        renderHeader: null,
        renderFooter: null,
        renderContent: null,
        render: null,
        filter: null,
        mapper: null,
        filterDependencies: null,
        matchTriggerWidth: null,
        matchTargetWidth: null,
        updatePositionOn: null,
        includeTriggerIntoGhost: true,
        props,
    };
}

BaseComponent.extends(Dropdown);
BaseComponent.use(Dropdown, HasEventEmitter, HasFullPosition);

Dropdown.defaultTemplate = null;

Dropdown.use = function(template) {
    Dropdown.defaultTemplate = template;

    if(!NDElement.prototype.dropdown) {
        NDElement.prototype.dropdown = function(dropdown) {
            if(!(dropdown instanceof Dropdown)) {
                throw new Error('The dropdown must be an instance of Dropdown.');
            }
            this.ghostDom(dropdown.trigger(this.$element));
            return this;
        };
    }
    if(!BaseComponent.prototype.dropdown) {
        BaseComponent.prototype.dropdown = function(dropdown) {
            if(!(dropdown instanceof Dropdown)) {
                throw new Error('The dropdown must be an instance of Dropdown.');
            }
            this.postBuild(() => {
                this.ghostDom(dropdown.trigger(this.$element));
            });
            return this;
        }
    }

};

Dropdown.preset = function(name, callback) {
    if (Dropdown.prototype[name] || Dropdown[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Dropdown.`);
        return;
    }
    Dropdown[name] = (props) => callback(new Dropdown(props));
};

Dropdown.presets = function(presets) {
    for (const name in presets) {
        Dropdown.preset(name, presets[name]);
    }
};

Dropdown.prototype.open = function() {
    this.$description.isOpen.set(true);
    return this;
};

Dropdown.prototype.bind = function(source, mapper) {
    this.$description.items = source.__$Observable ? source : $.array(source);
    this.$description.mapper = mapper;
    return this;
};
Dropdown.prototype.source = Dropdown.prototype.bind;
Dropdown.prototype.from = Dropdown.prototype.bind;

Dropdown.prototype.close = function() {
    this.$description.isOpen.set(false);
    return this;
};

Dropdown.prototype.toggle = function() {
    return this.$description.isOpen.val() ? this.close() : this.open();
};

Dropdown.prototype.disabled = function(disabled = true) {
    this.$description.disabled = BaseComponent.obs(disabled);
    return this;
};

Dropdown.prototype.enable = function() {
    this.$description.disabled.set(false);
    return this;
};
Dropdown.prototype.disable = function() {
    this.$description.disabled.set(true);
    return this;
}

Dropdown.prototype.value = function(value) {
    this.$description.value = value;
    return this;
};

Dropdown.prototype.placeholder = function(placeholder) {
    this.$description.placeholder = placeholder;
    return this;
};

Dropdown.prototype.searchable = function(searchable = true, placeholder = null) {
    this.$description.searchable = searchable;
    if (placeholder) {
        this.$description.searchPlaceholder = placeholder;
    }
    this.$description.searchValue = $('');
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

Dropdown.prototype.trigger = function(trigger, includeTriggerIntoGhost = true) {
    this.$description.trigger = trigger;
    this.$description.includeTriggerIntoGhost = includeTriggerIntoGhost;
    return this;
};

Dropdown.prototype.add = function(item, props = {}) {
    this.$description.items.push(normalizeDropdownItem(item, null, props));
    return this;
};
Dropdown.prototype.menu = Dropdown.prototype.add;
Dropdown.prototype.item = Dropdown.prototype.add;

Dropdown.prototype.from = function(items, mapper = null) {
    if(items.__$isObservableArray) {
        this.$description.items.set(items.map((item) => normalizeDropdownItem(item, mapper)));
        return this;
    }

    for(let i = 0; i < items.length; i++) {
        this.add(normalizeDropdownItem(items[i], mapper));
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
    return this;
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

Dropdown.prototype.onOpen = function(handler) {
    this.on('open', handler);
    return this;
};

Dropdown.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};

Dropdown.prototype.renderSearch = function(renderFn) {
    this.$description.renderSearch = renderFn;
    return this;
};


Dropdown.prototype.interaction = function(interaction) {
    this.$description.interaction = interaction;
    return this;
};


Dropdown.prototype.filter = function(filter, dependencies) {
    this.$description.filter = filter;
    this.$description.filterDependencies = dependencies;
    return this;
};

Dropdown.prototype.onClicked = function() {
    this.$description.interaction = 'click';
    return this;
};

Dropdown.prototype.onHovered = function() {
    this.$description.interaction = 'hover';
    return this;
};

Dropdown.prototype.onFocused = function() {
    this.$description.interaction = 'focus';
    return this;
};

Dropdown.prototype.renderHeader = function(renderFn) {
    this.$description.renderHeader = renderFn;
    return this;
};

Dropdown.prototype.renderFooter = function(renderFn) {
    this.$description.renderFooter = renderFn;
    return this;
};

Dropdown.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn;
    return this;
};
Dropdown.prototype.matchTriggerWidth = function() {
    this.$description.matchTriggerWidth = true;
    return this;
};
Dropdown.prototype.matchTargetWidth = function(target) {
    this.$description.matchTargetWidth = target;
    return this;
};
Dropdown.prototype.renderItem = function(callback) {
    this.$description.renderItem = callback;
    return this;
};
Dropdown.prototype.updatePositionOn = function(updatePositionOn) {
    this.$description.updatePositionOn = updatePositionOn;
    return this;
};