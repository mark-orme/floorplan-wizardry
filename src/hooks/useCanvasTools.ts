
/**
 * Hook for canvas tool actions
 * Provides functions for tool operations like zoom, clear, etc.
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingTool } from '@/types/core/DrawingTool';

// Define defaults if constants are not available
const ZOOM_CONSTRAINTS = {
  MIN: 0.1,
  MAX: 10,
  DEFAULT: 1
};

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
      x: (canvas.width || 0) / 2,
      y: (canvas.height || 0) / 2
    };
    
    if (canvas.zoomToPoint) {
      canvas.zoomToPoint(centerPoint as any, newZoom);
      setZoomLevel(newZoom);
      
      // Refresh canvas
      canvas.requestRenderAll();
    }
    
    console.info(`Zoom level changed to ${newZoom.toFixed(2)}`);
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
      const objectType = (obj as any).objectType as string | undefined;
      return !objectType || !objectType.includes('grid');
    });
    
    // Remove non-grid objects
    if (nonGridObjects.length > 0) {
      canvas.remove(...nonGridObjects);
      canvas.requestRenderAll();
      console.info(`Cleared ${nonGridObjects.length} objects from canvas`);
    }
  }, [fabricCanvasRef]);
  
  /**
   * Reset zoom level to default
   */
  const resetZoom = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    if (canvas.setZoom) {
      canvas.setZoom(ZOOM_CONSTRAINTS.DEFAULT);
    }
    
    if (canvas.viewportTransform) {
      canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    }
    
    canvas.requestRenderAll();
    
    setZoomLevel(ZOOM_CONSTRAINTS.DEFAULT);
    console.info("Zoom reset to default");
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
