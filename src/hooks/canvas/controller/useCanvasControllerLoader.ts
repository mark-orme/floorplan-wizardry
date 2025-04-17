
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan } from '@/types/floorPlanTypes';
import { deserializeCanvasState } from '@/utils/canvas/canvasSerializer';
import { toast } from 'sonner';

export const useCanvasControllerLoader = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>
) => {
  const loadFloorPlan = async (floorPlan: FloorPlan) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !floorPlan.canvasState) {
      return false;
    }
    
    try {
      const success = deserializeCanvasState(canvas, floorPlan.canvasState);
      if (success) {
        toast.success(`Loaded ${floorPlan.name}`);
      } else {
        toast.error('Failed to load floor plan');
      }
      return success;
    } catch (error) {
      console.error('Error loading floor plan:', error);
      toast.error('Error loading floor plan');
      return false;
    }
  };
  
  return { loadFloorPlan };
};
