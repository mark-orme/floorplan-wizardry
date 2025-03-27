
/**
 * Canvas utilities hook for common canvas operations
 * @module useCanvasUtilities
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

/**
 * Props for the useCanvasUtilities hook
 */
interface UseCanvasUtilitiesProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Hook that provides utility functions for canvas operations
 * @param props - Hook properties
 * @returns Object containing utility functions
 */
export const useCanvasUtilities = ({ fabricCanvasRef }: UseCanvasUtilitiesProps) => {
  /**
   * Find a canvas object by its ID
   * @param id - The ID of the object to find
   * @returns The found object or null if not found
   */
  const findObjectById = useCallback((id: string | number): FabricObject | null => {
    if (!fabricCanvasRef.current) return null;
    
    const objects = fabricCanvasRef.current.getObjects();
    // Use type assertion to access the id property
    return objects.find(obj => (obj as unknown as { id?: string | number }).id === id) || null;
  }, [fabricCanvasRef]);
  
  /**
   * Get the current zoom level of the canvas
   * @returns The current zoom level or 1 if canvas is not available
   */
  const getZoomLevel = useCallback((): number => {
    if (!fabricCanvasRef.current) return 1;
    return fabricCanvasRef.current.getZoom();
  }, [fabricCanvasRef]);
  
  /**
   * Set the zoom level of the canvas
   * @param zoom - The zoom level to set
   */
  const setZoomLevel = useCallback((zoom: number): void => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.setZoom(zoom);
    fabricCanvasRef.current.requestRenderAll();
  }, [fabricCanvasRef]);
  
  /**
   * Center the canvas viewport
   */
  const centerCanvas = useCallback((): void => {
    if (!fabricCanvasRef.current) return;
    
    // Get canvas dimensions
    const width = fabricCanvasRef.current.getWidth();
    const height = fabricCanvasRef.current.getHeight();
    
    // Set the viewport transform to center the canvas
    const vpt = fabricCanvasRef.current.viewportTransform;
    if (vpt) {
      vpt[4] = width / 2;
      vpt[5] = height / 2;
      fabricCanvasRef.current.requestRenderAll();
    }
  }, [fabricCanvasRef]);
  
  return {
    findObjectById,
    getZoomLevel,
    setZoomLevel,
    centerCanvas
  };
};
