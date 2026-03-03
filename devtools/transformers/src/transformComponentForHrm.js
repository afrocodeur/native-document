import fs from 'node:fs';
import path from 'node:path';
// import { parse } from '@babel/parser';
import MagicString from 'magic-string';

import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';
import { default as traverse } from '@babel/traverse';

import { transformObservableImports, transformObservableDeclarations, template } from './utils.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default function transformComponentForHrm(id, code, options) {
    let hasDefaultExport = false;
    let componentName = null;
    let exportStart = 0;
    let exportEnd = 0;
    // TODO: move this line outside the function
    const hrmHookTemplate = fs.readFileSync(__dirname + '/../templates/hrm.hook.template.js', 'utf8');
    const formattedCode = transformObservableDeclarations(
        transformObservableImports(code, { id, ...options }),
    );
    const s = new MagicString(formattedCode);
    const codeParsed = parse(formattedCode, {
        sourceType: 'module',
        plugins: []
    });

    traverse.default(codeParsed, {
        ExportDefaultDeclaration(path) {
            hasDefaultExport = true;
            const declaration = path.node.declaration;

            if (declaration.id) {
                componentName = declaration.id.name;
            } else if (declaration.type === 'Identifier') {
                componentName = declaration.name;
            } else {
                componentName = 'AnonymousComponent';
            }

            exportStart = path.node.start;
            exportEnd = path.node.end;
        },
    });
    if (!hasDefaultExport) {
        return null;
    }

    const originalExport = formattedCode.slice(exportStart, exportEnd);
    const hrmComponentName = `__HRM_${componentName}__`;
    const newExport = originalExport.replace(
        'export default',
        `const ${hrmComponentName} =`
    );
    s.overwrite(exportStart, exportEnd, newExport);

    const hrmHookTemplateFormatted = template(hrmHookTemplate, {
        id
    });

    s.prepend('import ComponentRegistry from "native-document/devtools/ComponentRegistry";');
    s.append(`export default ComponentRegistry.register('${id}', ${hrmComponentName}, { preserveState: ${options.preserveState} });`);
    s.append(hrmHookTemplateFormatted);

    return {
        code: s.toString(),
        map: s.generateMap({ source: id, hires: true })
    };
}