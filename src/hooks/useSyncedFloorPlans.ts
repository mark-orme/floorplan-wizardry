
import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { FloorPlan } from '@/types/floorPlanTypes';
import { toast } from 'sonner';

export interface UseSyncedFloorPlansProps {
  initialFloorPlans?: FloorPlan[];
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

export interface UseSyncedFloorPlansResult {
  floorPlans: FloorPlan[];
  currentFloorIndex: number;
  setCurrentFloorIndex: (index: number) => void;
  addFloorPlan: () => void;
  removeFloorPlan: (index: number) => void;
  updateFloorPlan: (floorPlan: FloorPlan) => void;
  saveFloorPlan: () => Promise<string | null>;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
}

export const useSyncedFloorPlans = ({
  initialFloorPlans = [],
  fabricCanvasRef
}: UseSyncedFloorPlansProps = { fabricCanvasRef: { current: null } }): UseSyncedFloorPlansResult => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans);
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  
  // Try to load floor plans from localStorage on initialization
  useEffect(() => {
    try {
      const storedFloorPlans = localStorage.getItem('floorPlans');
      if (storedFloorPlans && initialFloorPlans.length === 0) {
        setFloorPlans(JSON.parse(storedFloorPlans));
      }
    } catch (error) {
      console.error('Failed to load floor plans from localStorage:', error);
      toast.error('Failed to load floor plans');
    }
  }, [initialFloorPlans.length]);
  
  // Save floor plans to localStorage when they change
  useEffect(() => {
    if (floorPlans.length > 0) {
      try {
        localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
      } catch (error) {
        console.error('Failed to save floor plans to localStorage:', error);
        toast.error('Failed to save floor plans');
      }
    }
  }, [floorPlans]);
  
  const getCurrentFloorPlan = useCallback(() => {
    return floorPlans[currentFloorIndex] || null;
  }, [floorPlans, currentFloorIndex]);
  
  // Add a new floor plan
  const addFloorPlan = useCallback(() => {
    const newFloorPlan: FloorPlan = {
      id: uuidv4(),
      name: `Floor ${floorPlans.length + 1}`,
      label: `Floor ${floorPlans.length + 1}`,
      walls: [],
      rooms: [],
      strokes: [],
      gia: 0,
      level: floorPlans.length,
      index: floorPlans.length,
      canvasData: null,
      canvasJson: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paperSize: 'A4',
        level: floorPlans.length
      },
      data: {}, // Required by FloorPlan interface
      userId: 'default-user' // Required by FloorPlan interface
    };
    
    setFloorPlans(prev => [...prev, newFloorPlan]);
    setCurrentFloorIndex(floorPlans.length);
  }, [floorPlans]);
  
  // Remove a floor plan
  const removeFloorPlan = useCallback((index: number) => {
    if (floorPlans.length <= 1) {
      console.warn('Cannot remove the last floor plan');
      return;
    }
    
    setFloorPlans(prev => prev.filter((_, i) => i !== index));
    
    if (currentFloorIndex >= index) {
      setCurrentFloorIndex(prev => Math.max(0, prev - 1));
    }
  }, [floorPlans.length, currentFloorIndex]);
  
  // Update floor plan
  const updateFloorPlan = useCallback((floorPlan: FloorPlan) => {
    setFloorPlans(prev => {
      const updated = [...prev];
      const index = updated.findIndex(p => p.id === floorPlan.id);
      if (index !== -1) {
        updated[index] = floorPlan;
      }
      return updated;
    });
  }, []);
  
  // Save floor plan to backend
  const saveFloorPlan = useCallback(async (): Promise<string | null> => {
    const currentFloorPlan = getCurrentFloorPlan();
    if (!currentFloorPlan) return null;
    
    // Save canvas state to floor plan
    if (fabricCanvasRef.current) {
      const canvasJson = JSON.stringify(fabricCanvasRef.current.toJSON());
      const updatedFloorPlan: FloorPlan = {
        ...currentFloorPlan,
        canvasJson,
        updatedAt: new Date().toISOString()
      };
      
      updateFloorPlan(updatedFloorPlan);
      console.log('Floor plan saved with canvas state');
      return updatedFloorPlan.id;
    }
    
    return null;
  }, [fabricCanvasRef, getCurrentFloorPlan, updateFloorPlan]);
  
  return {
    floorPlans,
    currentFloorIndex,
    setCurrentFloorIndex,
    addFloorPlan,
    removeFloorPlan,
    updateFloorPlan,
    saveFloorPlan,
    setFloorPlans
  };
};
