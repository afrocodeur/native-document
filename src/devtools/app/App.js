import {Div} from "../../../elements";
import DevToolsWidget from "../widget/DevToolsWidget";

export default function App() {


    return Div(
        Div({ class: 'devtools-app-panel-wrapper pin-to-right' }, [
            DevToolsWidget,
            Div({ class: 'devtools-app-panel' }),
            Div('Gogo Panel')
        ]),
    ).nd.closedShadow(`
        .devtools-app-panel-wrapper {
            position: fixed;
            width: 0px;
            background: red;
            animate: .25s linear;
        }
        .devtools-app-panel-wrapper.pin-to-right {
            right: 0;
            top: 0;
            bottom: 0;
        }
        .devtools-app-panel-widget {
            position: fixed;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            padding: 2px;
            width: 150px;
            height: 30px;
            border-radius: 5px;
            border: 1px solid black;
            z-index: 10000009;
            color: white;
            cursor: pointer;
            transform: translate(-50%, -50%);
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            align-content: center;
        }
        .widget-button {
            width: 30px;
            padding: 2px;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid black;
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: center;
            color: white;
            border-radius: 5px;
            cursor: pointer;
            font-size: .9rem;
        }
        .widget-label {
            font-weight: bold;
            font-size: 1.5rem;
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `);
}