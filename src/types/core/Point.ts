
/**
 * Point interface representing x,y coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Point with optional z coordinate
 */
export interface Point3D extends Point {
  z?: number;
}
