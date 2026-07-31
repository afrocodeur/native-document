import Button from './Button';
import BaseComponent from '../BaseComponent';


export default function PasteButton(content, props) {

    if(!(this instanceof PasteButton)) {
        return new PasteButton(content, props);
    }

    Button.call(this, content, props);

    Object.assign(this.$description, {
        content,
        props,
        target: null,
    });
}

BaseComponent.extends(PasteButton, Button);


PasteButton.defaultTemplate = null;
PasteButton.use = function (render){
    PasteButton.defaultTemplate = render;
};


PasteButton.prototype.into = function($observable) {
    this.$description.target = $observable;
    return this;
};