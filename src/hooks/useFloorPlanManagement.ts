
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import logger from '@/utils/logger';

// Import from the adapter instead of direct import
import { FloorPlan, adaptFloorPlan } from '@/types/floorPlanAdapter';

interface UseFloorPlanManagementProps {
  onFloorPlanCreated?: (floorPlan: FloorPlan) => void;
  onFloorPlanDeleted?: (id: string) => void;
  onFloorPlanUpdated?: (floorPlan: FloorPlan) => void;
}

export const useFloorPlanManagement = ({
  onFloorPlanCreated,
  onFloorPlanDeleted,
  onFloorPlanUpdated
}: UseFloorPlanManagementProps = {}) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [activeFloorPlanId, setActiveFloorPlanId] = useState<string | null>(null);
  
  const createFloorPlan = useCallback((data: Partial<FloorPlan> = {}) => {
    try {
      const id = uuidv4();
      const timestamp = new Date().toISOString();
      
      const newFloorPlan = adaptFloorPlan({
        id,
        name: `Floor Plan ${floorPlans.length + 1}`,
        width: data.width || 800,
        height: data.height || 600,
        updatedAt: timestamp,
        ...data,
        metadata: {
          createdAt: timestamp,
          updatedAt: timestamp,
          ...data.metadata
        }
      });
      
      setFloorPlans(prev => [...prev, newFloorPlan]);
      
      if (onFloorPlanCreated) {
        onFloorPlanCreated(newFloorPlan);
      }
      
      toast.success('Floor plan created');
      return newFloorPlan;
    } catch (error) {
      logger.error('Error creating floor plan:', error);
      toast.error('Failed to create floor plan');
      return null;
    }
  }, [floorPlans, onFloorPlanCreated]);
  
  const updateFloorPlan = useCallback((id: string, data: Partial<FloorPlan>) => {
    try {
      const timestamp = new Date().toISOString();
      
      setFloorPlans(prev => prev.map(plan => {
        if (plan.id !== id) return plan;
        
        const updated = {
          ...plan,
          ...data,
          updatedAt: timestamp,
          metadata: {
            ...plan.metadata,
            updatedAt: timestamp,
            ...data.metadata
          }
        };
        
        return adaptFloorPlan(updated);
      }));
      
      const updatedPlan = floorPlans.find(plan => plan.id === id);
      
      if (updatedPlan && onFloorPlanUpdated) {
        onFloorPlanUpdated(updatedPlan);
      }
      
      toast.success('Floor plan updated');
      return true;
    } catch (error) {
      logger.error('Error updating floor plan:', error);
      toast.error('Failed to update floor plan');
      return false;
    }
  }, [floorPlans, onFloorPlanUpdated]);
  
  const deleteFloorPlan = useCallback((id: string) => {
    try {
      setFloorPlans(prev => prev.filter(plan => plan.id !== id));
      
      if (activeFloorPlanId === id) {
        setActiveFloorPlanId(null);
      }
      
      if (onFloorPlanDeleted) {
        onFloorPlanDeleted(id);
      }
      
      toast.success('Floor plan deleted');
      return true;
    } catch (error) {
      logger.error('Error deleting floor plan:', error);
      toast.error('Failed to delete floor plan');
      return false;
    }
  }, [activeFloorPlanId, onFloorPlanDeleted]);
  
  return {
    floorPlans,
    activeFloorPlanId,
    setActiveFloorPlanId,
    createFloorPlan,
    updateFloorPlan,
    deleteFloorPlan
  };
};

export default useFloorPlanManagement;
