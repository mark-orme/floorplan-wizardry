
import { useCallback, useEffect, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Point, createPoint } from "@/types/geometryTypes";
import { UseZoomTrackingProps, UseZoomTrackingResult } from "./types";

/**
 * Hook for tracking zoom operations on the canvas
 * @param props - Hook props
 * @returns Object with zoom tracking functions
 */
export const useZoomTracking = (props: UseZoomTrackingProps): UseZoomTrackingResult => {
  const { fabricCanvasRef, updateZoomLevel } = props;
  const [currentZoom, setCurrentZoom] = useState(1);

  // Register zoom tracking on the canvas
  const register = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Use the correct point creation method
    const handleZoomChange = (options: any) => {
      const point = createPoint(options.x || 0, options.y || 0);
      canvas.fire('custom:zoom-changed', { point, zoom: canvas.getZoom() });
      setCurrentZoom(canvas.getZoom());
      if (updateZoomLevel) {
        updateZoomLevel(canvas.getZoom());
      }
    };

    // Register zoom change event
    canvas.on('zoom:updated', handleZoomChange);
    console.log("Registered zoom tracking");
  }, [fabricCanvasRef, updateZoomLevel]);

  // Unregister zoom tracking from the canvas
  const unregister = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.off('zoom:updated');
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
    cleanup
  };
};
