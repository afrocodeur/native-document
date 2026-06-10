import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        globals:     true,
        include:     ['tests/**/*.test.js'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include:  ['src/**/*.js'],
            exclude:  ['src/**/*.d.ts', 'src/ui/**/*.css'],
        },
    },
});
