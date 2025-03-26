
/**
 * DOM utilities for safe element access
 * @module domUtils
 */

/**
 * Safely get an element by ID with proper typing
 * @param {string} id - Element ID to find
 * @param {Function} elementType - Constructor for the expected HTML element type
 * @returns {T|null} The element or null if not found
 * @template T - Type of HTML element to return
 */
export function getElementByIdSafe<T extends HTMLElement>(
  id: string,
  elementType?: new () => T
): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * Create a root element for mounting React components
 * @param {string} rootId - ID of the element to use as root
 * @returns {HTMLElement} The root element
 * @throws {Error} If the element with the given ID is not found
 */
export function createRootElement(rootId: string): HTMLElement {
  const rootElement = getElementByIdSafe(rootId);
  
  if (!rootElement) {
    throw new Error(`Could not find root element with id: ${rootId}`);
  }
  
  return rootElement;
}
