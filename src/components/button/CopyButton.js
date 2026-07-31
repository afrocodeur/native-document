import BaseComponent from '../BaseComponent';
import Button from './Button';


export default function CopyButton(content, props){

    if(!(this instanceof CopyButton)) {
        return new CopyButton(content, props);
    }

    Button.call(this, content, props);

    Object.assign(this.$description, {
        target: null,
        content,
        props,
    });

};

BaseComponent.extends(CopyButton, Button);

CopyButton.defaultTemplate = null;
CopyButton.use = function (render){
    CopyButton.defaultTemplate = render;
};

/**
 *
 * @param {Observable} $observable
 * @returns {CopyButton}
 */
CopyButton.prototype.from = function($observable) {
    this.$description.target = $observable;
    return this;
};

