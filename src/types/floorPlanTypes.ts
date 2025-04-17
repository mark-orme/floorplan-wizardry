
import { Canvas as FabricCanvas } from 'fabric';

export interface FloorPlan {
  id: string;
  name: string;
  order: number;
  canvasState?: ReturnType<typeof import('@/utils/canvas/canvasSerializer').serializeCanvasState>;
}
