
import { DrawingMode } from '@/constants/drawingModes';

export interface CanvasProps {
  width: number;
  height: number;
  backgroundColor?: string;
  onReady?: (canvas: any) => void;
  onError?: (error: Error) => void;
  // Add missing tool prop to fix test errors
  tool?: DrawingMode;
}
