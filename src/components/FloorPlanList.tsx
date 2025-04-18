
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
  if (floorPlans.length === 0) {
    return (
      <Card>
        <CardContent className="py-4">
          No floor plans available
        </CardContent>
      </Card>
    );
  }
  
  const ITEM_HEIGHT = 120; // Height for each floor plan card
  const LIST_HEIGHT = Math.min(floorPlans.length * ITEM_HEIGHT, 480); // Max height of 480px
  
  const renderFloorPlan = React.useCallback(({ index, style }) => {
    const floorPlan = floorPlans[index];
    
    return (
      <div style={style} className="px-2 py-1">
        <Card 
          key={floorPlan.id} 
          className="cursor-pointer hover:bg-muted/50 transition-colors h-[110px]"
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
      </div>
    );
  }, [floorPlans, onSelect]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <FixedSizeList
        height={LIST_HEIGHT}
        itemCount={floorPlans.length}
        itemSize={ITEM_HEIGHT}
        width="100%"
        className="scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
      >
        {renderFloorPlan}
      </FixedSizeList>
    </div>
  );
};
