
/**
 * @deprecated Use useCanvasHistory instead
 * This file is kept for reference and backward compatibility
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

interface UseDrawingHistoryProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  historyRef: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  clearDrawings: () => void;
  recalculateGIA: () => void;
}

/**
 * @deprecated Use useCanvasHistory instead
 */
export const useDrawingHistory = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  clearDrawings,
  recalculateGIA
}: UseDrawingHistoryProps) => {
  
  /**
   * @deprecated Use useCanvasHistory instead
   */
  const handleUndo = useCallback(() => {
    toast.info("Using deprecated history management. Please refresh the page to use the improved version.");
    console.warn("useDrawingHistory is deprecated, please use useCanvasHistory instead");
  }, []);
  
  /**
   * @deprecated Use useCanvasHistory instead
   */
  const handleRedo = useCallback(() => {
    toast.info("Using deprecated history management. Please refresh the page to use the improved version.");
    console.warn("useDrawingHistory is deprecated, please use useCanvasHistory instead");
  }, []);
  
  return {
    handleUndo,
    handleRedo
  };
};
