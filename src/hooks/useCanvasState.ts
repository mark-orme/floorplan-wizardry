
/**
 * Canvas state hook
 * Manages the core state for canvas operations
 * @module hooks/useCanvasState
 */
import { useState } from 'react';
import { BRUSH_CONSTANTS } from '@/constants/brushConstants';
import { ZOOM_CONSTANTS } from '@/constants/zoomConstants';
import { DrawingTool } from '@/constants/drawingModes';

// Export DrawingTool for backward compatibility
export type { DrawingTool };

/**
 * Canvas state interface
 */
export interface CanvasState {
  /** Active drawing tool */
  tool: DrawingTool;
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
 * Default canvas state values
 */
export const DEFAULT_CANVAS_STATE: CanvasState = {
  tool: 'select' as DrawingTool,
  zoomLevel: ZOOM_CONSTANTS.DEFAULT_ZOOM,
  lineThickness: BRUSH_CONSTANTS.DEFAULT_PENCIL_WIDTH,
  lineColor: BRUSH_CONSTANTS.DEFAULT_PENCIL_COLOR,
  snapToGrid: true
};

/**
 * Hook for managing canvas state
 * @returns Canvas state and setter functions
 */
export const useCanvasState = () => {
  const [state, setState] = useState<CanvasState>(DEFAULT_CANVAS_STATE);
  
  /**
   * Set active drawing tool
   * @param tool - Drawing tool to set
   */
  const setTool = (tool: DrawingTool) => {
    setState(prev => ({ ...prev, tool }));
  };
  
  /**
   * Set zoom level
   * @param zoomLevel - Zoom level to set
   */
  const setZoomLevel = (zoomLevel: number) => {
    setState(prev => ({ ...prev, zoomLevel }));
  };
  
  /**
   * Set line thickness
   * @param lineThickness - Line thickness to set
   */
  const setLineThickness = (lineThickness: number) => {
    setState(prev => ({ ...prev, lineThickness }));
  };
  
  /**
   * Set line color
   * @param lineColor - Line color to set
   */
  const setLineColor = (lineColor: string) => {
    setState(prev => ({ ...prev, lineColor }));
  };
  
  /**
   * Set snap to grid
   * @param snapToGrid - Whether to snap to grid
   */
  const setSnapToGrid = (snapToGrid: boolean) => {
    setState(prev => ({ ...prev, snapToGrid }));
  };
  
  return {
    ...state,
    setTool,
    setZoomLevel,
    setLineThickness,
    setLineColor,
    setSnapToGrid
  };
};
