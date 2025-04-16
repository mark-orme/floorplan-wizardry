
/**
 * Type definitions for line events
 * @module hooks/straightLineTool/lineEvents
 */
import { MeasurementData } from './types';

/**
 * Line state interface - used for typechecking hook return values
 */
export interface LineStateInterface {
  isDrawing: boolean;
  isActive: boolean;
  isToolInitialized: boolean;
  inputMethod: string;
  isPencilMode: boolean;
  snapEnabled: boolean;
  anglesEnabled: boolean;
  measurementData: MeasurementData;
  
  // Refs
  startPointRef: React.MutableRefObject<any>;
  currentLineRef: React.MutableRefObject<any>;
  distanceTooltipRef: React.MutableRefObject<any>;
  
  // Methods
  setStartPoint: (point: any) => void;
  setCurrentLine: (line: any) => void;
  setDistanceTooltip: (tooltip: any) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  resetDrawingState: () => void;
  initializeTool: () => void;
  toggleSnap: () => void;
  toggleGridSnapping: () => void;
  toggleAngles: () => void;
  createLine: (x1: number, y1: number, x2: number, y2: number) => any;
  createDistanceTooltip: (x: number, y: number, distance: number) => any;
  updateLineAndTooltip: (start: any, end: any) => void;
  snapPointToGrid: (point: any) => any;
  
  // Event handlers
  handlePointerDown: (point: any) => void;
  handlePointerMove: (point: any) => void;
  handlePointerUp: (point: any) => void;
  cancelDrawing: () => void;
  
  // Current objects
  currentLine: any | null;
}
