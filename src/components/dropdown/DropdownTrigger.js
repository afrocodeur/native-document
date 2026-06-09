import BaseComponent from '../BaseComponent';

/**
 * Custom trigger element for a Dropdown that reacts to the open/closed state.
 *
 *
 * @example
 * const trigger = new DropdownTrigger()
 *     .content(Span('Select option'))
 *     .icon(ChevronIcon())
 *     .stateOpenIcon(ChevronUpIcon())
 *     .stateClosedIcon(ChevronDownIcon());
 *
 * @constructor
 * @param {GlobalAttributes} [config]
 */
export default function DropdownTrigger(config) {
    if(!(this instanceof DropdownTrigger)) {
        return new DropdownTrigger(config);
    }
    this.$description = {
        icon: null,
        content: null,
        stateOpenIcon: null,
        render: null,
        isOpen: null,
        ...config,
    };
    this.aria = { 'aria-haspopup': 'listbox' };
}

BaseComponent.extends(DropdownTrigger);

DropdownTrigger.defaultTemplate = null;

/**
 * Registers the render template for DropdownTrigger.
 * @param {(description: {
 *     icon: NdChild|null,
 *     content: NdChild|null,
 *     stateOpenIcon: NdChild|null,
 *     render: ((desc: *, instance: DropdownTrigger) => NdChild)|null,
 *     isOpen: Observable<boolean>|null,
 *     props: GlobalAttributes,
 * }, instance: DropdownTrigger) => NdChild} template
 */
DropdownTrigger.use = function(template) {
    DropdownTrigger.template = template;
};

/**
 * @param {Observable<boolean>} isOpenObservable
 * @returns {this}
 */
DropdownTrigger.prototype.setIsOpen = function(isOpenObservable) {
    this.$description.isOpen = isOpenObservable;
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
DropdownTrigger.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
DropdownTrigger.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * @param {NdChild} openIcon
 * @returns {this}
 */
DropdownTrigger.prototype.stateOpenIcon = function(openIcon) {
    this.$description.stateOpenIcon = openIcon;
    return this;
};

/**
 * @param {NdChild} closedIcon
 * @returns {this}
 */
DropdownTrigger.prototype.stateClosedIcon = function(closedIcon) {
    this.$description.stateClosedIcon = closedIcon;
    return this;
};
