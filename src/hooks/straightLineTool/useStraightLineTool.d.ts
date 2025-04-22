
import { Point } from '@/types/core/Geometry';
import { Line } from 'fabric';

/**
 * Result interface for the useStraightLineTool hook
 */
export interface UseStraightLineToolResult {
  /** Whether the straight line tool is active */
  isActive: boolean;
  
  /** Whether the tool is initialized and ready to use */
  isToolInitialized: boolean;
  
  /** Whether a line is currently being drawn */
  isDrawing: boolean;
  
  /** The current line being drawn, if any */
  currentLine: Line | null;
  
  /** Start drawing a line from the given point */
  startDrawing: (point: Point) => void;
  
  /** Continue drawing the line to the given point */
  continueDrawing: (point: Point) => void;
  
  /** Complete drawing the line */
  endDrawing: (point?: Point) => void;
  
  /** Cancel the current drawing operation */
  cancelDrawing: () => void;
}

/**
 * Props for the useStraightLineTool hook
 */
export interface UseStraightLineToolProps {
  /** Whether the tool is active */
  isActive?: boolean;
  
  /** Whether the tool is enabled */
  isEnabled?: boolean;
  
  /** Canvas reference */
  canvas?: any;
  
  /** Line color */
  lineColor?: string;
  
  /** Line thickness */
  lineThickness?: number;
  
  /** Function to save current state */
  saveCurrentState?: () => void;
  
  /** Input method */
  inputMethod?: string;
  
  /** Whether pencil mode is enabled */
  isPencilMode?: boolean;
}
