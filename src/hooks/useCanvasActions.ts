
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { CanvasAction } from '@/types/canvas/canvasTypes';

// Local action type definitions
interface AddFloorPlanAction extends CanvasAction {
  type: 'ADD_FLOOR_PLAN';
  payload: {
    floorPlan: any;
  };
}

interface UpdateFloorPlanAction extends CanvasAction {
  type: 'UPDATE_FLOOR_PLAN';
  payload: {
    id: string;
    changes: any;
  };
}

interface DeleteFloorPlanAction extends CanvasAction {
  type: 'DELETE_FLOOR_PLAN';
  payload: {
    id: string;
  };
}

// Helper function to create actions with timestamp
function createCanvasAction<T extends CanvasAction>(type: T['type'], payload?: any): T {
  return {
    type,
    payload,
    timestamp: Date.now()
  } as unknown as T;
}

export const useCanvasActions = (canvas: FabricCanvas | null) => {
  const addFloorPlan = useCallback((floorPlan: any) => {
    if (!canvas) {
      console.error('Canvas not available');
      return;
    }
    
    try {
      // Create action
      const action = createCanvasAction<AddFloorPlanAction>('ADD_FLOOR_PLAN', { floorPlan });
      
      // Process action
      console.log('Adding floor plan', action);
      toast.success('Floor plan added');
      
      return action;
    } catch (error) {
      console.error('Error adding floor plan', error);
      toast.error('Failed to add floor plan');
      return null;
    }
  }, [canvas]);
  
  const updateFloorPlan = useCallback((id: string, changes: any) => {
    if (!canvas) {
      console.error('Canvas not available');
      return;
    }
    
    try {
      // Create action
      const action = createCanvasAction<UpdateFloorPlanAction>('UPDATE_FLOOR_PLAN', { id, changes });
      
      // Process action
      console.log('Updating floor plan', action);
      toast.success('Floor plan updated');
      
      return action;
    } catch (error) {
      console.error('Error updating floor plan', error);
      toast.error('Failed to update floor plan');
      return null;
    }
  }, [canvas]);
  
  const deleteFloorPlan = useCallback((id: string) => {
    if (!canvas) {
      console.error('Canvas not available');
      return;
    }
    
    try {
      // Create action
      const action = createCanvasAction<DeleteFloorPlanAction>('DELETE_FLOOR_PLAN', { id });
      
      // Process action
      console.log('Deleting floor plan', action);
      toast.success('Floor plan deleted');
      
      return action;
    } catch (error) {
      console.error('Error deleting floor plan', error);
      toast.error('Failed to delete floor plan');
      return null;
    }
  }, [canvas]);
  
  return {
    addFloorPlan,
    updateFloorPlan,
    deleteFloorPlan
  };
};
