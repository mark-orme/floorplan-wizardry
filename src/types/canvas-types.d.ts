
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

export interface ExtendedFabricObject extends FabricObject {
  visible?: boolean;
  objectType?: string;
  gridType?: 'small' | 'large';
}

export interface ExtendedFabricCanvas extends FabricCanvas {
  wrapperEl: HTMLElement;
  upperCanvasEl?: HTMLCanvasElement;
}

export interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  objectCount: number;
  visibleObjectCount: number;
  memoryUsage?: number;
}

export interface FloorPlanMetadata {
  level: number;
  name: string;
  created: string;
  updated: string;
}

export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}
