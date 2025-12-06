let DebugManager = {};

if(process.env.NODE_ENV === 'development') {
    DebugManager = {
        enabled: false,

        enable() {
            this.enabled = true;
            console.log('🔍 NativeDocument Debug Mode enabled');
        },

        disable() {
            this.enabled = false;
        },

        log(category, message, data) {
            if (!this.enabled) return;
            console.group(`🔍 [${category}] ${message}`);
            if (data) console.log(data);
            console.trace();
            console.groupEnd();
        },

        warn(category, message, data) {
            if (!this.enabled) return;
            console.warn(`⚠️ [${category}] ${message}`, data);
        },

        error(category, message, error) {
            console.error(`❌ [${category}] ${message}`, error);
        }
    };

}
if(process.env.NODE_ENV === 'production') {
    DebugManager = {
        log() {},
        warn() {},
        error() {},
        disable() {}
    };
}
export default DebugManager;