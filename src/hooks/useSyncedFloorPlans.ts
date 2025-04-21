
import { useState, useEffect, useCallback } from 'react';
import { FloorPlan } from '@/types/floor-plan/unifiedTypes';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface UseSyncedFloorPlansProps {
  initialFloorPlans?: FloorPlan[];
  onFloorPlansChange?: (floorPlans: FloorPlan[]) => void;
}

export const useSyncedFloorPlans = ({
  initialFloorPlans = [],
  onFloorPlansChange = () => {}
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
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast.error('Failed to load floor plans');
    }
  }, []);
  
  // Sync floor plans to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
    } catch (err) {
      console.error('Failed to save floor plans to localStorage:', err);
      toast.error('Failed to save floor plans');
    }
  }, [floorPlans]);
  
  useEffect(() => {
    if (initialFloorPlans.length > 0) {
      setFloorPlans(initialFloorPlans);
    }
  }, [initialFloorPlans]);
  
  useEffect(() => {
    onFloorPlansChange(floorPlans);
  }, [floorPlans, onFloorPlansChange]);
  
  const updateFloorPlan = useCallback((index: number, updatedFloorPlan: FloorPlan) => {
    setFloorPlans(prevFloorPlans => {
      const newFloorPlans = [...prevFloorPlans];
      
      // Ensure the updatedFloorPlan metadata has all required fields
      const safeMetadata = {
        version: updatedFloorPlan.metadata?.version || '1.0',
        author: updatedFloorPlan.metadata?.author || 'User',
        dateCreated: updatedFloorPlan.metadata?.dateCreated || new Date().toISOString(),
        lastModified: updatedFloorPlan.metadata?.lastModified || new Date().toISOString(),
        notes: updatedFloorPlan.metadata?.notes || '',
        createdAt: updatedFloorPlan.metadata?.createdAt || new Date().toISOString(),
        updatedAt: updatedFloorPlan.metadata?.updatedAt || new Date().toISOString(),
        paperSize: updatedFloorPlan.metadata?.paperSize || 'A4',
        level: updatedFloorPlan.metadata?.level || 0
      };
      
      newFloorPlans[index] = {
        ...updatedFloorPlan,
        metadata: safeMetadata
      };
      
      return newFloorPlans;
    });
  }, []);
  
  // Add createFloorPlan function for tests
  const createFloorPlan = useCallback((partialFloorPlan: Partial<FloorPlan> = {}) => {
    const now = new Date().toISOString();
    const newFloorPlan: FloorPlan = {
      id: partialFloorPlan.id || uuidv4(),
      name: partialFloorPlan.name || 'New Floor Plan',
      label: partialFloorPlan.label || 'New Floor Plan',
      walls: partialFloorPlan.walls || [],
      rooms: partialFloorPlan.rooms || [],
      strokes: partialFloorPlan.strokes || [],
      gia: partialFloorPlan.gia || 0,
      level: partialFloorPlan.level || 0,
      index: partialFloorPlan.index || 0,
      createdAt: partialFloorPlan.createdAt || now,
      updatedAt: partialFloorPlan.updatedAt || now,
      canvasData: partialFloorPlan.canvasData || null,
      canvasJson: partialFloorPlan.canvasJson || null,
      metadata: {
        version: '1.0',
        author: 'User',
        dateCreated: now,
        lastModified: now,
        notes: '',
        createdAt: now,
        updatedAt: now,
        paperSize: 'A4',
        level: partialFloorPlan.level || 0
      },
      data: partialFloorPlan.data || {},
      userId: partialFloorPlan.userId || 'user-id'
    };
    
    setFloorPlans(prevFloorPlans => [...prevFloorPlans, newFloorPlan]);
    return newFloorPlan;
  }, []);
  
  // Add deleteFloorPlan function for tests
  const deleteFloorPlan = useCallback((id: string) => {
    setFloorPlans(prevFloorPlans => prevFloorPlans.filter(fp => fp.id !== id));
  }, []);
  
  return {
    floorPlans,
    setFloorPlans,
    updateFloorPlan,
    loading,
    error,
    createFloorPlan,
    deleteFloorPlan
  };
};
