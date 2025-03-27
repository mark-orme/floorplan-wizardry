
import { useCallback, useEffect, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Point, createPoint } from "@/types/core/Point";
import { DrawingTool } from "@/constants/drawingModes";
import { UseZoomTrackingProps, UseZoomTrackingResult } from "./types";

/**
 * Hook for tracking zoom operations on the canvas
 * @param props - Hook props
 * @returns Object with zoom tracking functions
 */
export const useZoomTracking = (props: UseZoomTrackingProps): UseZoomTrackingResult => {
  const { fabricCanvasRef, updateZoomLevel, tool } = props;
  const [currentZoom, setCurrentZoom] = useState(1);

  // Register zoom tracking on the canvas
  const register = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Use the correct point creation method
    const handleZoomChange = (options: any) => {
      // Extract the point if it exists in the options
      const pointData = options.point || { x: options.x || 0, y: options.y || 0 };
      const point = createPoint(pointData.x, pointData.y);
      
      // Fire custom event with zoom information
      canvas.fire('custom:zoom-changed', { zoom: canvas.getZoom() });
      
      // Update state
      setCurrentZoom(canvas.getZoom());
      if (updateZoomLevel) {
        updateZoomLevel(canvas.getZoom());
      }
    };

    // Register correct zoom change event names
    // Use 'as any' to bypass type checking for these specific events
    // that are part of Fabric.js but not included in the type definitions
    (canvas as any).on('zoom:change', handleZoomChange);
    (canvas as any).on('viewport:scaled', handleZoomChange);
    console.log("Registered zoom tracking");
  }, [fabricCanvasRef, updateZoomLevel]);

  // Unregister zoom tracking from the canvas
  const unregister = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Use 'as any' to bypass type checking for these specific events
    (canvas as any).off('zoom:change');
    (canvas as any).off('viewport:scaled');
    console.log("Unregistered zoom tracking");
  }, [fabricCanvasRef]);

  // Clean up zoom tracking
  const cleanup = useCallback(() => {
    unregister();
    console.log("Cleaned up zoom tracking");
  }, [unregister]);

  // Register zoom tracking on mount
  useEffect(() => {
    register();
    return cleanup;
  }, [register, cleanup]);

  return {
    currentZoom,
    register,
    unregister,
    cleanup,
    // Add registerZoomTracking alias for compatibility with tests
    registerZoomTracking: register
  };
};
