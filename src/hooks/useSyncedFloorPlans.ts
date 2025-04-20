
import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { FloorPlan } from '@/types/floorPlanTypes';
import { toast } from 'sonner';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';

export interface UseSyncedFloorPlansProps {
  initialFloorPlans?: FloorPlan[];
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
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
  
  // Additional properties for tests
  loading: boolean;
  error: Error | null;
  createFloorPlan: (partial: Partial<FloorPlan>) => void;
  deleteFloorPlan: (id: string) => void;
}

export const useSyncedFloorPlans = ({
  initialFloorPlans = [],
  fabricCanvasRef = { current: null }
}: UseSyncedFloorPlansProps = {}): UseSyncedFloorPlansResult => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans);
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Try to load floor plans from localStorage on initialization
  useEffect(() => {
    try {
      setLoading(true);
      const storedFloorPlans = localStorage.getItem('floorPlans');
      if (storedFloorPlans && initialFloorPlans.length === 0) {
        setFloorPlans(JSON.parse(storedFloorPlans));
      }
    } catch (err) {
      console.error('Failed to load floor plans from localStorage:', err);
      setError(err instanceof Error ? err : new Error('Failed to load floor plans'));
      toast.error('Failed to load floor plans');
    } finally {
      setLoading(false);
    }
  }, [initialFloorPlans.length]);
  
  // Save floor plans to localStorage when they change
  useEffect(() => {
    if (floorPlans.length > 0) {
      try {
        localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
      } catch (err) {
        console.error('Failed to save floor plans to localStorage:', err);
        setError(err instanceof Error ? err : new Error('Failed to save floor plans'));
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
      metadata: createCompleteMetadata({
        level: floorPlans.length
      }),
      data: {}, // Required by FloorPlan interface
      userId: 'default-user' // Required by FloorPlan interface
    };
    
    setFloorPlans(prev => [...prev, newFloorPlan]);
    setCurrentFloorIndex(floorPlans.length);
  }, [floorPlans]);
  
  // Create a floor plan with custom properties
  const createFloorPlan = useCallback((partial: Partial<FloorPlan>) => {
    const newFloorPlan: FloorPlan = {
      id: partial.id || uuidv4(),
      name: partial.name || `Floor ${floorPlans.length + 1}`,
      label: partial.label || partial.name || `Floor ${floorPlans.length + 1}`,
      walls: partial.walls || [],
      rooms: partial.rooms || [],
      strokes: partial.strokes || [],
      gia: partial.gia || 0,
      level: partial.level || floorPlans.length,
      index: partial.index || floorPlans.length,
      canvasData: partial.canvasData || null,
      canvasJson: partial.canvasJson || null,
      createdAt: partial.createdAt || new Date().toISOString(),
      updatedAt: partial.updatedAt || new Date().toISOString(),
      metadata: partial.metadata || createCompleteMetadata({
        level: partial.level || floorPlans.length
      }),
      data: partial.data || {}, // Required by FloorPlan interface
      userId: partial.userId || 'default-user' // Required by FloorPlan interface
    };
    
    setFloorPlans(prev => [...prev, newFloorPlan]);
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
  
  // Delete a floor plan by ID
  const deleteFloorPlan = useCallback((id: string) => {
    const index = floorPlans.findIndex(plan => plan.id === id);
    if (index !== -1) {
      removeFloorPlan(index);
    }
  }, [floorPlans, removeFloorPlan]);
  
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
    setFloorPlans,
    loading,
    error,
    createFloorPlan,
    deleteFloorPlan
  };
};
