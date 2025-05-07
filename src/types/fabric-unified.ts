
/**
 * Unified type definitions for Fabric.js
 */
import { Canvas, Object as FabricObject, Point, Circle, Rect, Line } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/canvas-types';
import { Point as CorePoint } from '@/types/core/Point';

// Re-export types
export {
  Canvas,
  FabricObject,
  Point,
  Circle,
  Rect,
  Line
};

// Type definitions for common Fabric shapes
export interface FabricPoint {
  x: number;
  y: number;
}

export interface FabricCoord {
  left: number;
  top: number;
}

export interface FabricDimension {
  width: number;
  height: number;
}

export interface FabricObjectOptions {
  id?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  angle?: number;
  selectable?: boolean;
  evented?: boolean;
  visible?: boolean;
  hasControls?: boolean;
  hasBorders?: boolean;
  lockMovementX?: boolean;
  lockMovementY?: boolean;
  objectCaching?: boolean;
}

// Extended canvas interface
export interface ExtendedCanvas extends Canvas {
  isDrawingMode: boolean; 
  selection: boolean;
  defaultCursor: string;
  hoverCursor: string;
  freeDrawingBrush: {
    color: string;
    width: number;
  };
  wrapperEl: HTMLElement; // Changed from HTMLDivElement to be more generic
  viewportTransform: number[] | undefined; // Allow undefined to match Canvas type
  renderOnAddRemove: boolean;
  skipTargetFind: boolean;
  allowTouchScrolling: boolean;
}

// Debug info state for useCanvasDebug
export interface DebugInfoState {
  objectCount?: number;
  visibleObjects?: number;
  fps?: number;
  renderTime?: number;
  gridStatus?: 'enabled' | 'disabled';
  version?: string;
}

// GRID constants
export const GRID_CONSTANTS = {
  SMALL_GRID: 10,
  LARGE_GRID: 50,
  GRID_COLOR: '#e0e0e0',
  LARGE_GRID_COLOR: '#c0c0c0',
  PIXELS_PER_METER: 100,
  SMALL_GRID_COLOR: '#f0f0f0',
  SMALL_GRID_WIDTH: 0.5,
  SMALL_GRID_SIZE: 10
};

// Helper functions
export function toFabricPoint(point: FabricPoint): Point {
  return new Point(point.x, point.y);
}

export function fromFabricPoint(point: Point): FabricPoint {
  return { x: point.x, y: point.y };
}

export function isFabricObject(obj: any): obj is FabricObject {
  return obj && obj.type !== undefined && typeof obj.toObject === 'function';
}

export function safeAddToCanvas(canvas: Canvas | null, obj: FabricObject | null): boolean {
  if (!canvas || !obj) return false;
  
  try {
    canvas.add(obj);
    if (canvas.renderAll) {
      canvas.renderAll();
    } else if (canvas.requestRenderAll) {
      canvas.requestRenderAll();
    }
    return true;
  } catch (error) {
    console.error('Error adding object to canvas:', error);
    return false;
  }
}

export function safeDisposeCanvas(canvas: Canvas | null): void {
  if (!canvas) return;
  
  try {
    canvas.dispose();
  } catch (error) {
    console.error('Error disposing canvas:', error);
  }
}

// Export FloorPlan type for compatibility
export interface FloorPlan {
  id: string;
  name: string;
  created?: string;
  updated?: string;
  data?: any;
  thumbnail?: string;
  label?: string;
  width?: number;
  height?: number;
}

// Export MeasurementData type for compatibility
export interface MeasurementData {
  // Allow both number and null for distance
  distance: number | null;
  angle?: number | null;
  units?: string;
  unit?: string; // For backward compatibility
  startPoint?: CorePoint | null;
  endPoint?: CorePoint | null;
  start?: CorePoint | null;
  end?: CorePoint | null;
  midPoint?: CorePoint | null;
  snapped?: boolean;
  snapType?: 'grid' | 'angle' | 'both';
  pixelsPerMeter?: number;
}

