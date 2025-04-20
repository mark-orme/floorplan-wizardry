
import type { DrawingMode as EnumDrawingMode } from '@/constants/drawingModes';

// Re-export the DrawingMode enum to make it available as a type
export type DrawingMode = EnumDrawingMode;

// Define DrawingTool type for tools manager
export interface DrawingTool {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  mode: DrawingMode;
  shortcut?: string;
  tooltip?: string;
  color?: string;
  active?: boolean;
}

// Canvas state with drawing mode and options
export interface CanvasState {
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  zoomLevel: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showRulers: boolean;
  showMeasurements: boolean;
}

// Zoom direction type
export type ZoomDirection = 'in' | 'out';

// Tool change event
export interface ToolChangeEvent {
  previousTool: DrawingMode;
  newTool: DrawingMode;
  timestamp: number;
}

// Canvas object types
export type CanvasObjectType = 
  | 'wall' 
  | 'room' 
  | 'door' 
  | 'window' 
  | 'text' 
  | 'image' 
  | 'line'
  | 'rectangle'
  | 'circle'
  | 'polygon'
  | 'path'
  | 'dimension'
  | 'group'
  | 'other';

// Ensure both types are compatible
export type ValidateDrawingMode<T extends DrawingMode> = T;
