
import { MutableRefObject } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/canvas-types';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';

export interface BaseEventProps {
  fabricCanvasRef: MutableRefObject<ExtendedFabricCanvas | null>;
  tool: DrawingMode;
  saveCurrentState?: () => void;
}

export interface EventHandlerResult {
  register: () => void;
  unregister: () => void;
  cleanup: () => void;
}

export interface UsePathEventsProps extends BaseEventProps {
  processCreatedPath?: (path: FabricObject) => void;
  handleMouseUp?: () => void;
}

export interface UseKeyboardEventsProps extends BaseEventProps {
  deleteSelectedObjects?: () => void;
  undo?: () => void;
  redo?: () => void;
}

export interface UseMouseEventsProps extends BaseEventProps {
  lineColor: string;
  lineThickness: number;
  isSnapping?: boolean;
  gridSize?: number;
  snapToGrid?: (point: Point) => Point;
}

export interface DrawingPathState {
  isDrawing: boolean;
  currentPath: FabricObject | null;
}
