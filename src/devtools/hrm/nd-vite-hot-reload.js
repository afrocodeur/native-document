// vite-plugin-native-document-hmr.js
import transformComponent from "./transformComponent.js";

export default function NdViteHotReload(options) {
    const {
        include = /\.nd\.js$/,
        preserveState = true
    } = options;

    return {
        name: 'vite-plugin-native-document-hmr',
        apply: 'serve',
        enforce: 'post',

        handleHotUpdate({ file, server, modules }) {
            if (!include.test(file)) {
                return;
            }

            // Notify the browser about the change
            server.ws.send({
                type: 'nd-hmr-file',
                event: 'nd:update',
                data: { file, msg: 'The content has changed' }
            });

            // We will manage all manually
            return modules.filter(Boolean);
        },
        transform(code, id) {
            if (!include.test(id)) return null;
            if (id.includes('node_modules')) return null;

            try {
                return transformComponent(id, code, { preserveState });
            } catch (error) {
                console.error(`[NativeDocument] Transform error in ${id}:`, error);
                return null;
            }
        },

        configResolved() {
            console.log('[NativeDocument] HMR Plugin loaded ✓');
        }
    };
}