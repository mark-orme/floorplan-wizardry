
/**
 * Point coordinate definition
 * @module core/Point
 */

/**
 * Represents a point in 2D space with vector operations
 * @interface Point
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  
  /** Add another point to this point (vector addition) */
  add(other: Point): Point;
  /** Add another point to this point, modifying this point */
  addEquals(other: Point): Point;
  /** Add a scalar value to both coordinates */
  scalarAdd(scalar: number): Point;
  /** Add a scalar value to both coordinates, modifying this point */
  scalarAddEquals(scalar: number): Point;
  /** Subtract another point from this point (vector subtraction) */
  subtract(other: Point): Point;
  /** Subtract another point from this point, modifying this point */
  subtractEquals(other: Point): Point;
  /** Subtract a scalar value from both coordinates */
  scalarSubtract(scalar: number): Point;
  /** Subtract a scalar value from both coordinates, modifying this point */
  scalarSubtractEquals(scalar: number): Point;
  /** Multiply this point by a scalar (vector scaling) */
  multiply(scalar: number): Point;
  /** Multiply this point by a scalar, modifying this point */
  multiplyEquals(scalar: number): Point;
  /** Divide this point by a scalar */
  divide(scalar: number): Point;
  /** Divide this point by a scalar, modifying this point */
  divideEquals(scalar: number): Point;
  /** Calculate the dot product with another point */
  dot(other: Point): number;
  /** Calculate the magnitude (length) of this point as a vector */
  magnitude(): number;
  /** Calculate the squared magnitude (avoids square root calculation) */
  magnitudeSquared(): number;
  /** Normalize this point (make it a unit vector) */
  normalize(): Point;
  /** Normalize this point, modifying this point */
  normalizeEquals(): Point;
  /** Calculate the distance to another point */
  distanceTo(other: Point): number;
  /** Calculate the squared distance to another point (avoids square root calculation) */
  distanceToSquared(other: Point): number;
  /** Create a copy of this point */
  clone(): Point;
  /** Set this point's coordinates to match another point */
  setFrom(other: Point): Point;
  /** Convert this point to a string representation */
  toString(): string;
  /** Check if this point is equal to another point */
  equals(other: Point): boolean;
  /** Linear interpolation between this point and another point */
  lerp(other: Point, t: number): Point;
  /** Linear interpolation between this point and another point, modifying this point */
  lerpEquals(other: Point, t: number): Point;
  /** Rotate this point around the origin by an angle (in radians) */
  rotate(angle: number): Point;
  /** Rotate this point around the origin by an angle, modifying this point */
  rotateEquals(angle: number): Point;
}

/**
 * Creates a new Point with the given coordinates
 * Provides a factory function for creating Points that conform to the interface
 * 
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {Point} A new Point object
 */
export function createPoint(x: number, y: number): Point {
  // Implementation with all required methods
  const point = {
    x,
    y,
    
    add(other: Point): Point {
      return createPoint(this.x + other.x, this.y + other.y);
    },
    
    addEquals(other: Point): Point {
      this.x += other.x;
      this.y += other.y;
      return this;
    },
    
    scalarAdd(scalar: number): Point {
      return createPoint(this.x + scalar, this.y + scalar);
    },
    
    scalarAddEquals(scalar: number): Point {
      this.x += scalar;
      this.y += scalar;
      return this;
    },
    
    subtract(other: Point): Point {
      return createPoint(this.x - other.x, this.y - other.y);
    },
    
    subtractEquals(other: Point): Point {
      this.x -= other.x;
      this.y -= other.y;
      return this;
    },
    
    scalarSubtract(scalar: number): Point {
      return createPoint(this.x - scalar, this.y - scalar);
    },
    
    scalarSubtractEquals(scalar: number): Point {
      this.x -= scalar;
      this.y -= scalar;
      return this;
    },
    
    multiply(scalar: number): Point {
      return createPoint(this.x * scalar, this.y * scalar);
    },
    
    multiplyEquals(scalar: number): Point {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    },
    
    divide(scalar: number): Point {
      if (scalar === 0) throw new Error("Division by zero");
      return createPoint(this.x / scalar, this.y / scalar);
    },
    
    divideEquals(scalar: number): Point {
      if (scalar === 0) throw new Error("Division by zero");
      this.x /= scalar;
      this.y /= scalar;
      return this;
    },
    
    dot(other: Point): number {
      return this.x * other.x + this.y * other.y;
    },
    
    magnitude(): number {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    
    magnitudeSquared(): number {
      return this.x * this.x + this.y * this.y;
    },
    
    normalize(): Point {
      const mag = this.magnitude();
      if (mag === 0) return createPoint(0, 0);
      return createPoint(this.x / mag, this.y / mag);
    },
    
    normalizeEquals(): Point {
      const mag = this.magnitude();
      if (mag === 0) return this;
      this.x /= mag;
      this.y /= mag;
      return this;
    },
    
    distanceTo(other: Point): number {
      return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    },
    
    distanceToSquared(other: Point): number {
      return Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2);
    },
    
    clone(): Point {
      return createPoint(this.x, this.y);
    },
    
    setFrom(other: Point): Point {
      this.x = other.x;
      this.y = other.y;
      return this;
    },
    
    toString(): string {
      return `Point(${this.x}, ${this.y})`;
    },
    
    equals(other: Point): boolean {
      return this.x === other.x && this.y === other.y;
    },
    
    lerp(other: Point, t: number): Point {
      const clampedT = Math.max(0, Math.min(1, t));
      return createPoint(
        this.x + (other.x - this.x) * clampedT,
        this.y + (other.y - this.y) * clampedT
      );
    },
    
    lerpEquals(other: Point, t: number): Point {
      const clampedT = Math.max(0, Math.min(1, t));
      this.x += (other.x - this.x) * clampedT;
      this.y += (other.y - this.y) * clampedT;
      return this;
    },
    
    rotate(angle: number): Point {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return createPoint(
        this.x * cos - this.y * sin,
        this.x * sin + this.y * cos
      );
    },
    
    rotateEquals(angle: number): Point {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const newX = this.x * cos - this.y * sin;
      const newY = this.x * sin + this.y * cos;
      this.x = newX;
      this.y = newY;
      return this;
    }
  };
  
  return point;
}

/**
 * Type for a plain point with just x and y coordinates
 * Used for compatibility with simpler point objects
 */
export interface PlainPoint {
  x: number;
  y: number;
}

/**
 * Converts a plain {x, y} object to a full Point
 * @param {PlainPoint} plainPoint - Object with x and y properties
 * @returns {Point} A full Point object with vector methods
 */
export function toPoint(plainPoint: PlainPoint): Point {
  return createPoint(plainPoint.x, plainPoint.y);
}
