
import React, { useMemo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FloorPlan } from '@/types/floorPlan';
import { VirtualizedList } from '@/components/VirtualizedList';
import logger from '@/utils/logger';

interface FloorPlanListProps {
  floorPlans: FloorPlan[];
  onSelect?: (floorPlan: FloorPlan) => void;
  maxHeight?: number;
}

export const FloorPlanList: React.FC<FloorPlanListProps> = ({ 
  floorPlans = [], 
  onSelect,
  maxHeight = 480
}) => {
  logger.debug('Rendering floor plan list', { count: floorPlans.length });

  if (floorPlans.length === 0) {
    return (
      <Card>
        <CardContent className="py-4">
          <div className="text-center text-muted-foreground">
            No floor plans available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const renderFloorPlan = (floorPlan: FloorPlan, _index: number, style: React.CSSProperties) => (
    <div style={style} className="px-2 py-1">
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => onSelect?.(floorPlan)}
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

  return (
    <div className="border rounded-lg overflow-hidden" style={{ height: maxHeight }}>
      <VirtualizedList
        items={floorPlans}
        renderItem={renderFloorPlan}
        itemHeight={120}
        maxHeight={maxHeight}
      />
    </div>
  );
};
