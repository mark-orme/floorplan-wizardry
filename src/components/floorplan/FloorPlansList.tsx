
/**
 * Floor Plans List Component
 * Displays a grid of floor plans with actions
 */
import { FloorPlan } from '@/types/floorPlan';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash, Edit } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface FloorPlansListProps {
  floorPlans: FloorPlan[];
  isLoading: boolean;
  onFloorPlanClick: (id: string) => void;
  onDeleteFloorPlan: (id: string) => Promise<boolean>;
}

export function FloorPlansList({
  floorPlans,
  isLoading,
  onFloorPlanClick,
  onDeleteFloorPlan
}: FloorPlansListProps) {
  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this floor plan?')) {
      try {
        const success = await onDeleteFloorPlan(id);
        if (success) {
          toast.success('Floor plan deleted successfully');
        } else {
          toast.error('Failed to delete floor plan');
        }
      } catch (error) {
        toast.error('An error occurred while deleting the floor plan');
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (floorPlans.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No floor plans yet</h3>
        <p className="text-gray-500">
          Create your first floor plan by clicking the 'Create New' button above.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {floorPlans.map(floorPlan => (
        <Card 
          key={floorPlan.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onFloorPlanClick(floorPlan.id)}
        >
          <CardHeader>
            <CardTitle>{floorPlan.name || 'Untitled Floor Plan'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-500">Floor Plan Preview</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Last updated: {formatDate(floorPlan.updatedAt)}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => onFloorPlanClick(floorPlan.id)}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={(e) => handleDelete(floorPlan.id, e)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
