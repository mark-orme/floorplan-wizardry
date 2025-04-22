
import { useState, useCallback } from 'react';
import { FloorPlan, createEmptyFloorPlan } from '@/types/floorPlan';
import { useToast } from '@/hooks/useToast';

interface UsePropertyFloorPlanProps {
  propertyId?: string;
  initialFloorPlans?: FloorPlan[];
}

export const usePropertyFloorPlan = ({
  propertyId,
  initialFloorPlans = []
}: UsePropertyFloorPlanProps = {}) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(
    initialFloorPlans.length > 0 ? initialFloorPlans : [createEmptyFloorPlan()]
  );
  const [activeFloorPlanIndex, setActiveFloorPlanIndex] = useState(0);
  const { toast } = useToast();
  
  // Get active floor plan
  const activeFloorPlan = floorPlans[activeFloorPlanIndex] || floorPlans[0];
  
  // Add a new floor plan
  const addFloorPlan = useCallback(() => {
    const newFloorPlan = createEmptyFloorPlan();
    
    // Set property ID if available
    if (propertyId) {
      newFloorPlan.propertyId = propertyId;
    }
    
    // Add level information
    newFloorPlan.level = floorPlans.length;
    newFloorPlan.name = `Floor ${floorPlans.length + 1}`;
    
    setFloorPlans(prevFloorPlans => [...prevFloorPlans, newFloorPlan]);
    setActiveFloorPlanIndex(floorPlans.length);
    
    toast({
      title: 'Floor Plan Added',
      description: `${newFloorPlan.name} has been created`,
      variant: 'default'
    });
    
    return newFloorPlan;
  }, [floorPlans.length, propertyId, toast]);
  
  // Update a floor plan
  const updateFloorPlan = useCallback((index: number, updates: Partial<FloorPlan>) => {
    setFloorPlans(prevFloorPlans => {
      const newFloorPlans = [...prevFloorPlans];
      
      if (index >= 0 && index < newFloorPlans.length) {
        newFloorPlans[index] = {
          ...newFloorPlans[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      
      return newFloorPlans;
    });
  }, []);
  
  // Update active floor plan
  const updateActiveFloorPlan = useCallback((updates: Partial<FloorPlan>) => {
    updateFloorPlan(activeFloorPlanIndex, updates);
  }, [activeFloorPlanIndex, updateFloorPlan]);
  
  // Delete a floor plan
  const deleteFloorPlan = useCallback((index: number) => {
    // Don't allow deleting the last floor plan
    if (floorPlans.length <= 1) {
      toast({
        title: 'Cannot Delete',
        description: 'You must have at least one floor plan',
        variant: 'destructive'
      });
      return;
    }
    
    setFloorPlans(prevFloorPlans => {
      const newFloorPlans = prevFloorPlans.filter((_, i) => i !== index);
      
      // Update levels
      return newFloorPlans.map((plan, i) => ({
        ...plan,
        level: i,
        name: `Floor ${i + 1}`
      }));
    });
    
    // Update active index if needed
    if (index <= activeFloorPlanIndex) {
      setActiveFloorPlanIndex(Math.max(0, activeFloorPlanIndex - 1));
    }
    
    toast({
      title: 'Floor Plan Deleted',
      description: 'The floor plan has been removed',
      variant: 'default'
    });
  }, [floorPlans.length, activeFloorPlanIndex, toast]);
  
  return {
    floorPlans,
    activeFloorPlan,
    activeFloorPlanIndex,
    setActiveFloorPlanIndex,
    addFloorPlan,
    updateFloorPlan,
    updateActiveFloorPlan,
    deleteFloorPlan
  };
};

// Create a hook for toast notifications if it doesn't exist
export const useToast = () => {
  const showToast = useCallback((props: { title: string; description: string; variant?: 'default' | 'destructive' }) => {
    console.log(`Toast: ${props.title} - ${props.description}`);
  }, []);

  return { toast: showToast };
};
