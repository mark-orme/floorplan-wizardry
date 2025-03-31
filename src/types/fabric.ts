
/**
 * Type definitions for Fabric.js
 * Provides type aliases and interfaces for working with Fabric.js
 */

import { Canvas, Object, PencilBrush, Line, Point } from 'fabric';

// Canvas alias that can be used throughout the application
export type FabricCanvas = Canvas;

// Object alias that can be used throughout the application
export type FabricObject = Object;

// Brush alias that can be used throughout the application
export type FabricBrush = PencilBrush;

// Line alias that can be used throughout the application
export type FabricLine = Line;

// Point alias that can be used throughout the application
export type FabricPoint = Point;

/**
 * Custom event types for Fabric.js
 * These help with type safety when working with Fabric.js events
 */
export interface FabricObjectWithId extends FabricObject {
  id?: string;
  isGrid?: boolean;
  objectType?: string;
}

/**
 * Custom touch event interface for Fabric.js
 */
export interface CustomFabricTouchEvent {
  e: TouchEvent;
  pointer: { x: number; y: number };
  target?: FabricObject;
}

/**
 * Custom mouse event interface for Fabric.js
 */
export interface CustomFabricMouseEvent {
  e: MouseEvent | CustomFabricTouchEvent;
  pointer: { x: number; y: number };
  target?: FabricObject;
}

// Export event types for ease of use
export { Canvas, Object, PencilBrush, Line, Point };

