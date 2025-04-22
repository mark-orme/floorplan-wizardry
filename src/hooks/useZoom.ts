
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

export const useZoom = (): UseZoomResult => {
  const [currentZoom, setCurrentZoom] = useState(1);

  const updateZoomState = useCallback((zoom: number) => {
    setCurrentZoom(zoom);
  }, []);

  return {
    currentZoom,
    updateZoomState
  };
};
