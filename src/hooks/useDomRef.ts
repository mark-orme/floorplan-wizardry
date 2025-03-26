
/**
 * Hook for managing DOM element references
 * Provides an enhanced ref with focus capabilities
 * @module useDomRef
 */
import { useRef, useEffect } from "react";

/**
 * Hook to handle element references with optional focus
 * Creates a ref and optionally focuses the element when it's mounted
 * Useful for form inputs, dialogs, and other interactive elements
 * 
 * @template T - Type of the HTML element
 * @param {boolean} shouldFocus - Whether to automatically focus the element when mounted
 * @param {number} focusDelay - Delay in ms before focusing (default: 100ms)
 * @returns {React.RefObject<T>} React ref object for the element
 * 
 * @example
 * // Create a ref for a text input that will be auto-focused
 * const inputRef = useDomRef<HTMLInputElement>(true);
 * 
 * // Create a ref for a button with a custom focus delay
 * const buttonRef = useDomRef<HTMLButtonElement>(true, 500);
 * 
 * // Usage in JSX
 * <input ref={inputRef} type="text" />
 */
export function useDomRef<T extends HTMLElement>(
  shouldFocus: boolean = false,
  focusDelay: number = 100
) {
  /**
   * Reference to the DOM element
   * @type {React.MutableRefObject<T | null>}
   */
  const elementRef = useRef<T | null>(null);
  
  useEffect(() => {
    /**
     * Focus the element after a delay
     * Only runs if shouldFocus is true and the element exists
     */
    if (shouldFocus && elementRef.current) {
      /**
       * Timer to delay focus
       * Useful for ensuring the element is fully rendered
       * @type {number}
       */
      const timer = setTimeout(() => {
        elementRef.current?.focus();
      }, focusDelay);
      
      // Clean up timer on unmount
      return () => clearTimeout(timer);
    }
  }, [shouldFocus, focusDelay]);
  
  return elementRef;
}
