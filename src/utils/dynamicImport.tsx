import { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Utility for dynamically importing components with proper typing
 * @param loader Function that loads the component
 * @returns A properly typed lazy-loaded component
 */
export function dynamicImport<P extends ComponentType<any>>(
  loader: () => Promise<{ default: P }>
): LazyExoticComponent<P> {
  return lazy(loader) as LazyExoticComponent<P>;
}

/**
 * Check if a feature is enabled
 * @param featureName Name of the feature to check
 * @returns Whether the feature is enabled
 */
export function isFeatureEnabled(featureName: string): boolean {
  // Feature flags can be stored in localStorage, environment variables, or fetched from an API
  const enabledFeatures = process.env.ENABLED_FEATURES || '';
  return enabledFeatures.includes(featureName);
}

/**
 * Initialize feature flags
 */
export function initFeatureFlags(): void {
  console.log('Initializing feature flags');
  // Implementation can read from environment, localStorage, or API
}
