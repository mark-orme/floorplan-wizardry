
export interface CanvasLayer {
  id: string;
  name: string;
  visible: boolean;
}

export interface CalculatedArea {
  areaM2: number;
}

export interface PerformanceMetrics {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
}
