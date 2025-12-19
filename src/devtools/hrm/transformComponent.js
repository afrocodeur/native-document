import fs from 'node:fs';
import path from 'node:path';
// import { parse } from '@babel/parser';
import MagicString from 'magic-string';

import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';
import { default as traverse } from '@babel/traverse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const renameImportedObservables = (content, match) => {
    let isObservableFound = false;
    let isObservableShortFound = false;
    const transformedContentArray = match.split(',').map(item => {
        let trimmed = item.trim();

        if (trimmed === 'Observable') {
            isObservableFound = true;
            return 'Observable as __OriginalObservable__';
        }
        if (trimmed === '$') {
            isObservableShortFound = true;
            return '$ as __$__';
        }

        return ` ${trimmed}`;
    });
    if(!isObservableFound && isObservableShortFound) {
        transformedContentArray.push('Observable as __OriginalObservable__')
    }
    const transformedContent = transformedContentArray.join(', ');

    return `import {${transformedContent} } from 'native-document'`;
};

function transformObservableImports(code, params) {
    const renameImportationCode = code.replace(/import\s+\{([^}]+?)\}\s+from\s+['"]native-document['"]/g, renameImportedObservables);
    const isRenamed = renameImportationCode !== code;

    const s = new MagicString(renameImportationCode);
    if(isRenamed) {
        //Todo: move this code outside the function
        const hrmObservableHookTemplate = fs.readFileSync(__dirname + '/hrm.orbservable.hook.template.js', 'utf8');
        s.append(template(
            hrmObservableHookTemplate,
            params ?? {}
        ));
    }

    return s.toString();
}

function transformObservableDeclarations(code) {
    const regex = /const\s+(\w+)\s*=\s*(\$|Observable)(\.(?:init|array|json))?\s*\(/g;

    return code.replace(regex, (match, varName, caller, method) => {
        const obsName = method ? `${caller}${method}` : 'Observable';
        return `const ${varName} = ${obsName}('${varName}', arguments[arguments.length - 1], `;
    });
}

function template(code, params) {
    let codeFormatted = code;
    for(const key in params) {
        codeFormatted = codeFormatted.replace(new RegExp("\\$\{"+key+"}", 'ig'), params[key]);
    }
    return codeFormatted;
}

export default function transformComponent(id, code, options) {
    let hasDefaultExport = false;
    let componentName = null;
    let exportStart = 0;
    let exportEnd = 0;
    // TODO: move this line outside the function
    const hrmHookTemplate = fs.readFileSync(__dirname + '/hrm.hook.template.js', 'utf8');
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

    s.prepend('import ComponentRegistry from "native-document/src/devtools/hrm/ComponentRegistry";');
    s.append(`export default ComponentRegistry.register('${id}', ${hrmComponentName}, { preserveState: ${options.preserveState} });`);
    s.append(hrmHookTemplateFormatted);

    return {
        code: s.toString(),
        map: s.generateMap({ source: id, hires: true })
    };
}