
/**
 * Unified floor plan types to resolve conflicts between utility and type definitions
 * @module floorPlanTypes
 */

import { Point, CanvasDimensions } from './drawingTypes';

/**
 * Paper size options for floor plans
 */
export type PaperSize = 'A4' | 'A3' | 'infinite';

/**
 * Unified FloorPlan interface that satisfies both type systems
 */
export interface FloorPlan {
  // Required by utils/drawingTypes.ts
  strokes: Point[][];
  label: string;
  paperSize?: PaperSize;
  
  // Required by types/drawingTypes.ts
  id: string;
  name: string;
  gia: number;
  svgData?: string;
  canvas?: string;
  timestamp?: number;
  dimensions?: CanvasDimensions;
  objects?: any[];
}
