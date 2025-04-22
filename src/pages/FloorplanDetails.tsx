
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FloorPlan, createEmptyFloorPlan } from '@/types/floorPlan';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const fetchFloorPlan = async (id: string): Promise<FloorPlan> => {
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return a mock floor plan
  return {
    ...createEmptyFloorPlan(),
    id,
    name: `Floor Plan ${id}`,
    level: 1,
    updatedAt: new Date().toISOString(),
    walls: [],
    rooms: [],
  };
};

const FloorPlanViewer: React.FC<{ floorPlan: FloorPlan }> = ({ floorPlan }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <h2 className="text-xl font-bold mb-4">Floor Plan Viewer</h2>
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <p><strong>ID:</strong> {floorPlan.id}</p>
        <p><strong>Name:</strong> {floorPlan.name}</p>
        <p><strong>Level:</strong> {floorPlan.level}</p>
        <p><strong>Last Updated:</strong> {new Date(floorPlan.updatedAt).toLocaleDateString()}</p>
        <p><strong>Dimensions:</strong> {floorPlan.width}×{floorPlan.height}</p>
        <p><strong>Walls:</strong> {floorPlan.walls.length}</p>
        <p><strong>Rooms:</strong> {floorPlan.rooms.length}</p>
        <p><strong>Strokes:</strong> {floorPlan.strokes.length}</p>
      </div>
    </div>
  );
};

export function FloorplanDetails() {
  const { id } = useParams<{ id: string }>();
  const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Floor plan ID is required');
      setLoading(false);
      return;
    }

    const loadFloorPlan = async () => {
      try {
        const data = await fetchFloorPlan(id);
        setFloorPlan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load floor plan');
      } finally {
        setLoading(false);
      }
    };

    loadFloorPlan();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!floorPlan) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Not Found</h3>
        <p>The requested floor plan could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">{floorPlan.name}</h1>
      <FloorPlanViewer floorPlan={floorPlan} />
    </div>
  );
}
