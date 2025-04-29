// Import the updated CanvasState type that includes zoomLevel
import { CanvasState } from '@/types/canvas-types';
import { useState, useCallback } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/canvas-types';

export interface UseCanvasControllerStateProps {
  initialState?: Partial<CanvasState>;
}

export const useCanvasControllerState = ({ initialState = {} }: UseCanvasControllerStateProps = {}) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    objects: [],
    background: '#ffffff',
    width: 800,
    height: 600,
    zoom: 1,
    zoomLevel: 1,
    viewportTransform: [1, 0, 0, 1, 0, 0],
    tool: 'select',
    gridVisible: true,
    snapToGrid: true,
    gridSize: 20,
    ...initialState
  });

  const updateCanvasState = useCallback((updates: Partial<CanvasState>) => {
    setCanvasState(prevState => ({
      ...prevState,
      ...updates
    }));
  }, []);

  const syncCanvasToState = useCallback((canvas: Canvas | ExtendedFabricCanvas | null) => {
    if (!canvas) return;

    // Update canvas properties based on state
    if (canvasState.background) {
      canvas.backgroundColor = canvasState.background;
    }

    if (canvasState.width && canvasState.height) {
      canvas.setWidth(canvasState.width);
      canvas.setHeight(canvasState.height);
    }

    if (canvasState.viewportTransform && canvas.viewportTransform) {
      canvas.viewportTransform = canvasState.viewportTransform;
    }

    if (canvasState.zoom) {
      const center = { x: canvas.getWidth() / 2, y: canvas.getHeight() / 2 };
      if (canvas.zoomToPoint) {
        canvas.zoomToPoint(center, canvasState.zoom);
      }
    }

    canvas.renderAll();
  }, [canvasState]);

  const syncStateToCanvas = useCallback((canvas: Canvas | ExtendedFabricCanvas | null) => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    const viewportTransform = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
    const zoom = canvas.getZoom ? canvas.getZoom() : 1;

    updateCanvasState({
      objects,
      viewportTransform,
      zoom,
      zoomLevel: zoom,
      width: canvas.getWidth(),
      height: canvas.getHeight(),
      background: canvas.backgroundColor as string
    });
  }, [updateCanvasState]);

  const resetCanvasState = useCallback(() => {
    setCanvasState({
      objects: [],
      background: '#ffffff',
      width: 800,
      height: 600,
      zoom: 1,
      zoomLevel: 1,
      viewportTransform: [1, 0, 0, 1, 0, 0],
      tool: 'select',
      gridVisible: true,
      snapToGrid: true,
      gridSize: 20
    });
  }, []);

  return {
    canvasState,
    updateCanvasState,
    syncCanvasToState,
    syncStateToCanvas,
    resetCanvasState
  };
};
