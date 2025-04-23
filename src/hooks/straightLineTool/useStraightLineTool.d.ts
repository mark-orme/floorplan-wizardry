
import { Point } from '@/types/core/Point';
import { Canvas } from 'fabric';

/**
 * Measurement data for line tools
 */
export interface MeasurementData {
  distance: number;
  angle: number;
  startPoint: Point;
  endPoint: Point;
}

/**
 * Props for the useStraightLineTool hook
 */
export interface UseStraightLineToolProps {
  isActive?: boolean;
  isEnabled?: boolean;
  canvas?: Canvas;
  shiftKeyPressed?: boolean;
  lineColor?: string;
  lineThickness?: number;
  snapToGrid?: boolean;
  saveCurrentState?: () => void;
  anglesEnabled?: boolean;
}
