
import { Point, TPointerEvent } from 'fabric';

/**
 * Event data interface for Fabric.js brush events
 * Required for all brush event handlers: onMouseDown, onMouseMove, onMouseUp
 */
export interface TBrushEventData {
  /** The original pointer/mouse/touch event */
  e: TPointerEvent;
  /** The fabric Point instance representing the event coordinates */
  pointer: Point;
}

/**
 * Utility functions for fabric.js events
 */
export interface FabricEventUtils {
  /**
   * Converts a coordinate object to a fabric.Point instance
   * Must be used when passing coordinates to Fabric.js methods expecting Point
   * @param coords - Coordinate object with x and y properties
   * @returns A valid fabric.Point instance
   */
  toFabricPoint: (coords: { x: number; y: number }) => Point;
}
