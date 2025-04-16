
import { useCallback, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Point } from "@/types/core/Point";

interface UseGridSnappingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  initialSnapEnabled?: boolean;
  gridSize?: number;
}

export const useGridSnapping = ({
  fabricCanvasRef,
  initialSnapEnabled = true,
  gridSize = 20
}: UseGridSnappingProps) => {
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);

  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) {
      return point;
    }

    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapEnabled, gridSize]);

  return {
    snapEnabled,
    toggleSnap,
    snapPointToGrid,
    gridSize
  };
};
