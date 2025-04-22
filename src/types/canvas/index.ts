
/**
 * Canvas types index
 * @module types/canvas
 */

import { Point as FabricPoint } from 'fabric';
import { Point } from '@/types/core';

export interface DrawOptions {
  color?: string;
  width?: number;
  opacity?: number;
  strokeLineCap?: 'butt' | 'round' | 'square';
  strokeLineJoin?: 'bevel' | 'round' | 'miter';
}

export interface CanvasObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
}

export interface StrokeStyle {
  color: string;
  width: number;
  opacity?: number;
}

// Re-export Point from core
export { Point };

// Adapter function to convert between Fabric Point and our Point type
export function fromFabricPoint(point: FabricPoint): Point {
  return { x: point.x, y: point.y };
}

export function toFabricPoint(point: Point): FabricPoint {
  return new FabricPoint(point.x, point.y);
}
