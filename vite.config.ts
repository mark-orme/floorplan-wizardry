
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { visualizer } from "rollup-plugin-visualizer";

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
      include: './dist',
      release: process.env.RELEASE_VERSION || 'development'
    }),
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true
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
