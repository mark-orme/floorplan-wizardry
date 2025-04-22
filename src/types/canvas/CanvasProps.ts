
import { DrawingMode } from '@/constants/drawingModes';
import { Canvas as FabricCanvas } from 'fabric';

export interface CanvasProps {
  width: number;
  height: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onCanvasError?: (error: Error) => void;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  showGrid?: boolean;
  gridSize?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  showRulers?: boolean;
  backgroundColor?: string;
  initialZoom?: number;
  readOnly?: boolean;
}
