let DebugManager = {};

if(process.env.NODE_ENV === 'development') {
    DebugManager = {
        enabled: true,

        enable() {
            DebugManager.log('NativeDocument Debug Mode enabled');
        },

        disable() {
            this.enabled = false;
        },

        log(category, message, data) {
            console.group(`[${category}] ${message}`);
            if (data) console.log(data);
            console.trace();
            console.groupEnd();
        },

        warn(category, message, data) {
            console.warn(`[${category}] ${message}`, data);
        },

        error(category, message, error) {
            console.error(`[${category}] ${message}`, error);
        },
    };

}
if(process.env.NODE_ENV === 'production') {
    DebugManager = {
        log() {},
        warn() {},
        error() {},
        disable() {},
    };
}
export default DebugManager;