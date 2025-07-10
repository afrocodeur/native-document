// Build configuration
const isProd = process.env.NODE_ENV === 'production';

const DebugManager = {
    enabled: !isProd,

    enable() {
        this.enabled = true;
        console.log('🔍 NativeDocument Debug Mode enabled');
    },

    disable() {
        this.enabled = false;
    },

    log: isProd ? () => {} : function(category, message, data) {
        if (!this.enabled) return;
        console.group(`🔍 [${category}] ${message}`);
        if (data) console.log(data);
        console.trace();
        console.groupEnd();
    },

    warn: isProd ? () => {} : function(category, message, data) {
        if (!this.enabled) return;
        console.warn(`⚠️ [${category}] ${message}`, data);
    },

    error: isProd ? () => {} : function(category, message, error) {
        console.error(`❌ [${category}] ${message}`, error);
    }
};

export default DebugManager;