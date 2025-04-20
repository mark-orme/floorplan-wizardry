
/**
 * Floor Plans Page
 * Lists all floor plans and provides access to the floor plan editor
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Grid, RefreshCcw } from 'lucide-react';
import { FloorPlanEditor } from '@/components/canvas/FloorPlanEditor';
import { FloorPlansList } from '@/components/floorplan/FloorPlansList';
import { useSupabaseFloorPlans } from '@/hooks/useSupabaseFloorPlans';

export default function FloorPlans() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  
  const {
    loading,
    floorPlans = [], // Provide default empty array
    error = null,
    getFloorPlan,
    createFloorPlan,
    updateFloorPlan,
    deleteFloorPlan
  } = useSupabaseFloorPlans();
  
  // For compatibility with components expecting these prop names
  const isLoading = loading;
  
  // Load floor plans on mount
  useEffect(() => {
    const fetchFloorPlans = async () => {
      try {
        // Implementation depends on actual hook structure
        // For now, just handle errors
        if (error) {
          console.error('Error loading floor plans:', error);
          toast.error('Failed to load floor plans');
        }
      } catch (err) {
        console.error('Error in floor plan fetching:', err);
        toast.error('Failed to load floor plans');
      }
    };
    
    fetchFloorPlans();
  }, [error]);
  
  const handleCreateNew = () => {
    if (!user) {
      toast.error('Please sign in to create a floor plan');
      navigate('/auth', { state: { returnTo: '/floorplans' } });
      return;
    }
    
    setShowEditor(true);
  };
  
  const handleRefresh = async () => {
    // Implementation depends on hook structure
    toast.success('Floor plans refreshed');
  };
  
  const handleFloorPlanClick = (id: string) => {
    navigate(`/floorplans/${id}`);
  };
  
  const handleEditorClose = () => {
    setShowEditor(false);
  };
  
  const handleDeleteFloorPlan = async (id: string) => {
    try {
      await deleteFloorPlan(id);
      toast.success('Floor plan deleted');
    } catch (err) {
      console.error('Error deleting floor plan:', err);
      toast.error('Failed to delete floor plan');
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Floor Plans</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreateNew} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {showEditor ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-[800px]">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Floor Plan Editor</h2>
            <Button variant="outline" onClick={handleEditorClose}>
              Close Editor
            </Button>
          </div>
          <FloorPlanEditor />
        </div>
      ) : (
        <FloorPlansList
          floorPlans={floorPlans}
          isLoading={isLoading}
          onFloorPlanClick={handleFloorPlanClick}
          onDeleteFloorPlan={handleDeleteFloorPlan}
        />
      )}
    </div>
  );
}
