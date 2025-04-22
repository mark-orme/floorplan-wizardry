
/**
 * Canvas event type definitions
 * @module types/canvas/canvasEvents
 */

import { Point } from '../core/Point';

export interface CanvasEventHandler {
  (event: any): void;
}

export interface CanvasPointerEvent {
  e: MouseEvent | TouchEvent;
  pointer: Point;
  target?: any;
}

export interface CanvasObjectEvent {
  e: MouseEvent | TouchEvent;
  target: any;
}

export interface CanvasSelectionEvent {
  e: MouseEvent | TouchEvent;
  selected: any[];
  deselected?: any[];
}

export interface CanvasOptions {
  isDrawingMode?: boolean;
  selection?: boolean;
  selectionFullyContained?: boolean;
  hoverCursor?: string;
  moveCursor?: string;
  defaultCursor?: string;
  freeDrawingCursor?: string;
  notAllowedCursor?: string;
  containerClass?: string;
  enableRetinaScaling?: boolean;
  renderOnAddRemove?: boolean;
  controlsAboveOverlay?: boolean;
  allowTouchScrolling?: boolean;
  fireRightClick?: boolean;
  stopContextMenu?: boolean;
  backgroundColor?: string;
  backgroundImage?: any;
  backgroundVpt?: boolean;
  overlayColor?: string;
  overlayImage?: any;
  overlayVpt?: boolean;
  skipOffscreen?: boolean;
  clipPath?: any;
  pixelRatio?: number;
  onBeforeScaleRotate?: any;
  uniformScaling?: boolean;
  uniScaleKey?: string;
  centeredScaling?: boolean;
  centeredRotation?: boolean;
  targetFindDuration?: number;
  targetFindLimit?: number;
  selectionBorderColor?: string;
  selectionLineWidth?: number;
  selectionDashArray?: number[];
  selectionFullyContainedFullyConatined?: boolean;
  preserveObjectStacking?: boolean;
  interactive?: boolean;
  includeDefaultValues?: boolean;
  svgViewportTransformation?: boolean;
  viewportTransform?: number[];
  snapAngle?: number;
  snapThreshold?: number;
  stateful?: boolean;
  imageSmoothingEnabled?: boolean;
  perPixelTargetFind?: boolean;
  altSelectionKey?: string;
  minimumScale?: number;
  maximumScale?: number;
}
