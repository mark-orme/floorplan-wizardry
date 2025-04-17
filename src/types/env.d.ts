
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENABLE_SENTRY_DEV: string;
  readonly SENTRY_ORG: string;
  readonly SENTRY_PROJECT: string;
  readonly SENTRY_SECRET_KEY: string;  // Added this line
  readonly SENTRY_AUTH_TOKEN: string;
  readonly RELEASE_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
