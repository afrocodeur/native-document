import DebugManager from "./debug-manager";

const PluginsManager = (function() {

    const $plugins = new Map();
    const $pluginByEvents = new Map();

    return {
        list() {
            return $pluginByEvents;
        },
        add(name, plugin){
            if (!plugin || typeof plugin !== 'object') {
                throw new Error(`Plugin ${name} must be an object`);
            }
            if($plugins.has(name)) {
                return;
            }

            plugin.$name = name;
            $plugins.set(name ,plugin);
            if(typeof plugin?.init === 'function') {
                plugin.init();
            }
            for(const methodName in plugin) {
                if(/^on[A-Z]/.test(methodName)) {
                    if(!$pluginByEvents.has(methodName)) {
                        $pluginByEvents.set(methodName, new Set());
                    }
                    $pluginByEvents.get(methodName).add(plugin);
                }
            }
        },
        remove(pluginName){
            if(!$plugins.has(pluginName)) {
                return;
            }
            const plugin = $plugins.get(pluginName);
            if(typeof plugin.cleanup === 'function') {
                plugin.cleanup();
            }
            for(const [name, sets] of $pluginByEvents.entries() ) {
                if(sets.has(plugin)) {
                    sets.delete(plugin);
                }
                if(sets.size === 0) {
                    $pluginByEvents.delete(name);
                }
            }
            $plugins.delete(pluginName);
        },
        emit(event, ...data) {
            const eventMethodName = 'on'+event
            if(!$pluginByEvents.has(eventMethodName)) {
                return;
            }
            const plugins = $pluginByEvents.get(eventMethodName);

            for(const plugin of plugins) {
                const callback = plugin[eventMethodName];
                if(typeof callback === 'function') {
                    try{
                        callback.call(plugin, ...data);
                    } catch (error) {
                        DebugManager.error('Plugin Manager', `Error in plugin ${plugin.$name} for event ${eventMethodName}`, error);
                    }
                }
            }
        }
    };
}());

export default PluginsManager;