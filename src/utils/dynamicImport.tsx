
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
