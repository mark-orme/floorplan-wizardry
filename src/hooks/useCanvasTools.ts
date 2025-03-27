
/**
 * Hook for canvas tool actions
 * Provides functions for tool operations like zoom, clear, etc.
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingTool } from './useCanvasState';
import { ZOOM_CONSTANTS } from '@/constants/zoomConstants';
import logger from '@/utils/logger';

/**
 * Props for useCanvasTools hook
 */
interface UseCanvasToolsProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current tool */
  tool: DrawingTool;
  /** Function to set tool */
  setTool: (tool: DrawingTool) => void;
  /** Current zoom level */
  zoomLevel: number;
  /** Function to set zoom level */
  setZoomLevel: (zoom: number) => void;
}

/**
 * Hook for canvas tool operations like zoom, clear, etc.
 * @param props The hook props
 * @returns Tool operation functions
 */
export const useCanvasTools = (props: UseCanvasToolsProps) => {
  const { fabricCanvasRef, tool, setTool, zoomLevel, setZoomLevel } = props;
  
  /**
   * Handle zoom level change
   * @param factor Zoom factor to apply
   */
  const handleZoom = useCallback((factor: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Calculate new zoom level within constraints
    const newZoom = Math.min(
      Math.max(zoomLevel * factor, ZOOM_CONSTANTS.MIN_ZOOM),
      ZOOM_CONSTANTS.MAX_ZOOM
    );
    
    // Apply zoom centered on canvas center
    const center = {
      x: canvas.width! / 2,
      y: canvas.height! / 2
    };
    
    canvas.zoomToPoint(center, newZoom);
    setZoomLevel(newZoom);
    
    // Refresh canvas
    canvas.requestRenderAll();
    
    logger.info(`Zoom level changed to ${newZoom.toFixed(2)}`);
  }, [fabricCanvasRef, zoomLevel, setZoomLevel]);
  
  /**
   * Clear the canvas of all non-grid objects
   */
  const clearCanvas = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Get all objects
    const objects = canvas.getObjects();
    
    // Filter out grid objects
    const nonGridObjects = objects.filter(obj => {
      const objectType = obj.objectType as string | undefined;
      return !objectType || !objectType.includes('grid');
    });
    
    // Remove non-grid objects
    if (nonGridObjects.length > 0) {
      canvas.remove(...nonGridObjects);
      canvas.requestRenderAll();
      logger.info(`Cleared ${nonGridObjects.length} objects from canvas`);
    }
  }, [fabricCanvasRef]);
  
  /**
   * Reset zoom level to default
   */
  const resetZoom = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.setZoom(ZOOM_CONSTANTS.DEFAULT_ZOOM);
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.requestRenderAll();
    
    setZoomLevel(ZOOM_CONSTANTS.DEFAULT_ZOOM);
    logger.info("Zoom reset to default");
  }, [fabricCanvasRef, setZoomLevel]);
  
  /**
   * Reset the entire canvas view
   */
  const resetView = useCallback(() => {
    resetZoom();
    // Don't clear objects - this just resets the view
  }, [resetZoom]);
  
  return {
    handleZoom,
    clearCanvas,
    resetZoom,
    resetView
  };
};
