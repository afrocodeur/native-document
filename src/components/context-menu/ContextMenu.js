import Menu from "../menu/Menu";
import BaseComponent from "../BaseComponent";

export default function ContextMenu(config = {}) {
    if(!(this instanceof ContextMenu)) {
        return new ContextMenu(config);
    }
    Menu.call(this, config);

    Object.assign(this.$description, {
        positionX: $(0),
        positionY: $(0),
        target: null,
        data: null,
        visibility: $(false)
    });

    this.onItemClick( () => this.hide());
}

ContextMenu.defaultTemplate = null;
BaseComponent.extends(ContextMenu, Menu);

ContextMenu.defaultTemplate = null;

ContextMenu.use = function(template) {
    ContextMenu.defaultTemplate = template.contextMenu;
};

ContextMenu.prototype.attachTo = function(target, data) {
    this.$description.target = target;
    target.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.data(data);
        this.position(e.clientX, e.clientY).show();
    });
    return this;
};


ContextMenu.prototype.position = function(x, y) {
    this.$description.positionX.set(x);
    this.$description.positionY.set(y);
    return this;
}

ContextMenu.prototype.show = function() {
    this.$description.visibility.set(true);
    return this;
};

ContextMenu.prototype.hide = function() {
    this.$description.visibility.set(false);
    return this;
};

ContextMenu.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};
