import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import { fileURLToPath } from 'node:url'

const AliasPlugin = alias({
    entries: [
        { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        { find: '@root', replacement: fileURLToPath(new URL('./', import.meta.url)) },
        { find: '@core', replacement: fileURLToPath(new URL('./index', import.meta.url)) },
        { find: '@src', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        { find: '@devtools', replacement: fileURLToPath(new URL('./src/devtools', import.meta.url)) },
    ]
});

const PreventProd = replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
    preventAssignment: true,
});

export default [
    {
        input: {
            main: 'index.js'
        },
        output: {
            dir: 'dist',
            entryFileNames: 'native-document.dev.js',
            format: 'iife',
            name: 'NativeDocument',
            sourcemap: true
        },
        plugins: [
            AliasPlugin,
            replace({
                'process.env.NODE_ENV': JSON.stringify('development'),
                preventAssignment: true,
            })
        ]
    },
    {
        input: {
            main: 'index.js'
        },
        output: {
            dir: 'dist',
            entryFileNames: 'native-document.min.js',
            format: 'iife',
            name: 'NativeDocument'
        },
        plugins: [
            AliasPlugin,
            PreventProd,
            terser()
        ]
    },
    {
        input: {
            main: 'src/devtools/index.js'
        },
        output: {
            dir: 'dist',
            entryFileNames: 'native-document.devtools.min.js',
            format: 'iife',
            name: 'NativeDocumentDevTools',
        },
        plugins: [
            AliasPlugin,
            PreventProd,
            terser()
        ]
    }
];