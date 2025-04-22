
/**
 * Stroke Types
 * Stroke interface and related types for floor plans
 * @module types/floor-plan/strokeTypes
 */
import { Point } from '../core/Point';

/**
 * Stroke type literals - expanded to include all types used in the codebase
 */
export type StrokeTypeLiteral = 
  | 'line' 
  | 'curve' 
  | 'wall' 
  | 'door' 
  | 'window' 
  | 'furniture' 
  | 'annotation' 
  | 'polyline' 
  | 'room' 
  | 'freehand' 
  | 'rect' 
  | 'circle';

/**
 * Stroke interface for annotations
 */
export interface Stroke {
  /** Unique identifier */
  id: string;
  
  /** Stroke points */
  points: Point[];
  
  /** Stroke type */
  type: StrokeTypeLiteral;
  
  /** Stroke color */
  color: string;
  
  /** Stroke thickness */
  thickness: number;
  
  /** Stroke width (same as thickness for compatibility) */
  width: number;
}
