
/**
 * Hook for managing DOM element references
 * @module useDomRef
 */
import { useRef, useEffect } from "react";

/**
 * Hook to handle element references with optional focus
 * @param shouldFocus - Whether to automatically focus the element when mounted
 * @param focusDelay - Delay in ms before focusing (default: 100ms)
 * @returns React ref object for the element
 */
export function useDomRef<T extends HTMLElement>(
  shouldFocus: boolean = false,
  focusDelay: number = 100
) {
  const elementRef = useRef<T | null>(null);
  
  useEffect(() => {
    if (shouldFocus && elementRef.current) {
      const timer = setTimeout(() => {
        elementRef.current?.focus();
      }, focusDelay);
      
      return () => clearTimeout(timer);
    }
  }, [shouldFocus, focusDelay]);
  
  return elementRef;
}
