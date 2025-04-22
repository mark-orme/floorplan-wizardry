
import { useState, useCallback } from 'react';
import { FloorPlan } from '@/types/floorPlan';
import { DrawingMode } from '@/constants/drawingModes';

export interface UseFloorPlanStateProps {
  initialFloorPlans?: FloorPlan[];
  initialTool?: DrawingMode;
}

export const useFloorPlanState = ({
  initialFloorPlans = [],
  initialTool = DrawingMode.SELECT
}: UseFloorPlanStateProps) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans);
  const [currentTool, setCurrentTool] = useState<DrawingMode>(initialTool);
  const [selectedFloorIndex, setSelectedFloorIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const currentFloorPlan = floorPlans[selectedFloorIndex] || null;

  const updateCurrentFloorPlan = useCallback((updater: FloorPlan | ((prev: FloorPlan) => FloorPlan)) => {
    if (!currentFloorPlan) return;
    
    setFloorPlans(prev => {
      const updated = [...prev];
      if (typeof updater === 'function') {
        updated[selectedFloorIndex] = updater(prev[selectedFloorIndex]);
      } else {
        updated[selectedFloorIndex] = updater;
      }
      return updated;
    });
  }, [currentFloorPlan, selectedFloorIndex]);

  const selectTool = useCallback((tool: DrawingMode) => {
    setCurrentTool(tool);
  }, []);

  return {
    floorPlans,
    setFloorPlans,
    currentFloorPlan,
    updateCurrentFloorPlan,
    currentTool,
    selectTool,
    selectedFloorIndex,
    setSelectedFloorIndex,
    isEditing,
    setIsEditing
  };
};
