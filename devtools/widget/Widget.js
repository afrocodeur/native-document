import {Observable} from "../../src/core/data/Observable";
import {Button, Div, ShowIf, Switch} from "../../elements";

import './widget.css';

export default function Widget() {

    const $isNotMinimize = Observable(false);
    const $isMaximize = Observable(false);

    const toggleMinimize = () => {
        $isNotMinimize.toggle();
    }
    const toggleMaximize = () => {
        $isNotMinimize.set(true);
        $isMaximize.toggle();
    }
    const close = () => {}


    return Div({
        class: {
            'nd-dev-tools-widget': true,
            'nd-dev-tools-widget-maximize': $isMaximize,
            'nd-dev-tools-widget-not-minimize': $isNotMinimize,
        }
        },
        [
            Div({ class: 'nd-dev-tools-widget-header'},[
                Switch(
                    $isNotMinimize,
                    Div({ class: 'nd-dev-tools-widget-header-title'}, 'DevTools'),
                    Div({ class: 'nd-dev-notification-badge' }, 100)
                ),
                Div({ class: 'nd-dev-tools-widget-header-options'}, [
                    Button({ class: 'nd-dev-tools-widget-header-option btn-close'}).nd.onClick(close),
                    Button({ class: 'nd-dev-tools-widget-header-option btn-maximize'}).nd.onClick(toggleMaximize),
                    Button({ class: 'nd-dev-tools-widget-header-option btn-minimize'}).nd.onClick(toggleMinimize),
                ])
            ]),
            ShowIf(
                $isNotMinimize,
                Div({ class: 'nd-dev-tools-widget-content'}, [
                    'Show me sometghings'
                ])
            )
        ]
    );
}