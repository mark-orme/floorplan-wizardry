
/**
 * Stroke Types
 * Stroke interface and related types for floor plans
 * @module types/floor-plan/strokeTypes
 */
// Update the StrokeTypeLiteral definition to include missing types
export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation' | 'polyline' | 'room' | 'freehand';
import { Point } from '../floorPlanTypes';

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
