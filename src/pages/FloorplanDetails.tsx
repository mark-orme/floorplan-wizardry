
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { FloorPlan } from '@/types/floorPlan';
import { Spinner } from '@/components/ui/spinner';

// Mock function to fetch a floor plan
const fetchFloorPlan = async (id: string): Promise<FloorPlan> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id,
    name: `Floor Plan ${id}`,
    level: 1,
    updatedAt: new Date().toISOString(),
    strokes: [],
    width: 1000,
    height: 800,
    backgroundColor: '#ffffff'
  };
};

// Mock FloorPlanViewer component
const FloorPlanViewer: React.FC<{ floorPlan: FloorPlan }> = ({ floorPlan }) => {
  return (
    <div className="border border-gray-200 p-4 rounded-lg">
      <h3 className="text-lg font-medium">Floor Plan Viewer</h3>
      <p>Name: {floorPlan.name}</p>
      <p>Level: {floorPlan.level}</p>
      <p>Last Updated: {new Date(floorPlan.updatedAt).toLocaleString()}</p>
      <div className="mt-4 bg-gray-100 h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Floor plan canvas would render here</p>
      </div>
    </div>
  );
};

export const FloorplanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    fetchFloorPlan(id)
      .then((data) => {
        setFloorPlan(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to fetch floor plan'));
        setLoading(false);
        toast.error('Failed to load floor plan details');
      });
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <h3 className="font-medium">Error</h3>
        <p>{error.message}</p>
      </div>
    );
  }
  
  if (!floorPlan) {
    return (
      <div className="p-4 bg-amber-50 text-amber-600 rounded-lg">
        <h3 className="font-medium">Not Found</h3>
        <p>The requested floor plan could not be found.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{floorPlan.name}</h1>
      </div>
      
      <FloorPlanViewer floorPlan={floorPlan} />
    </div>
  );
};

export default FloorplanDetails;
