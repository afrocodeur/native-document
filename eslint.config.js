import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            // Possible errors
            'no-console': 'warn',
            'no-unused-vars': 'warn',
            'no-undef': 'error',

            // Best practices
            'eqeqeq': 'error', // always === instead of ==
            'no-var': 'error', // always let/const
            'prefer-const': 'warn', // prefer const when not reassigned
            'no-duplicate-imports': 'error',

            // Style
            'semi': ['error', 'always'],
            'quotes': ['warn', 'single'],
            'indent': ['warn', 4],
            'comma-dangle': ['warn', 'always-multiline'],
        },
        ignores: ['node_modules', 'dist'],
    },
];