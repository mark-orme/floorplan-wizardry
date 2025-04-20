
/**
 * Utilities for dynamic imports and code splitting
 * @module utils/dynamicImport
 */

import { lazy, Suspense } from 'react';
import { toast } from 'sonner';

// Type for feature flag configuration
export interface FeatureFlags {
  [key: string]: boolean;
}

// Default feature flags
let featureFlags: FeatureFlags = {
  enableExperimentalTools: false,
  enableAdvancedExport: false,
  enableCollaboration: true,
  enableOfflineMode: true,
  enablePerformanceMode: false
};

/**
 * Set feature flags
 * @param flags Feature flag configuration
 */
export function setFeatureFlags(flags: Partial<FeatureFlags>): void {
  featureFlags = { ...featureFlags, ...flags };
}

/**
 * Get current feature flags
 * @returns Current feature flag configuration
 */
export function getFeatureFlags(): FeatureFlags {
  return { ...featureFlags };
}

/**
 * Check if a feature is enabled
 * @param feature Feature flag key
 * @returns Whether feature is enabled
 */
export function isFeatureEnabled(feature: string): boolean {
  return Boolean(featureFlags[feature]);
}

/**
 * Create a dynamic import with error handling
 * @param importFn Import function
 * @returns Lazy-loaded component
 */
export function createDynamicImport(importFn: () => Promise<any>) {
  return lazy(() => 
    importFn().catch(error => {
      console.error('Failed to load module:', error);
      toast.error('Failed to load module');
      return { default: () => <div>Failed to load component</div> };
    })
  );
}

/**
 * Dynamic import with feature flag check
 * @param importFn Import function
 * @param featureFlag Feature flag name
 * @param fallback Fallback component if feature is disabled
 * @returns Component or fallback
 */
export function createFeatureFlaggedImport(
  importFn: () => Promise<any>,
  featureFlag: string,
  fallback: React.ComponentType = () => null
) {
  return lazy(async () => {
    if (isFeatureEnabled(featureFlag)) {
      try {
        return await importFn();
      } catch (error) {
        console.error(`Failed to load feature "${featureFlag}":`, error);
        toast.error(`Failed to load feature "${featureFlag}"`);
        return { default: fallback };
      }
    } else {
      return { default: fallback };
    }
  });
}

/**
 * Dynamic import wrapper component
 */
export function DynamicImport({ 
  component: Component, 
  fallback = <div>Loading...</div>,
  ...props 
}: { 
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}
