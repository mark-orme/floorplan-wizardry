
/**
 * Grid type utilities
 * Provides type definitions for grid components
 * @module grid/typeUtils
 */

// Import types from centralized location
import type { Point } from '@/types/floorPlanTypes';

/**
 * Options for grid line styling
 * @interface GridLineOptions
 */
export interface GridLineOptions {
  /** Line color */
  stroke: string;
  /** Line width */
  strokeWidth: number;
  /** Whether line can be selected */
  selectable: boolean;
  /** Whether line responds to events */
  evented: boolean;
  /** Whether to cache the object */
  objectCaching: boolean;
  /** Cursor style when hovering */
  hoverCursor: string;
  /** Line opacity */
  opacity: number;
}

/**
 * Grid point interface extending Point
 * @interface GridPoint
 */
export interface GridPoint extends Point {
  /** Optional snapped indicator */
  snapped?: boolean;
  /** Distance to nearest grid line */
  distance?: number;
  /** Original unsnapped point */
  original?: Point;
}

/**
 * Grid line interface
 * @interface GridLine
 */
export interface GridLine {
  /** Line start point */
  start: Point;
  /** Line end point */
  end: Point;
  /** Whether it's a major grid line */
  isMajor: boolean;
  /** Line orientation */
  orientation: 'horizontal' | 'vertical';
}

/**
 * Grid marker interface for text labels
 * @interface GridMarker
 */
export interface GridMarker {
  /** Position of the marker */
  position: Point;
  /** Text content */
  text: string;
  /** Whether it's a major marker */
  isMajor: boolean;
  /** Marker orientation */
  orientation: 'horizontal' | 'vertical';
}

/**
 * Grid creation context
 * @interface GridCreationContext
 */
export interface GridCreationContext {
  /** Canvas width */
  width: number;
  /** Canvas height */
  height: number;
  /** Small grid spacing */
  smallGridSpacing: number;
  /** Large grid spacing */
  largeGridSpacing: number;
  /** Extension factor for grid size */
  extensionFactor: number;
  /** Grid offset factor */
  offsetFactor: number;
}
