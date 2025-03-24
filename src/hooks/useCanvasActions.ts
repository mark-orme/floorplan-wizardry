
/**
 * Custom hook for canvas actions (clear, save)
 * @module useCanvasActions
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { FloorPlan, saveFloorPlans } from "@/utils/drawing";

interface UseCanvasActionsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  clearDrawings: () => void;
  floorPlans: FloorPlan[];
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Hook for managing canvas actions like clearing and saving
 * @param {UseCanvasActionsProps} props - Hook properties
 * @returns {Object} Canvas action operations
 */
export const useCanvasActions = ({
  fabricCanvasRef,
  historyRef,
  clearDrawings,
  floorPlans,
  currentFloor,
  setFloorPlans,
  setGia
}: UseCanvasActionsProps) => {
  /**
   * Clear all objects from the canvas
   */
  const clearCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    clearDrawings();
    
    // Reset history
    historyRef.current.past = [[]];
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
  }, [fabricCanvasRef, clearDrawings, historyRef, currentFloor, setFloorPlans, setGia]);

  /**
   * Save the current floor plan as an image and to storage
   */
  const saveCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    try {
      // First save to storage
      saveFloorPlans(floorPlans)
        .then(() => {
          toast.success("Floor plans saved to offline storage");
          
          // Then export as image
          const dataUrl = fabricCanvasRef.current!.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 1
          });
          
          // Create and trigger download link
          const link = document.createElement("a");
          link.download = `floorplan-${floorPlans[currentFloor]?.label || 'untitled'}.png`;
          link.href = dataUrl;
          link.click();
          
          toast.success("Floorplan image exported");
        })
        .catch(error => {
          console.error("Save failed:", error);
          toast.error("Failed to save floor plans");
        });
    } catch (e) {
      console.error('Save failed:', e);
      toast.error("Failed to save floorplan");
    }
  }, [fabricCanvasRef, floorPlans, currentFloor]);

  return {
    clearCanvas,
    saveCanvas
  };
};
