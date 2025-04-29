
import { FloorPlanMetadata } from '@/types/canvas-types';
import { FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * FloorPlan interface
 */
export interface FloorPlan {
  id: string;
  name: string;
  created?: string;
  modified?: string;
  data?: any;
  thumbnail?: string;
  size?: number;
  width?: number;
  height?: number;
  index?: number;
  metadata: FloorPlanMetadata;
  objects: FabricObject[];
  canvasData?: string;
  // Additional fields for backwards compatibility
  json?: string;
  bbox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * PropertyStatus for property management
 */
export type PropertyStatus = 
  | 'draft' 
  | 'published' 
  | 'archived' 
  | 'pending' 
  | 'rejected'
  | 'available'
  | 'sold'
  | 'reserved'
  | 'under_construction';

/**
 * Drawing state interface for floor plans
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint: { x: number; y: number } | null;
  currentPoint: { x: number; y: number } | null;
  points: { x: number; y: number }[];
  distance: number;
  cursorPosition: { x: number; y: number } | null;
  // Additional fields for drawing tools
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  pathStartPoint?: { x: number; y: number } | null;
  currentPath?: any;
  zoomLevel?: number;
}

// Re-export for backward compatibility
export type { FloorPlanMetadata } from '@/types/canvas-types';

// Export DrawingMode and DrawingTool for type consistency
export type { DrawingMode } from '@/constants/drawingModes';
export type DrawingTool = DrawingMode; // Make it compatible with DrawingMode
