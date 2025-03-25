
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Basic 2D point interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Canvas dimensions interface
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Grid size constant
 */
export const GRID_SIZE = 20;

/**
 * Floor plan interface compatible with both utils/drawingTypes.ts and types/drawingTypes.ts
 */
export interface FloorPlan {
  id: string;
  name: string;
  svgData?: string;
  gia: number;
  canvas?: string;
  timestamp?: number;
  dimensions?: CanvasDimensions;
  objects?: any[];
  // Add any other properties that might be needed
}

/**
 * Grid creation state interface
 */
export interface GridCreationState {
  creationInProgress: boolean;
  consecutiveResets: number;
  maxConsecutiveResets: number;
  lastAttemptTime: number;
  creationLock: boolean;
  safetyTimeout: number | null;
  lastCreationTime: number;
  lastDimensions: CanvasDimensions | null;
  exists: boolean;
  throttleInterval: number;
  totalCreations: number;
  maxRecreations: number;
  minRecreationInterval: number;
}

/**
 * Type definition for FabricCanvas to match Canvas from fabric
 */
export type FabricCanvas = Canvas;

// Re-export the GRID_SIZE to ensure it's available
export { GRID_SIZE as GRID_CELL_SIZE };
