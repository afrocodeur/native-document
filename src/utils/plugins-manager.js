import DebugManager from "./debug-manager";

const PluginsManager = (function() {

    const $plugins = new Map();
    const $pluginByEvents = new Map();

    return {
        list() {
            return $pluginByEvents;
        },
        add(plugin, name){
            if (!plugin || typeof plugin !== 'object') {
                throw new Error(`Plugin ${name} must be an object`);
            }
            name = name || plugin.name;
            if (!name || typeof name !== 'string') {
                throw new Error(`Please, provide a valid plugin name`);
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
                    const eventName = methodName.replace(/^on/, '');
                    if(!$pluginByEvents.has(eventName)) {
                        $pluginByEvents.set(eventName, new Set());
                    }
                    $pluginByEvents.get(eventName).add(plugin);
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
        emit(eventName, ...data) {
            if(!$pluginByEvents.has(eventName)) {
                return;
            }
            const plugins = $pluginByEvents.get(eventName);

            for(const plugin of plugins) {
                const callback = plugin['on'+eventName];
                if(typeof callback === 'function') {
                    try{
                        callback.call(plugin, ...data);
                    } catch (error) {
                        DebugManager.error('Plugin Manager', `Error in plugin ${plugin.$name} for event ${eventName}`, error);
                    }
                }
            }
        }
    };
}());

export default PluginsManager;