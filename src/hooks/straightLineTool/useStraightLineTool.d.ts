
import { Point, MeasurementData } from '@/types/fabric-unified';
import { Canvas } from 'fabric';

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

// Re-export the MeasurementData interface for backward compatibility
export { MeasurementData };
