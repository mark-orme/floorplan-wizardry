
import { Point } from '@/types/core/Point';
import { Line } from 'fabric';
import { InputMethod } from './straightLineTool/useLineInputMethod';
import { ReactNode } from 'react';

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
  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  endDrawing: () => void;
  cancelDrawing: () => void;
  handlePointerDown: (event: any) => void;
  handlePointerMove: (event: any) => void;
  handlePointerUp: (event: any) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleKeyUp: (event: KeyboardEvent) => void;
  renderTooltip: () => ReactNode;
}
