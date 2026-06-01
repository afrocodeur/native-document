import BaseComponent from "../../../../BaseComponent";

/**
 * Native browser file input mode for FileField.
 * Renders a standard <input type="file"> with no custom UI.
 * Useful when browser defaults are sufficient or as a baseline.
 * @example
 * new FileField('document')
 *     .mode('native');
 *
 * FileNativeMode.use((description, instance) => {
 *     // description.props
 *     return Input({ type: 'file' });
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props={}]
 */
export default function FileNativeMode(props = {}) {
    if(!(this instanceof FileNativeMode)) {
        return new FileNativeMode(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        props
    };
}

BaseComponent.extends(FileNativeMode);

FileNativeMode.defaultTemplate = null;

/**
 * Registers the render template for FileNativeMode.
 * @param {(description: {
 *     props: GlobalAttributes
 * }, instance: FileNativeMode) => NdChild} template
 */
FileNativeMode.use = function(template) {
    FileNativeMode.defaultTemplate = template;
};