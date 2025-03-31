/**
 * Hook for canvas tool actions
 * Provides functions for tool operations like zoom, clear, etc.
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingTool } from '@/types/core/DrawingTool';
import { ZOOM_CONSTRAINTS } from '@/constants/numerics';
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
  /** Line thickness (optional) */
  lineThickness?: number;
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
      Math.max(zoomLevel * factor, ZOOM_CONSTRAINTS.MIN),
      ZOOM_CONSTRAINTS.MAX
    );
    
    // Apply zoom centered on canvas center
    const centerPoint = {
      x: canvas.width! / 2,
      y: canvas.height! / 2
    };
    
    canvas.zoomToPoint(centerPoint as any, newZoom);
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
    
    canvas.setZoom(ZOOM_CONSTRAINTS.DEFAULT);
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.requestRenderAll();
    
    setZoomLevel(ZOOM_CONSTRAINTS.DEFAULT);
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
