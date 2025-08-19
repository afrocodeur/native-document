import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

const isProduction = process.env.NODE_ENV === 'production';
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
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
                preventAssignment: true,
            }),
            terser()
        ]
    }
];