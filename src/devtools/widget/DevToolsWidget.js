import {Div, Button} from "../../../elements";
import {DevToolService} from "../plugin";

export default function DevToolsWidget() {
    let shouldFollowPointer = false;
    const setFullScreen = () => {
        alert('Move to full-screen');
    }

    const $element = Div({ class: 'devtools-app-panel-widget', style: 'left: 50%; top: 95%' }, [
        Div({ class: 'widget-label'}, DevToolService.createdObservable),
        Button({ class: 'widget-button' }, 'Full').nd.onClick(setFullScreen)
    ]);

    $element.nd
        .onStopMouseDown(() => shouldFollowPointer = true)
        .onMouseUp((event) => shouldFollowPointer = false);

    document.addEventListener('mousemove', (event) => {
        if(shouldFollowPointer) {
            $element.style = 'left: '+event.clientX+'px; top: '+event.clientY+'px';
        }
    });

    return $element;
};