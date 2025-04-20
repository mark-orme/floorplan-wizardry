
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { visualizer } from "rollup-plugin-visualizer";
import stripLogsPlugin from "./src/utils/logger/stripLogsPlugin.js";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      clientPort: 443,
      protocol: 'wss',
      timeout: 10000,
      overlay: true
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Strip debug logs in production
    mode === 'production' && stripLogsPlugin({ include: ['debug', 'dev', 'info'] }),
    mode !== 'development' && sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
      sourcemaps: {
        assets: ['./dist/**/*']
      },
      release: {
        name: process.env.RELEASE_VERSION || 'development'
      }
    }),
    visualizer({
      open: mode === 'development',
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable source maps in production for Sentry error tracking
    sourcemap: mode === 'production' ? 'hidden' : true,
    // Minify with esbuild (built into Vite)
    minify: true,
    // Reduce bundle size with code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-avatar'],
          'vendor-canvas': ['fabric'],
          'vendor-utils': ['date-fns', 'uuid', 'zod', 'clsx'],
          // Feature based chunks
          'feature-collaboration': ['y-websocket', 'yjs'],
          'feature-charts': ['recharts'],
          'feature-forms': ['react-hook-form', '@hookform/resolvers'],
          // Geometry engine as a separate chunk for optimization
          'geometry-engine': ['./src/packages/geometry-engine/index.ts']
        }
      }
    },
    // Split chunks by size
    chunkSizeWarningLimit: 600,
  },
  preview: {
    port: 8080,
    host: "::"
  }
}));
