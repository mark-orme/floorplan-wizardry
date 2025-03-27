
import { useCallback } from "react";
import { Canvas as FabricCanvas, Path as FabricPath } from "fabric";
import { EventHandlerResult } from "./types";

/**
 * Props for usePathEvents hook
 */
interface UsePathEventsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Function to save current state before making changes */
  saveCurrentState?: () => void;
  /** Function to process created path */
  processCreatedPath?: (path: FabricPath) => void;
  /** Function to handle mouse up */
  handleMouseUp?: (e?: MouseEvent | TouchEvent) => void;
}

/**
 * Hook for handling path events
 * @param props - Hook properties
 * @returns Event handler registration and cleanup functions
 */
export const usePathEvents = (props: UsePathEventsProps): EventHandlerResult => {
  const { 
    fabricCanvasRef, 
    saveCurrentState, 
    processCreatedPath,
    handleMouseUp
  } = props;
  
  /**
   * Register path event handlers
   */
  const register = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Save state before path creation starts
    const handlePathCreationStart = () => {
      if (saveCurrentState) {
        saveCurrentState();
      }
    };
    
    // Process path when created
    const handlePathCreated = (e: { path: FabricPath }) => {
      const { path } = e;
      
      if (processCreatedPath) {
        processCreatedPath(path);
      }
      
      // Ensure mouse up is called to reset state
      if (handleMouseUp) {
        handleMouseUp();
      }
    };
    
    // Register event handlers
    canvas.on('path:created', handlePathCreated);
    canvas.on('before:path:created', handlePathCreationStart);
    
    console.log("Registered path handlers");
  }, [fabricCanvasRef, saveCurrentState, processCreatedPath, handleMouseUp]);

  /**
   * Unregister path event handlers
   */
  const unregister = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove event handlers
    canvas.off('path:created');
    canvas.off('before:path:created');
    
    console.log("Unregistering path handlers");
  }, [fabricCanvasRef]);

  /**
   * Clean up path event handlers
   */
  const cleanup = useCallback(() => {
    // Unregister event handlers
    unregister();
    console.log("Cleaning up path handlers");
  }, [unregister]);

  return {
    register,
    unregister,
    cleanup
  };
};
