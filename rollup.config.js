import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';

const PreventProd = replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
    preventAssignment: true,
});

export default [
    {
        input: {
            main: 'cdn.js'
        },
        output: {
            dir: 'dist',
            entryFileNames: 'native-document.dev.js',
            format: 'iife',
            name: 'NativeDocument',
            sourcemap: true
        },
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify('development'),
                preventAssignment: true,
            })
        ]
    },
    {
        input: {
            main: 'cdn.js'
        },
        output: {
            dir: 'dist',
            entryFileNames: 'native-document.min.js',
            format: 'iife',
            name: 'NativeDocument'
        },
        plugins: [
            PreventProd,
            terser()
        ]
    },
    {
        input: {
            main: 'devtools/index.js'
        },
        output: {
            dir: 'dist',
            entryFileNames: 'native-document.devtools.min.js',
            format: 'iife',
            name: 'NativeDocumentDevTools',
        },
        plugins: [
            terser()
        ]
    },
    {
        input: {
            main: 'components.js'
        },
        output: {
            dir: 'dist',
            entryFileNames: 'native-document.components.min.js',
            format: 'iife',
            globals: 'NativeComponents',
            name: 'NativeComponents',
        },
        plugins: [
            PreventProd,
            postcss({
                extract: true,
                minimize: true,
            }),
            // terser()
        ]
    }
];