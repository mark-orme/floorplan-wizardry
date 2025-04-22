
/**
 * Canvas rendering type definitions
 * @module types/canvas/canvasRendering
 */

export interface CanvasRenderingOptions {
  renderer?: 'canvas' | 'webgl';
  enableRetinaScaling?: boolean;
  enableSimplification?: boolean;
  renderOnAddRemove?: boolean;
  skipOffscreen?: boolean;
  imageSmoothingEnabled?: boolean;
  maxCurveSegments?: number;
}

export interface CanvasExportOptions {
  format: 'svg' | 'png' | 'jpeg' | 'webp' | 'pdf';
  quality?: number;
  width?: number;
  height?: number;
  multiplier?: number;
  left?: number;
  top?: number;
  enableRetinaScaling?: boolean;
  withoutShadow?: boolean;
  withoutTransform?: boolean;
  viewBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface CanvasPerformanceMetrics {
  renderTime: number;
  objectCount: number;
  lastFrameTime: number;
  fps: number;
  memoryUsage?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
}

export interface RenderingStatistics {
  objectsRendered: number;
  totalObjects: number;
  culledObjects: number;
  renderingTime: number;
  fps: number;
}
