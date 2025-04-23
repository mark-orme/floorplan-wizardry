
import { Canvas } from 'fabric';
import type { Point } from '@/types/core/Point';

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

export interface MeasurementData {
  distance: number;
  angle: number;
  startPoint: Point;
  endPoint: Point;
}
