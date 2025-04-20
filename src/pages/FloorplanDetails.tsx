
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSupabaseFloorPlans } from '@/hooks/useSupabaseFloorPlans';
import { EnhancedDrawingCanvas } from '@/components/EnhancedDrawingCanvas';
import { FloorPlan } from '@/types/FloorPlan';

interface EnhancedDrawingCanvasProps {
  width: number;
  height: number;
  canvasId?: string; // Make canvasId optional
}

export default function FloorplanDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getFloorPlan, updateFloorPlan, deleteFloorPlan } = useSupabaseFloorPlans();
  const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadFloorPlan = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await getFloorPlan(id);
        if (error) {
          toast.error('Error loading floor plan');
          navigate('/floorplans');
          return;
        }
        
        if (data) {
          // Correctly set the FloorPlan data
          setFloorPlan(data as FloorPlan);
        } else {
          toast.error('Floor plan not found');
          navigate('/floorplans');
        }
      } catch (error) {
        console.error('Error loading floor plan:', error);
        toast.error('Failed to load floor plan');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFloorPlan();
  }, [id, getFloorPlan, navigate]);
  
  const handleCanvasReady = (canvas: any) => {
    console.log('Canvas ready:', canvas);
    // Load floor plan data into canvas
  };
  
  const handleGoBack = () => {
    navigate('/floorplans');
  };
  
  const handleSave = async () => {
    if (!floorPlan || !id) return;
    
    try {
      await updateFloorPlan(id, floorPlan);
      toast.success('Floor plan saved');
    } catch (error) {
      console.error('Error saving floor plan:', error);
      toast.error('Failed to save floor plan');
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    if (!window.confirm('Are you sure you want to delete this floor plan?')) {
      return;
    }
    
    try {
      await deleteFloorPlan(id);
      toast.success('Floor plan deleted');
      navigate('/floorplans');
    } catch (error) {
      console.error('Error deleting floor plan:', error);
      toast.error('Failed to delete floor plan');
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {isLoading ? 'Loading...' : floorPlan?.name || 'Floor Plan Details'}
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading floor plan...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <EnhancedDrawingCanvas 
            width={800} 
            height={600} 
            // canvasId is now optional, so no need to provide it
          />
        </div>
      )}
      
      {floorPlan && (
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Floor Plan Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p>{new Date(floorPlan.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p>{new Date(floorPlan.updatedAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Level</p>
              <p>{floorPlan.level}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Area</p>
              <p>{floorPlan.gia} m²</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
