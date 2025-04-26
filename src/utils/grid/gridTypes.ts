
/**
 * Grid Types
 * Type definitions for grid-related functionality
 * @module utils/grid/gridTypes
 */
import { Object as FabricObject, Line, Canvas } from 'fabric';

/**
 * Grid object interface - extends FabricObject with grid-specific properties
 */
export interface GridObject extends FabricObject {
  gridObject: true;
  gridType?: 'horizontal' | 'vertical';
  gridIndex?: number;
  gridSpacing?: number;
}

/**
 * Grid line interface - extends FabricObject with line-specific properties
 */
export interface GridLine extends Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
  gridObject: true;
  gridType?: 'horizontal' | 'vertical';
  gridIndex?: number;
  gridSpacing?: number;
}

/**
 * Grid state interface - represents the current state of the grid
 */
export interface GridState {
  lines: GridLine[];
  spacing: number;
  color: string;
  visible: boolean;
  lastUpdate: number;
}

/**
 * Grid creation options
 */
export interface GridOptions {
  spacing?: number;
  color?: string;
  opacity?: number;
  strokeWidth?: number;
  visible?: boolean;
}

/**
 * Grid manager interface - provides methods for managing a grid
 */
export interface GridManager {
  createGrid: (canvas: Canvas, options?: GridOptions) => GridLine[];
  toggleGridVisibility: (visible: boolean) => void;
  cleanupGrid: () => void;
  updateGridSpacing: (spacing: number) => void;
}

/**
 * Grid error interface
 */
export interface GridError {
  code: string;
  message: string;
  timestamp: number;
  context?: Record<string, unknown>;
}

/**
 * Type guard to check if an object is a GridLine
 */
export function isGridLine(obj: FabricObject): obj is GridLine {
  return (
    obj !== null && 
    typeof obj === 'object' && 
    'gridObject' in obj && 
    obj.gridObject === true
  );
}

/**
 * Type guard to check if an object is a GridObject
 */
export function isGridObject(obj: FabricObject): obj is GridObject {
  return (
    obj !== null && 
    typeof obj === 'object' && 
    'gridObject' in obj && 
    obj.gridObject === true
  );
}
