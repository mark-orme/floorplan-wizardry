
/**
 * Type definitions for Fabric.js integration
 * @module types/fabric
 */

// Define the exports directly instead of re-exporting from the same file
// This fixes the circular reference issue
export type { 
  CanvasCreationOptions,
  CanvasReferences,
  GridDimensions,
  GridRenderResult,
  CustomTouchEvent,
  CustomFabricTouchEvent,
  FabricPointerEvent
} from './fabric.d';

/**
 * Type guard to check if a value is a Touch event
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is a Touch event
 */
export function isTouchEvent(value: unknown): value is TouchEvent {
  return typeof value === 'object' && 
         value !== null && 
         'touches' in value &&
         'changedTouches' in value;
}

/**
 * Type guard to check if a value is a fabric-compatible touch event
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is a fabric-compatible touch event
 */
export function isFabricTouchEvent(value: unknown): value is CustomFabricTouchEvent {
  return typeof value === 'object' && 
         value !== null && 
         'touches' in value;
}

/**
 * Type guard to check if a value is a pointer/mouse event
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is a pointer/mouse event
 */
export function isPointerEvent(value: unknown): value is PointerEvent {
  return typeof value === 'object' && 
         value !== null && 
         'pointerId' in value;
}

/**
 * Type guard to check if a value is a mouse event
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is a mouse event
 */
export function isMouseEvent(value: unknown): value is MouseEvent {
  return typeof value === 'object' && 
         value !== null && 
         'clientX' in value &&
         'clientY' in value &&
         !('touches' in value);
}
