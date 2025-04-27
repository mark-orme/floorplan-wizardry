
import { fabric } from 'fabric';

export interface ExtendedFabricCanvas extends fabric.Canvas {
  skipOffscreen?: boolean;
}

export interface PerformanceMetrics {
  fps?: number;
  objectCount?: number;
  visibleObjectCount?: number;
  renderTime?: number;
  updateTime?: number;
  lastFrameTime?: number;
}
