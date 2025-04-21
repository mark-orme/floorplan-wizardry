
/**
 * Extended Canvas type definitions
 * @module types/canvas/ExtendedCanvas
 */
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Extended Canvas interface with performance monitoring properties
 */
export interface ExtendedCanvas extends FabricCanvas {
  __lastRenderTime?: number;
  __frameCount?: number;
  __performanceMetrics?: {
    fps: number;
    renderTime: number;
    objectCount: number;
    lastUpdate: number;
  };
}

/**
 * Cast a Canvas object to ExtendedCanvas
 * @param canvas Canvas to cast
 * @returns Extended Canvas
 */
export function asExtendedCanvas(canvas: FabricCanvas): ExtendedCanvas {
  return canvas as ExtendedCanvas;
}
