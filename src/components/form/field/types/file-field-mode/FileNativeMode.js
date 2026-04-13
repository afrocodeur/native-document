import BaseComponent from "../../../../BaseComponent";

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

FileNativeMode.use = function(template) {
    FileNativeMode.defaultTemplate = template;
};