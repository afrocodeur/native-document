
const pluginsManager = (function() {

    const $plugins = [];

    return {
        list : () => $plugins,
        add : (plugin) => $plugins.push(plugin)
    };
}());

export default pluginsManager;