
import { useState, useCallback } from "react";
import { ZoomOptions } from "@/types";

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
