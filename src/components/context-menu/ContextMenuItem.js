import MenuItem from "../menu/MenuItem";

export default function ContextMenuItem(config) {
    if(!(this instanceof ContextMenuItem)) {
        return new ContextMenuItem(config);
    }

    MenuItem.call(this, config);
}


ContextMenuItem.defaultTemplate = null;

ContextMenuItem.use = function(template) {
    ContextMenuItem.defaultTemplate = template.contextMenuItem;
};