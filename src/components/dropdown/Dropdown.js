import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import DropdownGroup from './DropdownGroup';
import DropdownDivider from './DropdownDivider';
import DebugManager from '../../core/utils/debug-manager';
import HasFullPosition from '../$traits/has-position/HasFullPosition';
import { $ } from '../../core/data/Observable';
import {normalizeDropdownItem} from './helpers';
import {NDElement} from '../../core/wrappers/NDElement';

/**
 * Floating dropdown list anchored to a trigger element. Supports searchable, multiple selection, reactive data binding, grouping, and item rendering.
 *
 *
 * @example
 * const dropdown = new Dropdown()
 *     .trigger(triggerEl)
 *     .from(items, (item) => new DropdownItem().value(item.id).content(Span(item.name)))
 *     .searchable(true)
 *     .closeOnSelect(true)
 *     .onOpen(() => console.log('opened'))
 *     .onChange((value, item) => console.log(value));
 *
 * Dropdown.use((description, instance) => {
 *     // description.items, description.isOpen, description.searchable...
 *     return Div({ class: 'dropdown' });
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
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
    this.aria = { 'role': 'listbox' };
}

BaseComponent.extends(Dropdown);
BaseComponent.use(Dropdown, HasEventEmitter, HasFullPosition);

Dropdown.defaultTemplate = null;

/**
 * Registers the render template for Dropdown.
 * @param {(description: {
 *     trigger: HTMLElement|null,
 *     items: Observable<DropdownItem[]>,
 *     interaction: 'click'|'hover'|'focus',
 *     disabled: Observable<boolean>,
 *     isOpen: Observable<boolean>,
 *     maxHeight: string|number|null,
 *     searchable: boolean,
 *     searchValue: Observable<string>|null,
 *     searchPlaceholder: string,
 *     loopOnKeyboard: boolean,
 *     renderItem: ((item: DropdownItem, instance: Dropdown) => NdChild)|null,
 *     renderHeader: ((desc: *, instance: Dropdown) => NdChild)|null,
 *     renderFooter: ((desc: *, instance: Dropdown) => NdChild)|null,
 *     render: ((desc: *, instance: Dropdown) => NdChild)|null,
 *     filter: ((item: DropdownItem, query: string) => boolean)|null,
 *     mapper: ((item: *) => DropdownItem)|null,
 *     matchTriggerWidth: boolean|null,
 *     updatePositionOn: Observable<*>|null,
 *     includeTriggerIntoGhost: boolean,
 *     props: GlobalAttributes,
 * }, instance: Dropdown) => NdChild} template
 */
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
        };
    }

};

/**
 * @param {string} name
 * @param {(d: Dropdown) => Dropdown} callback
 */
Dropdown.preset = function(name, callback) {
    if (Dropdown.prototype[name] || Dropdown[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Dropdown.`);
        return;
    }
    Dropdown[name] = (props) => callback(new Dropdown(props));
};

/**
 * @param {Record<string, (d: Dropdown) => Dropdown>} presets
 */
Dropdown.presets = function(presets) {
    for (const name in presets) {
        Dropdown.preset(name, presets[name]);
    }
};

/**
 * @returns {this}
 */
Dropdown.prototype.open = function() {
    this.$description.isOpen.set(true);
    return this;
};

/**
 * @param {Observable<*[]>|*[]} source
 * @param {((item: *) => DropdownItem)|null} [mapper]
 * @returns {this}
 */
Dropdown.prototype.bind = function(source, mapper) {
    this.$description.items = source.__$Observable ? source : $.array(source);
    this.$description.mapper = mapper;
    return this;
};

/**
 * Alias for {@link Dropdown.prototype.bind}
 */
Dropdown.prototype.source = Dropdown.prototype.bind;
/**
 * Alias for {@link Dropdown.prototype.bind}
 */
Dropdown.prototype.from = Dropdown.prototype.bind;

/**
 * @returns {this}
 */
Dropdown.prototype.close = function() {
    this.$description.isOpen.set(false);
    return this;
};

/**
 * @returns {this}
 */
Dropdown.prototype.toggle = function() {
    return this.$description.isOpen.val() ? this.close() : this.open();
};

/**
 * @param {boolean|Observable<boolean>} [disabled]
 * @returns {this}
 */
Dropdown.prototype.disabled = function(disabled = true) {
    this.$description.disabled = BaseComponent.obs(disabled);
    return this;
};

/**
 * @returns {this}
 */
Dropdown.prototype.enable = function() {
    this.$description.disabled.set(false);
    return this;
};

/**
 * @returns {this}
 */
Dropdown.prototype.disable = function() {
    this.$description.disabled.set(true);
    return this;
};

/**
 * @param {number} value
 * @returns {*}
 */
Dropdown.prototype.value = function(value) {
    this.$description.value = value;
    return this;
};

/**
 * @param {*} placeholder
 * @returns {this}
 */
Dropdown.prototype.placeholder = function(placeholder) {
    this.$description.placeholder = placeholder;
    return this;
};

/**
 * @param {*} [searchable]
 * @param {*} [placeholder]
 * @returns {this}
 */
Dropdown.prototype.searchable = function(searchable = true, placeholder = null) {
    this.$description.searchable = searchable;
    if (placeholder) {
        this.$description.searchPlaceholder = placeholder;
    }
    this.$description.searchValue = $('');
    return this;
};

/**
 * @param {*} placeholder
 * @returns {this}
 */
Dropdown.prototype.searchPlaceholder = function(placeholder) {
    this.$description.searchPlaceholder = placeholder;
    return this;
};

/**
 * @param {*} closeOnClickOutside
 * @returns {this}
 */
Dropdown.prototype.closeOnClickOutside = function(closeOnClickOutside) {
    this.$description.closeOnClickOutside = closeOnClickOutside;
    return this;
};

/**
 * @param {*} closeOnEscape
 * @returns {this}
 */
Dropdown.prototype.closeOnEscape = function(closeOnEscape) {
    this.$description.closeOnEscape = closeOnEscape;
    return this;
};

/**
 * @param {*} closeOnSelect
 * @returns {this}
 */
Dropdown.prototype.closeOnSelect = function(closeOnSelect) {
    this.$description.closeOnSelect = closeOnSelect;
    return this;
};

/**
 * @param {*} maxHeight
 * @returns {this}
 */
Dropdown.prototype.maxHeight = function(maxHeight) {
    this.$description.maxHeight = maxHeight;
    return this;
};

/**
 * @param {HTMLElement|NDElement} trigger
 * @param {boolean} [includeTriggerIntoGhost=true]
 * @returns {this}
 */
Dropdown.prototype.trigger = function(trigger, includeTriggerIntoGhost = true) {
    this.$description.trigger = trigger;
    this.$description.includeTriggerIntoGhost = includeTriggerIntoGhost;
    return this;
};

/**
 * @param {DropdownItem|NdChild|*} item
 * @param {GlobalAttributes} [props={}]
 * @returns {this}
 */
Dropdown.prototype.add = function(item, props = {}) {
    this.$description.items.push(normalizeDropdownItem(item, null, props));
    return this;
};

/**
 * Alias for {@link Dropdown.prototype.add}
 */
Dropdown.prototype.menu = Dropdown.prototype.add;

/**
 * Alias for {@link Dropdown.prototype.add}
 */
Dropdown.prototype.item = Dropdown.prototype.add;

/**
 * @param {*[]} items
 * @param {((item: *) => DropdownItem)|null} [mapper=null]
 * @returns {this}
 */
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

/**
 * @param {(group: DropdownGroup) => void} groupBuilder
 * @returns {this}
 */
Dropdown.prototype.group = function(groupBuilder) {
    const group = new DropdownGroup();
    groupBuilder && groupBuilder(group);
    this.$description.items.push(group);
    return this;
};

/**
 * @returns {this}
 */
Dropdown.prototype.divider = function() {
    this.$description.items.push(new DropdownDivider());
    return this;
};

/**
 * @param {number} value
 * @returns {this}
 */
Dropdown.prototype.select = function(value) {
    this.$description.value?.set(value);
    return this;
};

/**
 * @returns {this}
 */
Dropdown.prototype.next = function() {
    // TODO : to implement
    return this;
};

/**
 * @returns {this}
 */
Dropdown.prototype.preview = function() {
    // TODO : to implement
    return this;
};

/**
 * @param {*} loopOnKeyboard
 * @returns {this}
 */
Dropdown.prototype.loopOnKeyboard = function(loopOnKeyboard) {
    this.$description.loopOnKeyboard = loopOnKeyboard;
    return this;
};

Dropdown.prototype.onChange= function(handler) {
    this.on('change', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Dropdown.prototype.onOpen = function(handler) {
    this.on('open', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Dropdown.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Dropdown.prototype.renderSearch = function(renderFn) {
    this.$description.renderSearch = renderFn;
    return this;
};

/**
 * @param {'click'|'hover'|'focus'} interaction
 * @returns {this}
 */
Dropdown.prototype.interaction = function(interaction) {
    this.$description.interaction = interaction;
    return this;
};

/**
 * @param {(item: DropdownItem, query: string) => boolean} filter
 * @param {Observable<*>[]} [dependencies]
 * @returns {this}
 */
Dropdown.prototype.filter = function(filter, dependencies) {
    this.$description.filter = filter;
    this.$description.filterDependencies = dependencies;
    return this;
};

/**
 * @returns {this}
 */
Dropdown.prototype.onClicked = function() {
    this.$description.interaction = 'click';
    return this;
};

/**
 * @returns {this}
 */
Dropdown.prototype.onHovered = function() {
    this.$description.interaction = 'hover';
    return this;
};

/**
 * @returns {this}
 */
Dropdown.prototype.onFocused = function() {
    this.$description.interaction = 'focus';
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Dropdown.prototype.renderHeader = function(renderFn) {
    this.$description.renderHeader = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Dropdown.prototype.renderFooter = function(renderFn) {
    this.$description.renderFooter = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Dropdown.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn;
    return this;
};

/**
 * @returns {this}
 */
Dropdown.prototype.matchTriggerWidth = function() {
    this.$description.matchTriggerWidth = true;
    return this;
};

/**
 * @param {HTMLElement|NDElement} target
 * @returns {this}
 */
Dropdown.prototype.matchTargetWidth = function(target) {
    this.$description.matchTargetWidth = target;
    return this;
};

/**
 * @param {Function} callback
 * @returns {this}
 */
Dropdown.prototype.renderItem = function(callback) {
    this.$description.renderItem = callback;
    return this;
};

/**
 * @param {*} updatePositionOn
 * @returns {this}
 */
Dropdown.prototype.updatePositionOn = function(updatePositionOn) {
    this.$description.updatePositionOn = updatePositionOn;
    return this;
};