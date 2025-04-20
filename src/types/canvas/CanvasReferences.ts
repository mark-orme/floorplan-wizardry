
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

export interface CanvasReferences {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef?: React.MutableRefObject<FabricObject[]>;
  fabricRef?: React.MutableRefObject<FabricCanvas | null>; // Required for other components
  canvas?: FabricCanvas | null; // Added for compatibility
}
