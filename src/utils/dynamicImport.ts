
/**
 * Utility for dynamic imports and feature flag checking
 */
import React, { Suspense, lazy, ComponentType } from 'react';
import logger from './logger';

// Feature flags configuration
interface FeatureFlags {
  enableCollaboration: boolean;
  enableOfflineMode: boolean;
  enableAutoSave: boolean;
  enableGridOptimization: boolean;
  enableExperimentalTools: boolean;
}

// Default feature flag values
const DEFAULT_FLAGS: FeatureFlags = {
  enableCollaboration: true,
  enableOfflineMode: true,
  enableAutoSave: true,
  enableGridOptimization: true,
  enableExperimentalTools: false
};

// Current feature flags (initialized with defaults)
let currentFlags: FeatureFlags = { ...DEFAULT_FLAGS };

/**
 * Initialize feature flags
 * @param flags - Feature flags to override defaults
 */
export function initFeatureFlags(flags: Partial<FeatureFlags> = {}): void {
  currentFlags = {
    ...DEFAULT_FLAGS,
    ...flags
  };
  
  logger.info('Feature flags initialized', currentFlags);
}

/**
 * Check if a feature is enabled
 * @param featureName - Feature flag name
 * @returns True if feature is enabled
 */
export function isFeatureEnabled(featureName: keyof FeatureFlags): boolean {
  if (!(featureName in currentFlags)) {
    logger.warn(`Unknown feature flag: ${featureName}`);
    return false;
  }
  
  return currentFlags[featureName];
}

/**
 * Dynamically import a module based on feature flag
 * @param importFn - Function returning dynamic import
 * @param featureName - Feature flag name
 * @param fallbackFn - Function to handle when feature is disabled
 * @returns Promise resolving to module or fallback
 */
export async function dynamicImportWithFlag<T>(
  importFn: () => Promise<T>,
  featureName: keyof FeatureFlags,
  fallbackFn?: () => Promise<T>
): Promise<T> {
  if (isFeatureEnabled(featureName)) {
    try {
      return await importFn();
    } catch (error) {
      logger.error(`Failed to import module for feature: ${featureName}`, error);
      if (fallbackFn) {
        return fallbackFn();
      }
      throw error;
    }
  } else if (fallbackFn) {
    return fallbackFn();
  } else {
    throw new Error(`Feature ${featureName} is disabled and no fallback provided`);
  }
}

/**
 * Dynamically import a module
 * @param importPath - Path to module
 * @returns Promise resolving to module
 */
export async function dynamicImport<T>(importPath: string): Promise<T> {
  try {
    const module = await import(/* @vite-ignore */ importPath);
    return module as T;
  } catch (error) {
    logger.error(`Failed to dynamically import: ${importPath}`, error);
    throw error;
  }
}

/**
 * Create a function that only executes if a feature is enabled
 * @param fn - Function to conditionally execute
 * @param featureName - Feature flag name
 * @returns Conditional function
 */
export function withFeatureGuard<T extends (...args: any[]) => any>(
  fn: T,
  featureName: keyof FeatureFlags
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    if (isFeatureEnabled(featureName)) {
      return fn(...args);
    }
    logger.info(`Function call skipped - feature ${featureName} is disabled`);
    return undefined;
  };
}

/**
 * Dynamic component import with Suspense fallback
 */
interface DynamicImportProps<P> {
  component: ComponentType<P>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

export function DynamicImport<P>({
  component: Component,
  fallback = <div>Loading...</div>,
  ...props
}: DynamicImportProps<P>): React.ReactElement {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}

/**
 * Lazy load a component with feature flag check
 * @param importFn - Function that imports the component
 * @param featureName - Feature flag name to check
 * @param fallbackComponent - Component to show if feature is disabled
 */
export function lazyWithFeatureFlag<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  featureName: keyof FeatureFlags,
  fallbackComponent?: T
): T {
  return lazy(() => {
    if (isFeatureEnabled(featureName)) {
      return importFn();
    }
    
    if (fallbackComponent) {
      return Promise.resolve({
        default: fallbackComponent
      });
    }
    
    return Promise.resolve({
      default: (props: any) => (
        <div className="p-4 text-center text-gray-500">
          Feature {featureName} is disabled
        </div>
      )
    }) as Promise<{ default: T }>;
  });
}
