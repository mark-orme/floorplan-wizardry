
/**
 * Hook for initializing the straight line tool
 * @module hooks/straightLineTool/useLineToolInitialization
 */
import { useEffect } from "react";
import { Canvas } from "fabric";

interface UseLineToolInitializationProps {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  enabled: boolean;
  isToolInitialized: boolean;
  initializeTool: () => void;
}

/**
 * Hook for initializing the straight line tool
 */
export const useLineToolInitialization = (props: UseLineToolInitializationProps) => {
  const { fabricCanvasRef, enabled, isToolInitialized, initializeTool } = props;
  
  // Initialize the tool when enabled
  useEffect(() => {
    if (enabled && !isToolInitialized) {
      initializeTool();
    }
  }, [enabled, isToolInitialized, initializeTool]);
  
  return {
    // Return initialization status if needed
    isInitialized: isToolInitialized
  };
};
