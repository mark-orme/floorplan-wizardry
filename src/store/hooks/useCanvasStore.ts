
/**
 * Hook for managing canvas state in the central store
 * @module store/hooks/useCanvasStore
 */
import { useCallback } from 'react';
import { useStore } from '../index';
import * as canvasActions from '../actions/canvasActions';

/**
 * Hook that provides access to canvas state and actions
 * @returns Canvas state and action dispatchers
 */
export const useCanvasStore = () => {
  const { state, dispatch } = useStore();
  const canvasState = state.canvas;

  // Tool actions
  const setTool = useCallback((tool: string) => {
    dispatch(canvasActions.setTool(tool));
  }, [dispatch]);

  const setZoomLevel = useCallback((level: number) => {
    dispatch(canvasActions.setZoomLevel(level));
  }, [dispatch]);

  const setLineThickness = useCallback((thickness: number) => {
    dispatch(canvasActions.setLineThickness(thickness));
  }, [dispatch]);

  const setLineColor = useCallback((color: string) => {
    dispatch(canvasActions.setLineColor(color));
  }, [dispatch]);

  const setSnapToGrid = useCallback((snap: boolean) => {
    dispatch(canvasActions.setSnapToGrid(snap));
  }, [dispatch]);

  // Floor plan actions
  const setFloorPlans = useCallback((floorPlans: any[]) => {
    dispatch(canvasActions.setFloorPlans(floorPlans));
  }, [dispatch]);

  const setCurrentFloor = useCallback((floorIndex: number) => {
    dispatch(canvasActions.setCurrentFloor(floorIndex));
  }, [dispatch]);

  const setGia = useCallback((gia: number) => {
    dispatch(canvasActions.setGia(gia));
  }, [dispatch]);

  // Drawing state actions
  const setDrawingState = useCallback((drawingState: any) => {
    dispatch(canvasActions.setDrawingState(drawingState));
  }, [dispatch]);

  // Status actions
  const setLoading = useCallback((isLoading: boolean) => {
    dispatch(canvasActions.setCanvasLoading(isLoading));
  }, [dispatch]);

  const setError = useCallback((hasError: boolean, message: string = '') => {
    dispatch(canvasActions.setCanvasError(hasError, message));
  }, [dispatch]);

  return {
    // State
    currentTool: canvasState.currentTool,
    zoomLevel: canvasState.zoomLevel,
    lineThickness: canvasState.lineThickness,
    lineColor: canvasState.lineColor,
    snapToGrid: canvasState.snapToGrid,
    floorPlans: canvasState.floorPlans,
    currentFloor: canvasState.currentFloor,
    gia: canvasState.gia,
    drawingState: canvasState.drawingState,
    isLoading: canvasState.isLoading,
    hasError: canvasState.hasError,
    errorMessage: canvasState.errorMessage,
    
    // Actions
    setTool,
    setZoomLevel,
    setLineThickness,
    setLineColor,
    setSnapToGrid,
    setFloorPlans,
    setCurrentFloor,
    setGia,
    setDrawingState,
    setLoading,
    setError
  };
};
