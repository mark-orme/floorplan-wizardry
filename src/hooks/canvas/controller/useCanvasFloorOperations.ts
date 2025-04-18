
/**
 * Hook for managing floor operations
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { FloorPlan } from "@/types/floorPlanTypes";
import { serializeCanvasState, deserializeCanvasState } from "@/utils/canvas/canvasSerializer";
import * as Sentry from '@sentry/react';

interface UseCanvasFloorOperationsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  floorPlans: FloorPlan[];
  currentFloor: number;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
}

export const useCanvasFloorOperations = ({
  fabricCanvasRef,
  floorPlans,
  currentFloor,
  historyRef,
  setFloorPlans
}: UseCanvasFloorOperationsProps) => {
  const handleFloorSelect = useCallback((index: number) => {
    if (index >= 0 && index < floorPlans.length && index !== currentFloor) {
      Sentry.addBreadcrumb({
        category: 'floorplan',
        message: `Changed to floor ${index + 1} (${floorPlans[index]?.name})`,
        level: 'info',
        data: {
          previousFloor: currentFloor,
          newFloor: index,
          floorName: floorPlans[index]?.name
        }
      });

      if (fabricCanvasRef.current && floorPlans[currentFloor]) {
        const updatedFloorPlans = [...floorPlans];
        
        // Save current canvas state to floor plan
        const canvasState = serializeCanvasState(fabricCanvasRef.current);
        updatedFloorPlans[currentFloor] = {
          ...updatedFloorPlans[currentFloor],
          canvasState
        };
        
        setFloorPlans(updatedFloorPlans);
        
        // Clear history when switching floors
        historyRef.current = { past: [], future: [] };
        
        // Load the selected floor's canvas state
        if (floorPlans[index]?.canvasState) {
          const loadSuccess = deserializeCanvasState(fabricCanvasRef.current, floorPlans[index].canvasState);
          if (loadSuccess) {
            toast.success(`Loaded floor ${index + 1}`);
          } else {
            toast.error(`Failed to load floor ${index + 1}`);
          }
        } else {
          fabricCanvasRef.current.clear();
          fabricCanvasRef.current.renderAll();
        }
      }
    }
  }, [fabricCanvasRef, floorPlans, currentFloor, historyRef, setFloorPlans]);

  const handleAddFloor = useCallback(() => {
    const newFloorPlan = {
      id: `floor-${floorPlans.length + 1}`,
      name: `Floor ${floorPlans.length + 1}`,
      order: floorPlans.length,
      canvasState: null
    };
    
    setFloorPlans(prev => [...prev, newFloorPlan]);
    toast.success(`Added new floor: ${newFloorPlan.name}`);
  }, [floorPlans, setFloorPlans]);

  return {
    handleFloorSelect,
    handleAddFloor
  };
};
