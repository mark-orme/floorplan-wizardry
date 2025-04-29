import { useCallback } from 'react';
import { Canvas } from 'fabric';

// Define base action type
interface CanvasAction {
  type: string;
  payload: any;
}

// Define specific action types
interface AddShapeAction {
  type: 'ADD_SHAPE';
  payload: {
    shape: 'rect' | 'circle' | 'line';
    props: Record<string, any>;
  };
}

interface AddFloorPlanAction {
  type: 'ADD_FLOORPLAN';
  payload: {
    json: string;
    options?: Record<string, any>;
  };
}

interface RemoveSelectedAction {
  type: 'REMOVE_SELECTED';
  payload?: undefined;
}

type CanvasActionTypes = 
  | AddShapeAction
  | AddFloorPlanAction
  | RemoveSelectedAction;

export interface UseCanvasActionsProps {
  canvas: Canvas | null;
  onStateChange?: () => void;
}

export const useCanvasActions = ({ 
  canvas, 
  onStateChange 
}: UseCanvasActionsProps) => {
  // Dispatch function to handle canvas actions
  const dispatch = useCallback((action: CanvasActionTypes) => {
    if (!canvas) return;
    
    switch (action.type) {
      case 'ADD_SHAPE': {
        // Handle adding shape
        break;
      }
      case 'ADD_FLOORPLAN': {
        // Handle adding floorplan
        break;
      }
      case 'REMOVE_SELECTED': {
        // Handle removing selected objects
        const selectedObjects = canvas.getActiveObjects();
        if (selectedObjects.length > 0) {
          // Remove all selected objects
          canvas.discardActiveObject();
          selectedObjects.forEach(obj => {
            canvas.remove(obj);
          });
          canvas.requestRenderAll();
        }
        break;
      }
      default:
        // Handle unknown action
        break;
    }
    
    if (onStateChange) {
      onStateChange();
    }
  }, [canvas, onStateChange]);
  
  return {
    dispatch
  };
};
