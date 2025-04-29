
/**
 * Canvas render optimizations
 */
import { FabricEventHandler } from '@/types/canvas/ExtendedCanvas';

/**
 * Creates a debounced event handler for smooth canvas events
 * @param handler The original event handler
 * @param delay Debounce delay in milliseconds
 * @returns A smoothed event handler
 */
export function createSmoothEventHandler<T>(
  handler: FabricEventHandler<T>,
  delay: number = 16
): FabricEventHandler<T> {
  let timeoutId: number | null = null;
  
  return (e: { target: T }) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = window.setTimeout(() => {
      handler(e);
      timeoutId = null;
    }, delay);
  };
}
