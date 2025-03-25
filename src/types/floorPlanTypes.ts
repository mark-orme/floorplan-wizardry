
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
  id: string; // Changed from optional to required to match drawingTypes
  name: string; // Changed from optional to required to match drawingTypes
  gia: number; // Changed from optional to required to match drawingTypes
  svgData?: string;
  canvas?: string;
  timestamp?: number;
  dimensions?: CanvasDimensions;
  objects?: any[];
}
