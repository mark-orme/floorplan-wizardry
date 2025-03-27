
/**
 * Type definitions for Fabric.js integration
 * @module types/fabric
 */

// Import the types directly from their definition file
// This avoids circular references
import type { 
  CanvasCreationOptions,
  CanvasReferences,
  GridDimensions,
  GridRenderResult,
  CustomTouchEvent,
  CustomFabricTouchEvent,
  FabricPointerEvent
} from './fabric.d';

// Re-export the imported types
export type {
  CanvasCreationOptions,
  CanvasReferences,
  GridDimensions,
  GridRenderResult,
  CustomTouchEvent,
  CustomFabricTouchEvent,
  FabricPointerEvent
};

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
 * @returns {boolean} True if the value is a pointer event
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
