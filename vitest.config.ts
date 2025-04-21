
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    // Explicitly define that we're in test mode when running via Vitest
    'import.meta.env.MODE': JSON.stringify('test'),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/types/',
        '**/*.d.ts',
        'src/__tests__/',
        '**/__tests__/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/index.ts',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70
      }
    },
    // Enable accessibility testing
    deps: {
      inline: [/axe-core/],
    },
    // Include a11y tests explicitly
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', '**/accessibility/*.test.{js,ts,jsx,tsx}'],
    // Add mutation testing coverage
    mutation: {
      // Stryker will use this configuration
      stryker: {
        configFile: 'stryker.config.js'
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});
