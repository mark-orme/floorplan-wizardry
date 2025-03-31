
/**
 * Canvas state hook
 * Manages the core state for canvas operations
 * @module hooks/useCanvasState
 */
import { useState } from 'react';
import { BRUSH_CONSTANTS } from '@/constants/brushConstants';
import { ZOOM_CONSTANTS } from '@/constants/zoomConstants';
import { DrawingTool } from '@/types/core/DrawingTool';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Export DrawingMode from the canonical source
 * This ensures consistency across the application
 */
export { DrawingMode };
export type { DrawingTool };

/**
 * Canvas state interface
 * Defines the complete state for the canvas
 */
export interface CanvasState {
  /** Active drawing tool */
  tool: DrawingMode;
  /** Current zoom level */
  zoomLevel: number;
  /** Line thickness */
  lineThickness: number;
  /** Line color */
  lineColor: string;
  /** Whether to snap to grid */
  snapToGrid: boolean;
}

/**
 * Result interface for useCanvasState hook
 * Includes state values and setter functions
 */
export interface UseCanvasStateResult extends CanvasState {
  /** Set active drawing tool */
  setTool: (tool: DrawingMode) => void;
  /** Set zoom level */
  setZoomLevel: (zoomLevel: number) => void;
  /** Set line thickness */
  setLineThickness: (lineThickness: number) => void;
  /** Set line color */
  setLineColor: (lineColor: string) => void;
  /** Set snap to grid */
  setSnapToGrid: (snapToGrid: boolean) => void;
  /** Toggle snap to grid */
  toggleSnapToGrid: () => void;
}

/**
 * Default canvas state values
 * Initial state for the canvas
 */
export const DEFAULT_CANVAS_STATE: CanvasState = {
  tool: DrawingMode.SELECT,
  zoomLevel: ZOOM_CONSTANTS.DEFAULT_ZOOM,
  lineThickness: BRUSH_CONSTANTS.DEFAULT_PENCIL_WIDTH,
  lineColor: BRUSH_CONSTANTS.DEFAULT_PENCIL_COLOR,
  snapToGrid: true
};

/**
 * Hook for managing canvas state
 * @returns Canvas state and setter functions
 */
export function useCanvasState(): UseCanvasStateResult {
  const [state, setState] = useState<CanvasState>(DEFAULT_CANVAS_STATE);
  
  /**
   * Set active drawing tool
   * @param tool - Drawing tool to set
   */
  const setTool = (tool: DrawingMode): void => {
    setState(prev => ({ ...prev, tool }));
  };
  
  /**
   * Set zoom level
   * @param zoomLevel - Zoom level to set
   */
  const setZoomLevel = (zoomLevel: number): void => {
    setState(prev => ({ ...prev, zoomLevel }));
  };
  
  /**
   * Set line thickness
   * @param lineThickness - Line thickness to set
   */
  const setLineThickness = (lineThickness: number): void => {
    setState(prev => ({ ...prev, lineThickness }));
  };
  
  /**
   * Set line color
   * @param lineColor - Line color to set
   */
  const setLineColor = (lineColor: string): void => {
    setState(prev => ({ ...prev, lineColor }));
  };
  
  /**
   * Set snap to grid
   * @param snapToGrid - Whether to snap to grid
   */
  const setSnapToGrid = (snapToGrid: boolean): void => {
    setState(prev => ({ ...prev, snapToGrid }));
  };
  
  /**
   * Toggle snap to grid
   */
  const toggleSnapToGrid = (): void => {
    setState(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }));
  };
  
  return {
    ...state,
    setTool,
    setZoomLevel,
    setLineThickness,
    setLineColor,
    setSnapToGrid,
    toggleSnapToGrid
  };
}
