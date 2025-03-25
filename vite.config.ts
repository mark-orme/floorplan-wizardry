
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      // This setting enables HMR to work correctly with Lovable's preview environment
      clientPort: 443,
      // Ensure WebSocket connections use HTTPS when in production
      protocol: 'wss'
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Add Sentry source maps plugin if not in development
    mode !== 'development' && sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
      // and need to be set as environment variables
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false, // Optional: Disable sentry-cli telemetry
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable source maps in production for Sentry
    sourcemap: true,
  },
}));
