
/**
 * Geometry types
 * Provides consistent type definitions for geometry operations
 */

/**
 * Point type
 * Represents a 2D point with x and y coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Line type
 * Represents a line between two points
 */
export interface Line {
  start: Point;
  end: Point;
}

/**
 * Rectangle type
 * Represents a rectangle with top-left coordinates, width, and height
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Circle type
 * Represents a circle with center coordinates and radius
 */
export interface Circle {
  center: Point;
  radius: number;
}

/**
 * Polyline type
 * Represents a series of connected points
 */
export interface Polyline {
  points: Point[];
}

/**
 * Polygon type
 * Represents a closed shape consisting of points
 */
export interface Polygon {
  points: Point[];
}
