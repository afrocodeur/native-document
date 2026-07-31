import BaseComponent from '../../../../BaseComponent';
import HasEventEmitter from '../../../../../core/utils/HasEventEmitter';

/**
 * Grid/wall layout mode for FileField.
 * Displays uploaded files as a grid of cells with a fixed cell size,
 * plus an "Add" cell at the end to trigger new uploads.
 * Ideal for image galleries and media libraries.
 * @example
 * new FileField('gallery')
 *     .mode('wall')
 *     .multiple(true);
 *
 * FileWallMode.use((description, instance) => {
 *     // description.cellSize, description.addLabel, description.addIcon,
 *     // description.renderCell, description.renderAdd
 *     return Div({ class: 'wall', style: { gridTemplateColumns: \`repeat(auto-fill, \${description.cellSize}px)\` } });
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props={}]
 */
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
        previewItemsFrom:  null,
        props,
    };
}

BaseComponent.extends(FileWallMode);
BaseComponent.use(FileWallMode, HasEventEmitter);

FileWallMode.defaultTemplate = null;

/**
 * Registers the render template for FileWallMode.
 * @param {(description: {
 *     cellSize: string|number,
 *     addLabel: NdChild,
 *     addIcon: NdChild|null,
 *     renderCell: ((file: File, preview: FileItemPreview) => NdChild)|null,
 *     renderAdd: (() => NdChild)|null,
 *     props: GlobalAttributes
 * }, instance: FileWallMode) => NdChild} template
 */
FileWallMode.use = function(template) {
    FileWallMode.defaultTemplate = template;
};


/**
 * @param {string|number} size - Cell size in pixels or CSS value
 * @returns {this}
 */
FileWallMode.prototype.cellSize = function(size) {
    this.$description.cellSize = size;
    return this;
};

/**
 * @param {NdChild} label
 * @returns {this}
 */
FileWallMode.prototype.addLabel = function(label) {
    this.$description.addLabel = label;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
FileWallMode.prototype.addIcon = function(icon) {
    this.$description.addIcon = icon;
    return this;
};

/**
 * Custom render for each file cell.
 * @param {(file: File, preview: FileItemPreview) => NdChild} fn
 * @returns {this}
 */
FileWallMode.prototype.renderCell = function(fn) {
    this.$description.renderCell = fn;
    return this;
};

/**
 * Custom render for the "Add" cell.
 * @param {() => NdChild} fn
 * @returns {this}
 */
FileWallMode.prototype.renderAdd = function(fn) {
    this.$description.renderAdd = fn;
    return this;
};

/**
 *
 * @param {Observable} observable
 */
FileWallMode.prototype.previewItemsFrom = function(observable) {
    this.$description.previewItemsFrom = observable;
    return this;
};