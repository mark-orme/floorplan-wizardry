
/**
 * Canvas-related action creators
 * @module store/actions/canvasActions
 */
import { Action } from '../index';

// Tool actions
export const setTool = (tool: string): Action => ({
  type: 'canvas/setTool',
  payload: tool
});

export const setZoomLevel = (level: number): Action => ({
  type: 'canvas/setZoom',
  payload: level
});

export const setLineThickness = (thickness: number): Action => ({
  type: 'canvas/setLineThickness',
  payload: thickness
});

export const setLineColor = (color: string): Action => ({
  type: 'canvas/setLineColor',
  payload: color
});

export const setSnapToGrid = (snap: boolean): Action => ({
  type: 'canvas/setSnapToGrid',
  payload: snap
});

// Floor plan actions
export const setFloorPlans = (floorPlans: any[]): Action => ({
  type: 'canvas/setFloorPlans',
  payload: floorPlans
});

export const setCurrentFloor = (floorIndex: number): Action => ({
  type: 'canvas/setCurrentFloor',
  payload: floorIndex
});

export const setGia = (gia: number): Action => ({
  type: 'canvas/setGia',
  payload: gia
});

// Drawing state actions
export const setDrawingState = (state: any): Action => ({
  type: 'canvas/setDrawingState',
  payload: state
});

// Status actions
export const setCanvasLoading = (isLoading: boolean): Action => ({
  type: 'canvas/setLoading',
  payload: isLoading
});

export const setCanvasError = (hasError: boolean, message: string = ''): Action => ({
  type: 'canvas/setError',
  payload: { hasError, message }
});
