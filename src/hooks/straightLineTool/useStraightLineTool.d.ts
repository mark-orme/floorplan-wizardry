
import { MeasurementData } from '@/types/fabric-unified';
import { Point } from '@/types/core/Point';

export interface UseStraightLineToolOptions {
  lineColor?: string;
  lineThickness?: number;
  snapToGrid?: boolean;
  snapToAngle?: boolean;
}

export interface UseStraightLineToolResult {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  completeDrawing: (point: Point) => void;
  cancelDrawing: () => void;
  snapEnabled: boolean;
  snapAngleEnabled: boolean;
  toggleGridSnapping: () => void;
  toggleAngleSnapping: () => void;
  setSnapEnabled: (enabled: boolean) => void;
  setSnapAngleEnabled: (enabled: boolean) => void;
  measurementData: MeasurementData | null;
}

export { MeasurementData } from '@/types/fabric-unified';
