import MenuGroup from "@components/menu/MenuGroup";

export default function ContextMenuGroup(label, config) {
    if(!(this instanceof ContextMenuGroup)) {
        return new ContextMenuGroup(label, config);
    }

    MenuGroup.call(this, label, config);
}


ContextMenuGroup.defaultTemplate = null;

ContextMenuGroup.use = function(template) {
    ContextMenuGroup.defaultTemplate = template.contextMenuGroup;
};