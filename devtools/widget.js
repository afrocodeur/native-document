import Widget from './widget/Widget';
import {PluginsManager} from "../index";
import { DevToolsPlugin } from "./plugin/dev-tools-plugin";

PluginsManager.add(DevToolsPlugin, 'Devtools');

const Devtools = (function () {

    return {
        config() {
            console.log('devtool init configuratzion');
        },
        rootApp() {

        },
        init() {
            const app = Widget();
            document.body.parentNode.appendChild(app);
        },
    }
}());

export default Devtools;