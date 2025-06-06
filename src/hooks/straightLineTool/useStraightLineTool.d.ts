
import { Point } from '@/types/core/Point';
import { Line, Canvas } from 'fabric';
import { ReactNode } from 'react';
import { InputMethod } from './useLineInputMethod';

/**
 * Measurement data for line tools
 */
export interface MeasurementData {
  distance: number | null;
  angle: number | null;
  snapped: boolean;
  unit: string;
  snapType?: 'grid' | 'angle' | 'both';
}

/**
 * Props for the useStraightLineTool hook
 */
export interface UseStraightLineToolProps {
  isEnabled?: boolean;
  enabled?: boolean; // Alias for isEnabled for backward compatibility
  canvas: Canvas | null;
  lineColor: string;
  lineThickness: number;
  saveCurrentState?: () => void;
  shiftKeyPressed?: boolean;
  isActive?: boolean;
}

/**
 * Result type for the useStraightLineTool hook
 */
export interface UseStraightLineToolResult {
  isActive: boolean;
  isEnabled: boolean;
  currentLine: Line | null;
  isToolInitialized: boolean;
  isDrawing: boolean;
  inputMethod: InputMethod;
  isPencilMode: boolean;
  snapEnabled: boolean;
  anglesEnabled: boolean;
  measurementData: MeasurementData;
  toggleGridSnapping: () => void;
  toggleAngles: () => void;
  toggleSnap: () => void;
  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  endDrawing: () => void;
  completeDrawing: (point: Point) => void;
  cancelDrawing: () => void;
  handlePointerDown: (event: any) => void;
  handlePointerMove: (event: any) => void;
  handlePointerUp: (event: any) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleKeyUp: (event: KeyboardEvent) => void;
  renderTooltip: () => ReactNode;
  setInputMethod: (method: InputMethod) => void;
  shiftKeyPressed: boolean;
  setCurrentLine: React.Dispatch<React.SetStateAction<Line | null>>;
  saveCurrentState: () => void;
}
