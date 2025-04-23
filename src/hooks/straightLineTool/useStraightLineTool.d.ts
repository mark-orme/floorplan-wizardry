
import { Point } from '@/types/core/Geometry';
import { Line } from 'fabric';
import { InputMethod } from '@/types/input/InputMethod';
import React from 'react';

/**
 * Result interface for the useStraightLineTool hook
 */
export interface UseStraightLineToolResult {
  /** Whether the straight line tool is active */
  isActive: boolean;
  
  /** Whether the tool is enabled */
  isEnabled: boolean;
  
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
  
  /** Grid snapping state and controls */
  snapEnabled: boolean;
  
  /** Toggle grid snapping */
  toggleGridSnapping: () => void;
  
  /** Angle snapping state and controls */
  anglesEnabled: boolean;
  
  /** Toggle angle snapping */
  toggleAngles: () => void;
  
  /** Toggle snap function */
  toggleSnap: () => void;
  
  /** Measurement data */
  measurementData?: any;
  
  /** Render tooltip function */
  renderTooltip?: () => React.ReactNode;
  
  /** Whether shift key is pressed */
  shiftKeyPressed: boolean;
  
  /** Set current line */
  setCurrentLine: React.Dispatch<React.SetStateAction<Line | null>>;
}

/**
 * Props for the useStraightLineTool hook
 */
export interface UseStraightLineToolProps {
  /** Whether the tool is active */
  isActive?: boolean;
  
  /** Whether the tool is enabled (new property) */
  isEnabled?: boolean;
  
  /** Whether the tool is enabled (alias for isEnabled) */
  enabled?: boolean;
  
  /** Canvas reference */
  canvas?: any;
  
  /** Line color */
  lineColor?: string;
  
  /** Line thickness */
  lineThickness?: number;
  
  /** Function to save current state */
  saveCurrentState?: () => void;
  
  /** Whether pencil mode is enabled */
  isPencilMode?: boolean;
  
  /** Whether shift key is pressed (new property for tests) */
  shiftKeyPressed?: boolean;
}
