
/**
 * @deprecated Use useCanvasHistory instead
 * This file is kept for reference and backward compatibility
 */
import { useCallback } from "react";
import { toast } from "sonner";

interface UseDrawingHistoryProps {
  fabricCanvasRef: React.MutableRefObject<any>;
  gridLayerRef: React.MutableRefObject<any[]>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
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
