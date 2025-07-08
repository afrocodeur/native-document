import terser from '@rollup/plugin-terser';

export default [
    {
        input: {
            main: 'index.js'
        },
        output: {
            dir: 'dist',
            entryFileNames: 'native-document.dev.js',
            format: 'iife',
            name: 'NativeDocument'
        },
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
            terser()
        ]
    }
];