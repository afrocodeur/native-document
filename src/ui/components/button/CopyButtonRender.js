import ButtonRender from './ButtonRender';


export default function CopyButtonRender($desc, instance) {

    return ButtonRender($desc, instance).onClick(() => {
        if(!$desc.target) {
            return;
        }

        navigator.clipboard.writeText($desc.target.val());
    });
}