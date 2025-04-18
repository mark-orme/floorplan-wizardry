
import React from 'react';
import { FixedSizeList } from 'react-window';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FloorPlan } from '@/types/floorPlanTypes';

interface FloorPlanListProps {
  floorPlans: FloorPlan[];
  onSelect?: (floorPlan: FloorPlan) => void;
}

export const FloorPlanList: React.FC<FloorPlanListProps> = ({ 
  floorPlans = [], 
  onSelect 
}) => {
  return (
    <div className="grid gap-4">
      {floorPlans.length === 0 ? (
        <Card>
          <CardContent className="py-4">
            No floor plans available
          </CardContent>
        </Card>
      ) : (
        floorPlans.map((floorPlan) => (
          <Card 
            key={floorPlan.id} 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => onSelect && onSelect(floorPlan)}
          >
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">{floorPlan.name || 'Unnamed Floor Plan'}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-sm text-muted-foreground">
                Floor {floorPlan.level !== undefined ? floorPlan.level + 1 : 1}
              </div>
              {floorPlan.updatedAt && (
                <div className="text-xs text-muted-foreground mt-1">
                  Last updated: {new Date(floorPlan.updatedAt).toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
