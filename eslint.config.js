import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType:  'module',
      globals: {
        window:    'readonly',
        document:  'readonly',
        navigator: 'readonly',
        console:   'readonly',
        setTimeout:   'readonly',
        clearTimeout: 'readonly',
        setInterval:   'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      // Possible errors
      'no-console':         'warn',
      'no-unused-vars':     'warn',
      'no-undef':           'error',

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