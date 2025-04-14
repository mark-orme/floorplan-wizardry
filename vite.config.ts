
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { terser } from "rollup-plugin-terser";

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
    mode !== 'development' && sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
    }),
    // Add Terser for JavaScript minification and basic obfuscation
    mode !== 'development' && terser({
      compress: {
        drop_console: true,
        dead_code: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        keep_fargs: false,
        hoist_vars: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        side_effects: true,
        warnings: false,
      },
      mangle: {
        toplevel: true,
        eval: true
      },
      output: {
        comments: false
      }
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
    // Minify with Terser
    minify: 'terser',
    // Reduce bundle size
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  preview: {
    port: 8080,
    host: "::"
  }
}));
