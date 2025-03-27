
/**
 * Hook for tracking and managing zoom in the canvas
 * @module canvas-events/useZoomTracking
 */
import { useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { ZOOM_CONSTANTS, ZoomDirection } from "@/constants/zoomConstants";
import { createFabricPoint } from "@/utils/grid/fabricPointConverters";
import { Point } from "@/types/drawingTypes";

/**
 * Props for useZoomTracking hook
 */
export interface UseZoomTrackingProps {
  /** Reference to the Fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Function to update zoom level */
  updateZoomLevel: (zoomLevel: number) => void;
  /** Current tool */
  tool: DrawingMode;
}

/**
 * Result of useZoomTracking hook
 */
export interface UseZoomTrackingResult {
  /** Function to handle zoom in */
  zoomIn: () => void;
  /** Function to handle zoom out */
  zoomOut: () => void;
  /** Function to reset zoom to default */
  resetZoom: () => void;
  /** Function to handle zoom by a factor */
  handleZoom: (factor: number) => void;
  /** Function to handle zoom to a specific level */
  zoomToLevel: (level: number) => void;
  /** Current zoom level */
  currentZoom: number;
}

/**
 * Constants for zoom tracking
 */
const ZOOM_TRACKING = {
  /** Maximum number of listeners to register */
  MAX_LISTENERS: 10,
  
  /** Minimum zoom change to trigger update */
  MIN_ZOOM_CHANGE: 0.0001,
  
  /** Default zoom center X-coordinate */
  DEFAULT_CENTER_X: 0.5,
  
  /** Default zoom center Y-coordinate */
  DEFAULT_CENTER_Y: 0.5
};

/**
 * Hook for tracking and managing zoom in the canvas
 * @param {UseZoomTrackingProps} props - Hook properties
 * @returns {UseZoomTrackingResult} Zoom tracking methods and state
 */
export const useZoomTracking = (
  props: UseZoomTrackingProps
): UseZoomTrackingResult => {
  const { fabricCanvasRef, updateZoomLevel, tool } = props;
  const zoomRef = useRef<number>(ZOOM_CONSTANTS.DEFAULT_ZOOM);

  // Handler to apply zoom with proper center point
  const applyZoom = useCallback((newZoom: number, center?: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Constrain zoom level within bounds
    const constrainedZoom = Math.max(
      ZOOM_CONSTANTS.MIN_ZOOM, 
      Math.min(newZoom, ZOOM_CONSTANTS.MAX_ZOOM)
    );
    
    const zoomDiff = Math.abs(constrainedZoom - zoomRef.current);
    if (zoomDiff < ZOOM_TRACKING.MIN_ZOOM_CHANGE) return;
    
    zoomRef.current = constrainedZoom;
    updateZoomLevel(constrainedZoom);
    
    // If hand tool is active, allow zooming
    if (tool === DrawingMode.Hand || center) {
      try {
        const zoomPoint = center 
          ? { x: center.x, y: center.y }
          : { 
              x: canvas.getWidth() * ZOOM_TRACKING.DEFAULT_CENTER_X, 
              y: canvas.getHeight() * ZOOM_TRACKING.DEFAULT_CENTER_Y
            };
            
        // Apply zoom factor to canvas
        canvas.zoomToPoint(zoomPoint, constrainedZoom);
        canvas.fire('zoom:updated', { zoom: constrainedZoom, center: zoomPoint });
      } catch (error) {
        console.error('Error applying zoom:', error);
      }
    } else {
      // Just update the state without changing canvas zoom
      canvas.fire('zoom:updated', { zoom: constrainedZoom });
    }
  }, [fabricCanvasRef, updateZoomLevel, tool]);

  // Zoom in handler
  const zoomIn = useCallback(() => {
    applyZoom(zoomRef.current * ZOOM_CONSTANTS.IN);
  }, [applyZoom]);

  // Zoom out handler
  const zoomOut = useCallback(() => {
    applyZoom(zoomRef.current * ZOOM_CONSTANTS.OUT);
  }, [applyZoom]);

  // Reset zoom handler
  const resetZoom = useCallback(() => {
    applyZoom(ZOOM_CONSTANTS.DEFAULT_ZOOM);
  }, [applyZoom]);

  // Handle zoom by a factor
  const handleZoom = useCallback((factor: number) => {
    applyZoom(zoomRef.current * factor);
  }, [applyZoom]);

  // Zoom to a specific level
  const zoomToLevel = useCallback((level: number) => {
    applyZoom(level);
  }, [applyZoom]);

  return {
    zoomIn,
    zoomOut,
    resetZoom,
    handleZoom,
    zoomToLevel,
    currentZoom: zoomRef.current
  };
};
