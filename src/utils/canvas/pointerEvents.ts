/**
 * Enhanced pointer events for canvas interaction
 * @module utils/canvas/pointerEvents
 */

/**
 * Enhanced pointer event interface with additional properties
 * for stylus and pressure sensitivity
 */
export interface EnhancedPointerEvent extends Omit<PointerEvent, "pressure"> {
  /** Pointer pressure level (0-1) */
  pressure: number;
  /** Tangential pressure - optional property for stylus */
  tangentialPressure?: number;
  /** Tilt X value - for stylus angle detection */
  tiltX?: number;
  /** Tilt Y value - for stylus angle detection */
  tiltY?: number;
  /** Twist value - for stylus rotation detection */
  twist?: number;
  /** Width of the contact area */
  width?: number;
  /** Height of the contact area */
  height?: number;
}
