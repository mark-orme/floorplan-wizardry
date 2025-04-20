
import { Point } from '@/types/core/Point';

/**
 * Core geometry calculation interface
 */
export interface IGeometryCalculator {
  /**
   * Calculate area of a polygon
   * @param points Array of points defining the polygon
   * @returns Area in square units
   */
  calculateArea(points: Point[]): number;
  
  /**
   * Calculate perimeter of a shape
   * @param points Array of points defining the shape
   * @returns Perimeter length in units
   */
  calculatePerimeter(points: Point[]): number;
  
  /**
   * Calculate centroid (center of mass)
   * @param points Array of points defining the shape
   * @returns Centroid point
   */
  calculateCentroid(points: Point[]): Point;
}

/**
 * Geometry validation interface
 */
export interface IGeometryValidator {
  /**
   * Check if a polygon is valid
   * @param points Array of points defining the polygon
   * @returns true if valid, false otherwise
   */
  isValid(points: Point[]): boolean;
  
  /**
   * Get validation error messages if any
   * @returns Array of error messages
   */
  getErrors(): string[];
}

/**
 * Point transformation interface
 */
export interface IPointTransformer {
  /**
   * Rotate a point around an origin
   * @param point Point to rotate
   * @param origin Center of rotation
   * @param angle Angle in radians
   * @returns Rotated point
   */
  rotatePoint(point: Point, origin: Point, angle: number): Point;
  
  /**
   * Scale a point relative to an origin
   * @param point Point to scale
   * @param origin Reference point
   * @param scale Scale factor
   * @returns Scaled point
   */
  scalePoint(point: Point, origin: Point, scale: number): Point;
}

/**
 * Grid snapping interface
 */
export interface IGridSnapping {
  /**
   * Snap a point to the nearest grid intersection
   * @param point Point to snap
   * @param gridSize Grid cell size
   * @returns Snapped point
   */
  snapToGrid(point: Point, gridSize: number): Point;
  
  /**
   * Snap an angle to nearest increment
   * @param angle Angle in radians
   * @param increment Snap increment in radians
   * @returns Snapped angle
   */
  snapAngle(angle: number, increment: number): number;
}

/**
 * Main geometry engine interface combining all capabilities
 */
export interface IGeometryEngine 
  extends IGeometryCalculator, 
          IGeometryValidator, 
          IPointTransformer, 
          IGridSnapping {
  
  /**
   * Initialize the geometry engine
   * @param config Optional configuration
   */
  initialize(config?: GeometryEngineConfig): void;
  
  /**
   * Clean up resources
   */
  dispose(): void;
}

/**
 * Configuration options for geometry engine
 */
export interface GeometryEngineConfig {
  /** Grid size in pixels */
  gridSize?: number;
  
  /** Angle snap increment in radians */
  angleSnap?: number;
  
  /** Precision for floating point calculations */
  precision?: number;
}
