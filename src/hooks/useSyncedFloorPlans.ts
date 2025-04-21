
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { FloorPlan, FloorPlanMetadata } from '@/types/floor-plan/unifiedTypes';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';
import { v4 as uuidv4 } from 'uuid';

interface UseSyncedFloorPlansProps {
  initialFloorPlans?: FloorPlan[];
  fabricCanvasRef?: React.MutableRefObject<any>;
}

export const useSyncedFloorPlans = ({
  initialFloorPlans = [],
  fabricCanvasRef
}: UseSyncedFloorPlansProps = {}) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Load floor plans from localStorage on init
  useEffect(() => {
    try {
      const storedFloorPlans = localStorage.getItem('floorPlans');
      if (storedFloorPlans) {
        setFloorPlans(JSON.parse(storedFloorPlans));
      }
    } catch (err) {
      console.error('Failed to load floor plans from localStorage:', err);
      setError(err instanceof Error ? err : new Error('Failed to load floor plans'));
      toast.error('Failed to load floor plans');
    }
  }, []);
  
  // Save floor plans to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
    } catch (err) {
      console.error('Failed to save floor plans to localStorage:', err);
      toast.error('Failed to save floor plans');
    }
  }, [floorPlans]);
  
  // Create a new floor plan
  const createFloorPlan = useCallback((options: { name?: string; level?: number } = {}) => {
    const now = new Date().toISOString();
    const metadata: FloorPlanMetadata = createCompleteMetadata({
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: options.level || 0,
      version: '1.0',
      author: 'User',
      dateCreated: now,
      lastModified: now,
      notes: ''
    }) as FloorPlanMetadata;
    
    const newFloorPlan: FloorPlan = {
      id: uuidv4(),
      name: options.name || `Floor Plan ${floorPlans.length + 1}`,
      label: options.name || `Floor Plan ${floorPlans.length + 1}`,
      walls: [],
      rooms: [],
      strokes: [],
      canvasData: null,
      canvasJson: null,
      createdAt: now,
      updatedAt: now,
      gia: 0,
      level: options.level || 0,
      index: floorPlans.length,
      metadata,
      data: {},
      userId: 'default-user'
    };
    
    setFloorPlans(prev => [...prev, newFloorPlan]);
    return newFloorPlan;
  }, [floorPlans.length]);
  
  // Update an existing floor plan
  const updateFloorPlan = useCallback((index: number, floorPlan: FloorPlan) => {
    setFloorPlans(prev => {
      const updated = [...prev];
      updated[index] = {
        ...floorPlan,
        updatedAt: new Date().toISOString()
      };
      return updated;
    });
  }, []);
  
  // Delete a floor plan by ID
  const deleteFloorPlan = useCallback((id: string) => {
    setFloorPlans(prev => prev.filter(plan => plan.id !== id));
  }, []);
  
  return {
    floorPlans,
    setFloorPlans,
    loading,
    error,
    createFloorPlan,
    updateFloorPlan,
    deleteFloorPlan
  };
};
