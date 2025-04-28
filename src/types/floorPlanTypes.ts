
import { FloorPlanMetadata } from '@/types/canvas-types';
import { FabricObject } from '@/types/fabric';

/**
 * FloorPlan interface
 */
export interface FloorPlan {
  id: string;
  metadata: FloorPlanMetadata;
  objects: FabricObject[];
  json?: string;
  bbox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Drawing state interface for floor plans
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint: { x: number; y: number };
  currentPoint: { x: number; y: number };
  points: { x: number; y: number }[];
  distance: number;
  cursorPosition: { x: number; y: number };
}

/**
 * Floor plan objects with additional metadata
 */
export interface FloorPlanObject extends FabricObject {
  id: string;
  objectType: 'wall' | 'door' | 'window' | 'room' | 'furniture' | 'text' | 'other';
  metadata?: Record<string, any>;
}
