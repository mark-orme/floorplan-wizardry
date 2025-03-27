
import { useState } from 'react';
import { DrawingTool, CanvasState, DEFAULT_CANVAS_STATE } from '@/hooks/useCanvasState';

/**
 * Hook for managing canvas controller state
 * Centralizes state management for the canvas controller
 */
export const useCanvasControllerState = () => {
  // Core state
  const [tool, setTool] = useState<DrawingTool>(DEFAULT_CANVAS_STATE.tool);
  const [zoomLevel, setZoomLevel] = useState<number>(DEFAULT_CANVAS_STATE.zoomLevel);
  const [lineThickness, setLineThickness] = useState<number>(DEFAULT_CANVAS_STATE.lineThickness);
  const [lineColor, setLineColor] = useState<string>(DEFAULT_CANVAS_STATE.lineColor);
  const [gia, setGia] = useState<number>(0);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(DEFAULT_CANVAS_STATE.snapToGrid);
  const [debugInfo, setDebugInfo] = useState({
    canvasInitialized: false,
    dimensionsSet: false,
    gridCreated: false,
    eventHandlersSet: false,
    brushInitialized: false
  });
  
  return {
    // State getters
    tool,
    zoomLevel,
    lineThickness,
    lineColor,
    gia,
    snapToGrid,
    debugInfo,
    
    // State setters
    setTool,
    setZoomLevel,
    setLineThickness,
    setLineColor,
    setGia,
    setSnapToGrid,
    setDebugInfo,
  };
};
