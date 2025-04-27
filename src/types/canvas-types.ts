
import { Canvas as FabricCanvas } from 'fabric';

export interface ExtendedFabricCanvas extends FabricCanvas {
  wrapperEl: HTMLElement;
  initialize: () => void;
  skipTargetFind: boolean;
  _activeObject: any;
  _objects: any[];
}

export interface FabricEventHandler<T = any> {
  (e: { target: T }): void;
}

export interface FabricObjectEvent {
  target: any;
}

export interface FloorPlanMetadata {
  level: number;
  name: string;
  updated: string;
  created: string;
  area?: number;
  roomCount?: number;
}

export interface PerformanceMetrics {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
  renderTime: number;
}

export interface UseVirtualizedCanvasOptions {
  enabled: boolean;
  autoToggle?: boolean;
}
