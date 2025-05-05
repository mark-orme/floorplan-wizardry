
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
  completeDrawing: (point?: Point) => void;
  cancelDrawing: () => void;
  snapEnabled: boolean;
  snapAngleEnabled: boolean;
  toggleGridSnapping: () => void;
  toggleAngleSnapping: () => void;
  setSnapEnabled: (enabled: boolean) => void;
  setSnapAngleEnabled: (enabled: boolean) => void;
  measurementData: MeasurementData | null;
  
  // Add missing properties that were causing errors
  anglesEnabled: boolean;
  toggleAngles: () => void;
  renderTooltip: () => React.ReactNode | null;
  handleMouseDown?: (point: Point) => void;
  handleMouseMove?: (point: Point) => void;
  handleMouseUp?: (point?: Point) => void;
  isActive?: boolean;
}

export { MeasurementData } from '@/types/fabric-unified';
