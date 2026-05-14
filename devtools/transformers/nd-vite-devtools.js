import transformComponentForHrm from "./src/transformComponentForHrm.js";
import {isFileMustBeModified} from "./src/utils.js";
import transformJsFile from "./src/transformJsFile.js";

export default function NdViteDevtools(options) {
    const {
        include = /\.nd\.js$/,
        preserveState = true
    } = options;

    return {
        name: 'nd-devtools',
        apply: 'serve',
        enforce: 'post',

        handleHotUpdate({ file, server, modules }) {
            if (!include.test(file)) {
                if(isFileMustBeModified(file)) {
                    return modules.filter(Boolean);
                }
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
            if (!include.test(id)) {
                if(isFileMustBeModified(id)) {
                    return transformJsFile(id, code, { preserveState });
                }
                return null;
            }
            if (id.includes('node_modules')) return null;

            try {
                return transformComponentForHrm(id, code, { preserveState });
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