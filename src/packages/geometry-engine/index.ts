
import { calculateDistance, calculateArea, calculateIntersection } from './calculations';
import { rotatePoint, scalePoint, translatePoint } from './transformations';
import { snapToGrid, snapToPoints, isWithinSnappingDistance } from './snapping';
import { 
  isPointInPolygon, 
  doLinesIntersect, 
  rectangleContainsPoint 
} from './collision';
import {
  generateGridPoints,
  getNearestGridPoint,
  getGridCell
} from './grid';
import { simplifyPolyline, perpendicularDistance } from './simplification';

// Re-export all functions
export {
  // Calculations
  calculateDistance,
  calculateArea,
  calculateIntersection,
  
  // Transformations
  rotatePoint,
  scalePoint,
  translatePoint,
  
  // Snapping
  snapToGrid,
  snapToPoints,
  isWithinSnappingDistance,
  
  // Collision
  isPointInPolygon,
  doLinesIntersect,
  rectangleContainsPoint,
  
  // Grid
  generateGridPoints,
  getNearestGridPoint,
  getGridCell,
  
  // Simplification
  simplifyPolyline,
  perpendicularDistance
};

// Re-export types using export type
export type { Point, Line, LineSegment, WorkerMessageData } from './types';
