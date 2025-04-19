
import React, { useState, useEffect } from 'react';
import { useSupabaseFloorPlans } from '@/hooks/useSupabaseFloorPlans';
import { FloorPlanList } from '@/components/FloorPlanList';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FloorPlan } from '@/types/floorPlanTypes';
import { toast } from 'sonner';

export default function FloorPlans() {
  const { floorPlans, isLoading, error, listFloorPlans, createFloorPlan } = useSupabaseFloorPlans();
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Refresh floor plans on mount
    listFloorPlans();
  }, [listFloorPlans]);

  const handleSelectFloorPlan = (floorPlan: FloorPlan) => {
    navigate(`/floorplans/${floorPlan.id}`);
  };

  const handleCreateFloorPlan = async () => {
    setIsCreating(true);
    
    try {
      const newFloorPlan = await createFloorPlan({
        name: `Floor Plan ${floorPlans.length + 1}`,
        data: {}
      });
      
      if (newFloorPlan) {
        navigate(`/floorplans/${newFloorPlan.id}`);
      }
    } catch (err) {
      toast.error('Failed to create floor plan');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Floor Plans</h1>
        <Button 
          onClick={handleCreateFloorPlan} 
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              New Floor Plan
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <div className="mb-4 p-4 text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <FloorPlanList 
          floorPlans={floorPlans} 
          onSelect={handleSelectFloorPlan}
        />
      )}
    </div>
  );
}
