
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { EventHandlerResult } from "./types";
import { DrawingTool } from "@/constants/drawingModes";

/**
 * Props for useObjectEvents hook
 */
interface UseObjectEventsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Function to save current state before making changes */
  saveCurrentState?: () => void;
}

/**
 * Hook for handling object events
 * @param props - Hook properties
 * @returns Event handler registration and cleanup functions
 */
export const useObjectEvents = (props: UseObjectEventsProps): EventHandlerResult => {
  const { fabricCanvasRef, tool, saveCurrentState } = props;
  
  /**
   * Register object event handlers
   */
  const register = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Save state before object modification
    const handleBeforeModify = () => {
      if (saveCurrentState) {
        saveCurrentState();
      }
    };
    
    // Process object selection
    const handleObjectSelect = (e: { target: FabricObject }) => {
      // Implementation for selection handling
      console.log("Object selected:", e.target);
    };
    
    // Process object modification
    const handleObjectModified = (e: { target: FabricObject }) => {
      // Implementation for modification handling
      console.log("Object modified:", e.target);
    };
    
    // Register event handlers
    canvas.on('before:selection:cleared', handleBeforeModify);
    canvas.on('object:selected', handleObjectSelect);
    canvas.on('object:modified', handleObjectModified);
    
    console.log("Registered object handlers");
  }, [fabricCanvasRef, tool, saveCurrentState]);

  /**
   * Unregister object event handlers
   */
  const unregister = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove event handlers
    canvas.off('before:selection:cleared');
    canvas.off('object:selected');
    canvas.off('object:modified');
    
    console.log("Unregistering object handlers");
  }, [fabricCanvasRef]);

  /**
   * Clean up object event handlers
   */
  const cleanup = useCallback(() => {
    // Unregister event handlers
    unregister();
    console.log("Cleaning up object handlers");
  }, [unregister]);

  return {
    register,
    unregister,
    cleanup
  };
};
