
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

export interface CanvasReferences {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
}
