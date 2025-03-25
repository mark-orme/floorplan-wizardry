
/**
 * DOM utilities for safe element access
 * @module domUtils
 */

/**
 * Safely get an element by ID with proper typing
 * @param id - Element ID to find
 * @param elementType - Type of HTML element expected (for TypeScript)
 * @returns The element or null if not found
 */
export function getElementByIdSafe<T extends HTMLElement>(
  id: string,
  elementType?: new () => T
): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * Create a root element for mounting React components
 * @param rootId - ID of the element to use as root
 * @returns The root element or throws an error if not found
 */
export function createRootElement(rootId: string): HTMLElement {
  const rootElement = getElementByIdSafe(rootId);
  
  if (!rootElement) {
    throw new Error(`Could not find root element with id: ${rootId}`);
  }
  
  return rootElement;
}
