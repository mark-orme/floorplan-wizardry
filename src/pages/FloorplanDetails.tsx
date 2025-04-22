
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FloorPlan } from '@/types/floorPlan';
import { fetchFloorPlanById } from '@/api/floorPlans';
import { FloorPlanViewer } from '@/components/FloorPlanViewer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FloorplanDetailsProps {
  // No props needed
}

export const FloorplanDetails: React.FC<FloorplanDetailsProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch floor plan data
  const { data: floorPlan, isLoading, error } = useQuery({
    queryKey: ['floorPlan', id],
    queryFn: () => fetchFloorPlanById(id || '')
  });
  
  useEffect(() => {
    if (error) {
      toast.error('Failed to load floor plan');
      console.error('Error loading floor plan:', error);
    }
  }, [error]);
  
  const toggleEditMode = () => {
    setIsEditing(prev => !prev);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!floorPlan) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold">Floor Plan Not Found</h2>
        <p className="text-muted-foreground">The requested floor plan could not be loaded.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{floorPlan.name}</h1>
        <Button variant={isEditing ? "secondary" : "default"} onClick={toggleEditMode}>
          {isEditing ? "View Mode" : "Edit Mode"}
        </Button>
      </div>
      
      <div className="bg-card border rounded-lg shadow-sm p-4">
        <FloorPlanViewer floorPlan={floorPlan as FloorPlan} isEditable={isEditing} />
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-3">Floor Plan Details</h3>
          <dl className="grid grid-cols-2 gap-2">
            <dt className="text-muted-foreground">Level</dt>
            <dd>{floorPlan.level || 'Ground Floor'}</dd>
            
            <dt className="text-muted-foreground">Created</dt>
            <dd>{new Date(floorPlan.createdAt).toLocaleDateString()}</dd>
            
            <dt className="text-muted-foreground">Last Updated</dt>
            <dd>{new Date(floorPlan.updatedAt).toLocaleDateString()}</dd>
            
            <dt className="text-muted-foreground">GIA</dt>
            <dd>{floorPlan.gia ? `${floorPlan.gia} m²` : 'Not calculated'}</dd>
            
            <dt className="text-muted-foreground">Rooms</dt>
            <dd>{floorPlan.rooms.length}</dd>
          </dl>
        </div>
        
        <div className="bg-card border rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-3">Room Breakdown</h3>
          {floorPlan.rooms.length > 0 ? (
            <ul className="space-y-2">
              {floorPlan.rooms.map(room => (
                <li key={room.id} className="flex justify-between">
                  <span>{room.name}</span>
                  <span className="text-muted-foreground">{room.area} m²</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No rooms defined in this floor plan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloorplanDetails;
