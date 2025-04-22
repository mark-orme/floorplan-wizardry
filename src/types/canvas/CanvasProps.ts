
/**
 * Canvas component props interface
 */
import { DrawingMode } from '@/constants/drawingModes';
import { Canvas as FabricCanvas } from 'fabric';

export interface CanvasProps {
  width: number;
  height: number;
  backgroundColor?: string;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onCanvasError?: (error: Error) => void;
  tool?: DrawingMode;
  gridEnabled?: boolean;
  gridSize?: number;
  snapToGrid?: boolean;
  zoomEnabled?: boolean;
  panEnabled?: boolean;
  showControls?: boolean;
  readOnly?: boolean;
}
