
import { useState, useCallback } from "react";

// Define ZoomOptions interface directly here
export interface ZoomOptions {
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
  step?: number;
}

interface UseZoomResult {
  currentZoom: number;
  updateZoomState: (zoom: number) => void;
}

export const useZoom = (options: ZoomOptions = {}): UseZoomResult => {
  const {
    defaultZoom = 1,
    minZoom = 0.1,
    maxZoom = 5,
    step = 0.1
  } = options;
  
  const [currentZoom, setCurrentZoom] = useState(defaultZoom);

  const updateZoomState = useCallback((zoom: number) => {
    // Ensure zoom is within bounds
    const clampedZoom = Math.min(Math.max(zoom, minZoom), maxZoom);
    setCurrentZoom(clampedZoom);
  }, [minZoom, maxZoom]);

  return {
    currentZoom,
    updateZoomState
  };
};
