import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import { FloorPlan } from '@/types/floor-plan/unifiedTypes';
import { adaptFloorPlan } from '@/utils/typeAdapters';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';

export default function FloorplanDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!id) {
      toast.error('Floor plan ID is missing');
      navigate('/floorplans');
      return;
    }

    const fetchFloorPlan = async () => {
      setIsLoading(true);
      try {
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }

        const { data, error } = await supabase
          .from('floor_plans')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching floor plan:', error);
          toast.error(`Failed to load floor plan: ${error.message}`);
          return;
        }

        if (data) {
          const adaptedFloorPlan = adaptFloorPlan({
            ...data,
            metadata: createCompleteMetadata(data.metadata)
          });
          setFloorPlan(adaptedFloorPlan);
          setName(adaptedFloorPlan.name);
        } else {
          toast.error('Floor plan not found');
          navigate('/floorplans');
        }
      } catch (error: any) {
        console.error('Unexpected error:', error);
        toast.error(`Unexpected error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFloorPlan();
  }, [id, navigate, supabase]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      if (!supabase || !floorPlan) {
        throw new Error('Supabase client or floor plan is not initialized');
      }

      const { error } = await supabase
        .from('floor_plans')
        .update({ name })
        .eq('id', floorPlan.id);

      if (error) {
        console.error('Error updating floor plan:', error);
        toast.error(`Failed to update floor plan: ${error.message}`);
        return;
      }

      // Optimistically update the local state
      setFloorPlan({ ...floorPlan, name });
      toast.success('Floor plan updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error(`Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setName(floorPlan?.name || ''); // Revert to original name
  };

  if (isLoading) {
    return <div>Loading floor plan details...</div>;
  }

  if (!floorPlan) {
    return <div>Floor plan not found.</div>;
  }

  // Ensure walls include color and roomIds to match the Wall type
  const fixedFloorPlan = {
    ...floorPlan,
    walls: floorPlan.walls.map(wall => ({
      ...wall,
      color: wall.color || "#000000",  // Default color if not present
      roomIds: wall.roomIds || []      // Default empty array if not present
    }))
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{isEditing ? 'Edit Floor Plan Name' : floorPlan.name}</CardTitle>
          {isEditing ? (
            <div className="space-x-2">
              <Button
                variant="ghost"
                onClick={handleCancelClick}
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveClick}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          ) : (
            <Button onClick={handleEditClick} disabled={isLoading}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Name
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          ) : (
            <div className="space-y-1">
              <CardDescription>Floor Plan ID: {floorPlan.id}</CardDescription>
              <CardDescription>Created At: {new Date(floorPlan.createdAt).toLocaleDateString()}</CardDescription>
              <CardDescription>Last Updated: {new Date(floorPlan.updatedAt).toLocaleDateString()}</CardDescription>
              <CardDescription>Number of Walls: {fixedFloorPlan.walls.length}</CardDescription>
              <CardDescription>Number of Rooms: {fixedFloorPlan.rooms.length}</CardDescription>
              <CardDescription>Gross Internal Area: {floorPlan.gia} m²</CardDescription>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
