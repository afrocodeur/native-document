#!/usr/bin/env node

import Fs from 'node:fs';
import Path from 'node:path';
const configFile = Path.resolve('i18n.scanner.config.json');

const Debug = {
    $warning: [],
    warn(category, message, data) {
        Debug.$warning.push({ message: `[${category}] ${message}`, data });
    },
};

function scanFolder(dirPath, callback) {
    const files = Fs.readdirSync(dirPath);

    files.forEach((file) => {
        const filePath = Path.join(dirPath, file);
        const stats = Fs.statSync(filePath);

        if (stats.isDirectory()) {
            scanFolder(filePath, callback);
        } else if (stats.isFile()) {
            // If it's a file, add its path to the list
            callback(filePath);
        }
    });
}

function scanFile(filePath) {
    const fileContent = Fs.readFileSync(filePath, 'utf-8');
    const keys = [];
    fileContent.replace(/\btr\((.*?)\)/g, function(_, args) {
        const key = getKey(args, filePath);
        if(key) {
            keys.push(key);
        }
    });
    return keys;
}

function getKey(args, filePath) {
    const trimmed = args.trim();
    const firstChar = trimmed[0];
    if(firstChar !== '"' && firstChar !== '\'') {
        Debug.warn('Key Extract', '', {
            message: `can't extract key from ("${args}") in file.`,
            args: args,
            file: filePath,
        });

        return;
    }
    const key = [];
    let i = 1;
    while(i < trimmed.length) {
        const char = trimmed[i];
        if(char === '\\') {
            key.push(trimmed[++i]);
            i++;
            continue;
        }
        if(char === firstChar) {
            break;
        }
        i++;
        key.push(char);
    }
    return key.join('');
}

function scan() {
    if(!Fs.existsSync(configFile)) {
        console.error('Config file not found. Please create i18n.scanner.config.json file in your project root directory.');
        return;
    }

    const keys = [];
    try {
        const configContent = Fs.readFileSync(configFile, 'utf-8');
        const config = JSON.parse(configContent);
        const initialPath = Path.resolve(process.cwd(), config?.scan?.dir || 'src');
        scanFolder(initialPath, (filePath) => {
            const fileExtensions = config?.scan?.extensions || ['js'];
            const shouldScanFile = fileExtensions.some(extension => filePath.endsWith(extension));
            if(!shouldScanFile) {
                return;
            }
            keys.push(...scanFile(filePath));
        });
        if(!config?.locales) {
            console.log('No locales found in config file.');
            return;
        }

        console.log(':: scan locales');
        scanFolder(config.locales, (filePath) => {
            if(!filePath.endsWith('.json')) {
                return;
            }
            const locale = Path.basename(filePath, '.json');
            const localeData = JSON.parse(Fs.readFileSync(filePath, 'utf-8'));
            const localeKeys = Object.keys(localeData);
            const absentKeys = keys.filter(key => !localeKeys.includes(key));

            const result = absentKeys.reduce((acc, key) => {
                acc[key] = key;
                return acc;
            }, {});

            console.log('-- ' + locale + ` : ${absentKeys.length} keys are absent in locale file.`);
            if(!config?.save) {
                console.log('-- display result:');
                console.log(result);
                return;
            }

            const saveFile = config.save+'/'+(locale+'.absent.json');
            const saveFilePath = Path.resolve(process.cwd(), saveFile);
            console.log('-- save result to ' + saveFile);
            const dirName = Path.dirname(saveFilePath);
            if(!Fs.existsSync(saveFilePath)) {
                Fs.mkdirSync(dirName, { recursive: true });
            }
            Fs.writeFileSync(saveFilePath, JSON.stringify(result, null, 4));
        });
    } catch (e) {
        console.log(e);
    }
}

scan();