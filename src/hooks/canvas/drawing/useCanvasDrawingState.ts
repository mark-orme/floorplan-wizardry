
/**
 * Hook for managing canvas drawing state
 * @module canvas/drawing/useCanvasDrawingState
 */
import { useState } from 'react';
import { DrawingState } from '@/types';
import { createPoint } from '@/types/core/Point';
import { Path as FabricPath } from 'fabric';

/**
 * Default drawing state with all required properties
 */
const DEFAULT_DRAWING_STATE: DrawingState = {
  isDrawing: false,
  zoomLevel: 1,
  lastX: 0,
  lastY: 0,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  currentPath: null,
  usePressure: false,
  stylusDetected: false,
  pathDragging: false,
  creatingShape: false,
  currentZoom: 1,
  startPoint: null,
  currentPoint: null,
  midPoint: null,
  selectionActive: false,
  points: [],
  distance: null,
  cursorPosition: null,
  snapToGrid: true,
  toolType: 'line',
  width: 2,
  color: '#000000'
};

/**
 * Hook for managing the drawing state in canvas operations
 * @returns Drawing state and setter
 */
export const useCanvasDrawingState = () => {
  const [drawingState, setDrawingState] = useState<DrawingState>(DEFAULT_DRAWING_STATE);

  return {
    drawingState,
    setDrawingState
  };
};
