
import { useState, useCallback } from 'react';
import { FloorPlan, createEmptyFloorPlan } from '@/types/floorPlan';

// Remove any incompatible properties
export interface FloorPlanMetadataExtended {
  createdAt: string;
  updatedAt: string;
  author?: string;
  version?: string;
  paperSize?: string;
  level?: number;
  dateCreated?: string;
  // Removed lastModified since it's not in FloorPlanMetadata
}

export const useFloorPlans = (initialFloorPlans: FloorPlan[] = []) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans.length > 0 
    ? initialFloorPlans 
    : [createEmptyFloorPlan()]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const addFloorPlan = useCallback(() => {
    const newFloorPlan = createEmptyFloorPlan();
    
    setFloorPlans(prev => [...prev, newFloorPlan]);
    setCurrentIndex(prev => prev + 1);
    
    return newFloorPlan;
  }, []);
  
  const updateFloorPlan = useCallback((index: number, updatedFloorPlan: Partial<FloorPlan>) => {
    setFloorPlans(prev => {
      const newFloorPlans = [...prev];
      
      if (index >= 0 && index < newFloorPlans.length) {
        newFloorPlans[index] = {
          ...newFloorPlans[index],
          ...updatedFloorPlan,
          updatedAt: new Date().toISOString()
        };
      }
      
      return newFloorPlans;
    });
  }, []);
  
  const deleteFloorPlan = useCallback((index: number) => {
    setFloorPlans(prev => {
      // Don't delete if it's the only floor plan
      if (prev.length <= 1) {
        return prev;
      }
      
      const newFloorPlans = prev.filter((_, i) => i !== index);
      
      // Adjust current index if needed
      if (index <= currentIndex) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
      
      return newFloorPlans;
    });
  }, [currentIndex]);
  
  const createNewFloorPlan = useCallback((name: string = 'New Floor Plan', level: number = 0) => {
    const newFloorPlan: FloorPlan = {
      id: crypto.randomUUID(),
      name,
      walls: [],
      rooms: [],
      strokes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gia: 0,
      level,
      index: floorPlans.length,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      data: {}
    };
    
    setFloorPlans(prev => [...prev, newFloorPlan]);
    setCurrentIndex(floorPlans.length);
    
    return newFloorPlan;
  }, [floorPlans.length]);
  
  return {
    floorPlans,
    currentFloorPlan: floorPlans[currentIndex],
    currentIndex,
    setCurrentIndex,
    addFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
    createNewFloorPlan
  };
};
