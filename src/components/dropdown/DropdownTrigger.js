import BaseComponent from "@components/BaseComponent";

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
        ...config
    };
}

BaseComponent.extends(DropdownTrigger);

DropdownTrigger.defaultTemplate = null;

DropdownTrigger.use = function(template) {

};

DropdownTrigger.prototype.setIsOpen = function(isOpenObservable) {
    this.$description.isOpen = isOpenObservable;
    return this;
};


DropdownTrigger.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

DropdownTrigger.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

DropdownTrigger.prototype.stateOpenIcon = function(openIcon) {
    this.$description.stateOpenIcon = openIcon;
    return this;
};

DropdownTrigger.prototype.stateClosedIcon = function(closedIcon) {
    this.$description.stateClosedIcon = closedIcon;
    return this;
};


DropdownTrigger.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
}


DropdownTrigger.prototype.$build = function() {

};

DropdownTrigger.prototype.toNdElement = function() {

};