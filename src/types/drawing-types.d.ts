
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

// Drawing state for canvas
export interface DrawingState {
  isDrawing: boolean;
  startPoint: { x: number; y: number };
  currentPoint: { x: number; y: number };
  points: Array<{ x: number; y: number }>;
  distance: number;
  cursorPosition: { x: number; y: number };
  currentZoom?: number;
}

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

// Add gesture types
export type GestureType = 'pinch' | 'rotate' | 'pan';
export type GestureState = 'start' | 'move' | 'end';
export interface GestureStateObject {
  type: GestureType;
  state: GestureState;
  scale?: number;
  rotation?: number;
  translation?: { x: number; y: number };
  startPoints: Array<{ x: number; y: number }>; // Added property - required for builds
}

// Add function to create default drawing state
export function createDefaultDrawingState(): DrawingState {
  return { 
    isDrawing: false, 
    startPoint: {x:0,y:0}, 
    currentPoint: {x:0,y:0}, 
    points: [], 
    distance:0, 
    cursorPosition:{x:0,y:0} 
  };
}

// Canvas state result type with all required fields
export interface UseCanvasStateResult {
  canvas: any;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<any>;
  initializeCanvas: () => void;
  disposeCanvas: () => void;
  isInitialized: boolean;
}
