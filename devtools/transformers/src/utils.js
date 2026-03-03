import fs from 'node:fs';
import path from 'node:path';
import MagicString from 'magic-string';

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function template(code, params) {
    let codeFormatted = code;
    for(const key in params) {
        codeFormatted = codeFormatted.replace(new RegExp("\\$\{"+key+"}", 'ig'), params[key]);
    }
    return codeFormatted;
}

export function renameImportedObservables(content, match) {
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
}

export function transformObservableImports(code, params) {
    const renameImportationCode = code.replace(/import\s+\{([^}]+?)\}\s+from\s+['"]native-document['"]/g, renameImportedObservables);
    const isRenamed = renameImportationCode !== code;

    const s = new MagicString(renameImportationCode);
    if(isRenamed) {
        //Todo: move this code outside the function
        const hrmObservableHookTemplate = fs.readFileSync(__dirname + '/../templates/hrm.orbservable.hook.template.js', 'utf8');
        s.append(template(
            hrmObservableHookTemplate,
            params ?? {}
        ));
    }

    return s.toString();
}

export function transformObservableDeclarations(code) {
    const regex = /(const|let|var)\s+([\w$]+)\s*=\s*(\$|Observable)(\.(?:init|array|json))?\s*\(/g;

    return code.replace(regex, (match, varType, varName, caller, method) => {
        const obsName = method ? `${caller}${method}` : 'Observable';
        return `${varType} ${varName} = ${obsName}('${varName}', arguments[arguments.length - 1], `;
    });
}

export function isFileMustBeModified(file) {
    if(!/labs\/live\/src/.test(file)) {
        return false;
    }
    const content = fs.readFileSync(file, 'utf-8');
    const isContainObservableImport = /import\s+\{([^}]+?)\}\s+from\s+['"]native-document['"]/g.test(content);
    if(isContainObservableImport) {
        return true;
    }
    return /(const|let|var)\s+([\w$]+)\s*=\s*(\$|Observable)(\.(?:init|array|json))?\s*\(/g.test(content);
}