
/**
 * Stroke definitions for floor plans
 * @module types/core/floor-plan/Stroke
 */

import { Point } from '../Point';
import { StrokeTypeLiteral } from '../../floor-plan/basicTypes';

/**
 * Stroke type enum as a string literal type for compatibility
 * We're using the imported StrokeTypeLiteral instead of defining our own
 */
export type StrokeType = StrokeTypeLiteral;

/**
 * Stroke interface for annotations
 */
export interface Stroke {
  /** Unique identifier */
  id: string;
  
  /** Stroke points */
  points: Point[];
  
  /** Stroke type */
  type: StrokeType;
  
  /** Stroke color */
  color: string;
  
  /** Stroke thickness */
  thickness: number;
  
  /** Stroke width (same as thickness for compatibility) */
  width?: number;
}
