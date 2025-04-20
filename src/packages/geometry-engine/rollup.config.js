
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

// Base config for the library
const baseConfig = {
  input: 'index.ts',
  external: [
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.dependencies || {})
  ],
  plugins: [
    // Resolve node_modules
    resolve(),
    // Convert CommonJS modules to ES6
    commonjs(),
    // Compile TypeScript
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      rootDir: './'
    })
  ]
};

// Output configurations
const outputConfigs = [
  // ESM build
  {
    file: pkg.module,
    format: 'es'
  },
  // CommonJS build
  {
    file: pkg.main,
    format: 'cjs',
    exports: 'named'
  },
  // UMD build (browser-friendly)
  {
    name: 'GeometryEngine',
    file: 'dist/index.umd.js',
    format: 'umd',
    globals: {
      // Add any global dependencies here
    }
  }
];

// Type declarations
const dtsConfig = {
  input: './dist/index.d.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'es'
  },
  plugins: [dts()]
};

// Final configuration
export default [
  // Main builds
  ...outputConfigs.map(output => ({
    ...baseConfig,
    output: {
      ...output,
      sourcemap: true,
      plugins: isProduction ? [terser()] : []
    }
  })),
  // Type declarations
  dtsConfig
];
