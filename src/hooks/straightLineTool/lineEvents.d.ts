
/**
 * Type definitions for line events
 * @module hooks/straightLineTool/lineEvents
 */
import { MeasurementData } from './types';
import { Point } from '@/types/core/Point';
import { Canvas, Line, Text } from 'fabric';

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
  startPointRef: React.MutableRefObject<Point | null>;
  currentLineRef: React.MutableRefObject<Line | null>;
  distanceTooltipRef: React.MutableRefObject<Text | null>;
  
  // Methods
  setStartPoint: (point: Point) => void;
  setCurrentLine: (line: Line) => void;
  setDistanceTooltip: (tooltip: Text) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  resetDrawingState: () => void;
  initializeTool: () => void;
  toggleSnap: () => void;
  toggleGridSnapping: () => void;
  toggleAngles: () => void;
  createLine: (x1: number, y1: number, x2: number, y2: number) => Line;
  createDistanceTooltip: (x: number, y: number, distance: number) => Text;
  updateLineAndTooltip: (start: Point, end: Point) => void;
  snapPointToGrid: (point: Point) => Point;
  
  // Event handlers
  handlePointerDown: (point: Point) => void;
  handlePointerMove: (point: Point) => void;
  handlePointerUp: (point: Point) => void;
  cancelDrawing: () => void;
  
  // Current objects
  currentLine: Line | null;
}
