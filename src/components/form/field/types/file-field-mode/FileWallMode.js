import BaseComponent from "../../../../BaseComponent";
import HasEventEmitter from "../../../../../core/utils/HasEventEmitter";

export default function FileWallMode(props = {}) {
    if(!(this instanceof FileWallMode)) {
        return new FileWallMode(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        cellSize:   96,
        addLabel:   'Upload',
        addIcon:    null,
        renderCell: null,
        renderAdd:  null,
        props
    };
}

BaseComponent.extends(FileWallMode);
BaseComponent.use(FileWallMode, HasEventEmitter);

FileWallMode.defaultTemplate = null;

FileWallMode.use = function(template) {
    FileWallMode.defaultTemplate = template;
};

FileWallMode.prototype.cellSize = function(size) {
    this.$description.cellSize = size;
    return this;
};

FileWallMode.prototype.addLabel = function(label) {
    this.$description.addLabel = label;
    return this;
};

FileWallMode.prototype.addIcon = function(icon) {
    this.$description.addIcon = icon;
    return this;
};

FileWallMode.prototype.renderCell = function(fn) {
    this.$description.renderCell = fn;
    return this;
};

FileWallMode.prototype.renderAdd = function(fn) {
    this.$description.renderAdd = fn;
    return this;
};