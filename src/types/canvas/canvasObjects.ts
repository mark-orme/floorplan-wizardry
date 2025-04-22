
/**
 * Canvas objects type definitions
 * @module types/canvas/canvasObjects
 */

import { Point } from '../core/Point';

export interface CanvasObject {
  id?: string;
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  angle?: number;
  scaleX?: number;
  scaleY?: number;
  flipX?: boolean;
  flipY?: boolean;
  selectable?: boolean;
  evented?: boolean;
  visible?: boolean;
  hasControls?: boolean;
  hasBorders?: boolean;
  hasRotatingPoint?: boolean;
  transparentCorners?: boolean;
  perPixelTargetFind?: boolean;
  shadow?: any;
  metadata?: Record<string, any>;
}

export interface PathObject extends CanvasObject {
  path: any[];
}

export interface LineObject extends CanvasObject {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface CircleObject extends CanvasObject {
  radius: number;
}

export interface RectObject extends CanvasObject {
  rx?: number;
  ry?: number;
}

export interface TextObject extends CanvasObject {
  text: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  underline?: boolean;
  overline?: boolean;
  linethrough?: boolean;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  textBackgroundColor?: string;
}

export interface ImageObject extends CanvasObject {
  src: string;
  crossOrigin?: string;
  filters?: any[];
}

export interface GroupObject extends CanvasObject {
  objects: CanvasObject[];
}

export interface PolygonObject extends CanvasObject {
  points: Point[];
}

export interface PolylineObject extends CanvasObject {
  points: Point[];
}

export interface DrawOptions {
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  opacity?: number;
  selectable?: boolean;
  evented?: boolean;
  metadata?: Record<string, any>;
}

export interface StrokeStyle {
  color: string;
  width: number;
  dashArray?: number[];
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'miter' | 'round' | 'bevel';
}
