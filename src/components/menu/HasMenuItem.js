import MenuDivider from "./MenuDivider";

const EMPTY_OPTIONS = {};

export default function HasMenuItem() {}

HasMenuItem.prototype.setParent = function(parent) {
    this.$parent = parent;
    return this;
};

HasMenuItem.components = {
    MenuItem: null,
    MenuLink: null
};

const getParams = (options, configBuilder, props) => {
    if(!options && !configBuilder && !props)  {
        return { options: EMPTY_OPTIONS, configBuilder: null, props: null };
    }

    if(typeof options === 'function') {
        props = configBuilder || EMPTY_OPTIONS;
        configBuilder = options;
        options = EMPTY_OPTIONS;
    }

    return { options, configBuilder, props }
}

HasMenuItem.prototype.link = function(label, ...args) {
    const { options, configBuilder, props } = getParams(...args);
    const MenuLink = HasMenuItem.components.MenuLink;
    const item = MenuLink(props);
    this.add(item);

    item.icon(options.icon)
        .label(label)
        .action(options.href)
        .shortcut(options.shortcut)
        .target(options.target);
    if(options.disabled !== undefined) {
        item.disabled(options.disabled);
    }
    if(typeof configBuilder === 'function') {
        configBuilder(item);
    }
    return this;
};

HasMenuItem.prototype.linkTo = function(label, ...args) {
    const { options, configBuilder, props } = getParams(...args);
    return this.link(label, { ...options, href: {isRoute: true, to: options.href} }, configBuilder, props);
};



HasMenuItem.prototype.item = function(label, ...args) {
    const { options, configBuilder, props } = getParams(...args);
    const MenuItem = HasMenuItem.components.MenuItem;
    const item = MenuItem(props);
    this.add(item);

    item.icon(options.icon)
        .label(label)
        .action(options.action)
        .shortcut(options.shortcut);
    if(options.disabled !== undefined) {
        item.disabled(options.disabled);
    }
    if(typeof configBuilder === 'function') {
        configBuilder(item);
    }
    return this;
};

HasMenuItem.prototype.group = function(label, builder) {
    const MenuGroup = HasMenuItem.components.MenuGroup;
    const group = new MenuGroup(label);
    builder && builder(group);
    return this.add(group);
};

HasMenuItem.prototype.separator = function() {
    return this.add(new MenuDivider());
};

HasMenuItem.prototype.divider = HasMenuItem.prototype.separator;



HasMenuItem.prototype.add = function(item) {
    if(item === this) {
        return this;
    }
    if(this.$description.orientation === 'inline') {
        item.$description.orientation = 'inline';
    }
    item.$description.dataResolver = this.$description.dataResolver;
    item.$parent = this;
    this.$description.items.push(item);
    return this;
};

HasMenuItem.prototype.getDepth = function() {
    let depth = 0;
    let current = this.$parent;

    while (current) {
        depth++;
        current = current.$parent;
    }

    return depth;
};

HasMenuItem.prototype.onClicked = function() {
    this.$description.interaction = 'click';
    return this;
};

HasMenuItem.prototype.onHovered = function() {
    this.$description.interaction = 'hover';
    return this;
};

HasMenuItem.prototype.getRoot = function() {
    let current = this;
    while(current.$parent) {
        current = current.$parent;
    }
    return current;
};