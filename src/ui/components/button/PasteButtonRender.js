import {ButtonRender} from '../../index';


export default function PasteButtonRender($desc, instance) {

    return ButtonRender($desc, instance).onClick(() => {
        if(!$desc.target) {
            return;
        }
        navigator.clipboard.readText().then(text => {
            $desc.target.set(text);
        });
    });
}