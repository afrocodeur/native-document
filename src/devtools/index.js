import App from './app/App';
import {DevToolsPlugin} from "./plugin";

const Devtools = (function () {

    return {
        config() {
            console.log('devtool init configuratzion');
        },
        init() {
            const app = App();
            document.body.parentNode.appendChild(app.$element);
        },
        plugin: DevToolsPlugin
    }
}());

export default Devtools;