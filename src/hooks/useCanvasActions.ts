/**
 * Custom hook for canvas actions (clear, save)
 * Provides high-level operations for canvas management
 * @module useCanvasActions
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { FloorPlan } from '@/types/floor-plan/unifiedTypes';
import { convertToUnifiedFloorPlans } from '@/utils/floorPlanAdapter/floorPlanTypeAdapter';
import { saveFloorPlans } from "@/utils/drawing";
import logger from "@/utils/logger";

/**
 * Props for the useCanvasActions hook
 * @interface UseCanvasActionsProps
 */
interface UseCanvasActionsProps {
  /** Reference to the Fabric.js canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  
  /** Reference to the history state for undo/redo operations */
  historyRef: React.MutableRefObject<{
    past: FabricObject[][], 
    future: FabricObject[][]
  }>;
  
  /** Function to clear all drawings from the canvas */
  clearDrawings: () => void;
  
  /** Array of floor plans */
  floorPlans: any[]; // Accept any floor plan type
  
  /** Current floor index */
  currentFloor: number;
  
  /** State setter for floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<any[]>>;
  
  /** State setter for gross internal area */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  
  /** Optional function to save the current canvas state */
  saveCurrentState?: () => void;
}

/**
 * Return value of the useCanvasActions hook
 * @interface UseCanvasActionsResult
 */
interface UseCanvasActionsResult {
  /** Function to clear the canvas */
  clearCanvas: () => void;
  
  /** Function to save the canvas as an image */
  saveCanvas: () => void;
}

/**
 * Hook for managing canvas actions like clearing and saving
 * Provides functions for canvas operations with proper state management
 * 
 * @param {UseCanvasActionsProps} props - Hook properties
 * @returns {UseCanvasActionsResult} Canvas action operations
 */
export const useCanvasActions = ({
  fabricCanvasRef,
  historyRef,
  clearDrawings,
  floorPlans,
  currentFloor,
  setFloorPlans,
  setGia,
  saveCurrentState
}: UseCanvasActionsProps): UseCanvasActionsResult => {
  /**
   * Clear all objects from the canvas
   * Saves state before clearing and handles history management
   */
  const clearCanvas = useCallback((): void => {
    if (!fabricCanvasRef.current) return;
    
    // Save current state before clearing (IMPORTANT)
    if (saveCurrentState) {
      saveCurrentState();
      logger.info("Saved state before clearing canvas");
    }
    
    clearDrawings();
    
    // Reset history but keep the cleared state
    const emptyState: FabricObject[] = [];
    historyRef.current.past = [emptyState];
    historyRef.current.future = [];
    
    // Update floor plans state
    setFloorPlans(prev => {
      const newFloorPlans = [...prev];
      if (newFloorPlans[currentFloor]) {
        newFloorPlans[currentFloor] = {
          ...newFloorPlans[currentFloor],
          strokes: []
        };
      }
      return newFloorPlans;
    });
    
    // Reset area calculation
    setGia(0);
    
    toast.success("Canvas cleared");
  }, [fabricCanvasRef, clearDrawings, historyRef, currentFloor, setFloorPlans, setGia, saveCurrentState]);

  /**
   * Save the current floor plan as an image and to storage
   * Exports the canvas as a PNG image and saves floor plan data
   */
  const saveCanvas = useCallback((): void => {
    if (!fabricCanvasRef.current) return;
    
    try {
      // Convert app floor plans to unified format for storage using the proper adapter
      const unifiedPlans = convertToUnifiedFloorPlans(floorPlans);
      
      // First save to storage
      saveFloorPlans(unifiedPlans)
        .then(() => {
          toast.success("Floor plans saved to offline storage");
          
          // Then export as image with required multiplier property
          const dataUrl = fabricCanvasRef.current!.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 1 // Added required multiplier property
          });
          
          // Create and trigger download link
          const link = document.createElement("a");
          link.download = `floorplan-${floorPlans[currentFloor]?.label || 'untitled'}.png`;
          link.href = dataUrl;
          link.click();
          
          toast.success("Floorplan image exported");
        })
        .catch(error => {
          logger.error("Save failed:", error);
          toast.error("Failed to save floor plans");
        });
    } catch (e) {
      logger.error('Save failed:', e);
      toast.error("Failed to save floorplan");
    }
  }, [fabricCanvasRef, floorPlans, currentFloor]);

  return {
    clearCanvas,
    saveCanvas
  };
};
