
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AiOutlineEye, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { FloorPlanMetadata } from '@/types/FloorPlan';

// Helper function to format dates
const formatDate = (date: Date | string): string => {
  if (!date) return 'Unknown date';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

interface FloorPlansListProps {
  floorPlans: FloorPlanMetadata[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const FloorPlansList: React.FC<FloorPlansListProps> = ({
  floorPlans,
  onView,
  onEdit,
  onDelete
}) => {
  if (floorPlans.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Floor Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            No floor plans created yet. Create your first floor plan to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Floor Plans ({floorPlans.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {floorPlans.map((plan) => (
            <div 
              key={plan.id}
              className="flex items-center justify-between border-b pb-3"
            >
              <div>
                <h3 className="font-medium">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">Level {plan.level}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(plan.id)}
                >
                  <AiOutlineEye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(plan.id)}
                >
                  <AiOutlineEdit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(plan.id)}
                >
                  <AiOutlineDelete className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FloorPlansList;
