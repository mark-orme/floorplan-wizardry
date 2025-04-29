
import { Point } from '@/types/fabric-unified';
import { Canvas } from 'fabric';

/**
 * Measurement data for line tools
 */
export interface MeasurementData {
  distance: number;
  angle: number;
  startPoint: Point;
  endPoint: Point;
  snapped?: boolean;
  unit?: string;
  snapType?: 'grid' | 'angle' | 'both';
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

/**
 * Return type for the useStraightLineTool hook
 */
export interface UseStraightLineToolReturn {
  isActive: boolean;
  isDrawing: boolean;
  snapEnabled: boolean;
  anglesEnabled: boolean;
  measurementData?: MeasurementData;
  toggleGridSnapping: () => void;
  toggleAngles: () => void;
  handleMouseDown: (point: Point) => void;
  handleMouseMove: (point: Point) => void;
  handleMouseUp: () => void;
  cancelDrawing: () => void;
  renderTooltip?: () => React.ReactNode;
}

// Export the MeasurementData interface so it can be used by other files
export { MeasurementData };
