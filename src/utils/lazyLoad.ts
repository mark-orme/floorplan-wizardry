
/**
 * Lazy Loading Utility
 * Provides utilities for dynamically loading modules and components
 */
import { useState, useEffect } from 'react';
import logger from '@/utils/logger';

/**
 * Dynamically import a module
 * @param modulePath Path to the module
 * @returns Promise resolving to the loaded module
 */
export async function dynamicImport<T>(modulePath: string): Promise<T> {
  try {
    const module = await import(/* webpackChunkName: "[request]" */ `${modulePath}`);
    return module as T;
  } catch (error) {
    logger.error(`Failed to load module: ${modulePath}`, { error });
    throw error;
  }
}

/**
 * State object returned by useDynamicImport
 */
interface DynamicImportState<T> {
  module: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for dynamically importing modules
 * @param modulePath Path to the module
 * @returns Dynamic import state object
 */
export function useDynamicImport<T>(modulePath: string): DynamicImportState<T> {
  const [state, setState] = useState<DynamicImportState<T>>({
    module: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const module = await dynamicImport<T>(modulePath);
        
        if (mounted) {
          setState({
            module,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        if (mounted) {
          setState({
            module: null,
            loading: false,
            error: error instanceof Error ? error : new Error('Failed to load module')
          });
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [modulePath]);

  return state;
}

/**
 * Preload a module without rendering
 * @param modulePath Path to the module
 * @returns Promise resolving when the module is loaded
 */
export function preloadModule(modulePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = modulePath;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload ${modulePath}`));
      document.head.appendChild(link);
    } catch (error) {
      reject(error);
    }
  });
}
