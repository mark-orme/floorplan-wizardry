
import React, { useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FloorPlan } from '@/types/floorPlanTypes';

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
  
  const ITEM_HEIGHT = 120; // Height for each floor plan card
  const LIST_HEIGHT = Math.min(floorPlans.length * ITEM_HEIGHT, maxHeight);
  
  const renderFloorPlan = useMemo(() => {
    return function FloorPlanItem({ index, style }: { index: number; style: React.CSSProperties }) {
      const floorPlan = floorPlans[index];
      
      return (
        <div style={style} className="px-2 py-1" role="option" aria-selected={false}>
          <Card 
            key={floorPlan.id} 
            className="cursor-pointer hover:bg-muted/50 transition-colors h-[110px]"
            onClick={() => onSelect && onSelect(floorPlan)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelect && onSelect(floorPlan);
                e.preventDefault();
              }
            }}
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
    };
  }, [floorPlans, onSelect]);

  return (
    <div className="border rounded-lg overflow-hidden" style={{ height: LIST_HEIGHT }}>
      <AutoSizer disableHeight>
        {({ width }) => (
          <FixedSizeList
            height={LIST_HEIGHT}
            itemCount={floorPlans.length}
            itemSize={ITEM_HEIGHT}
            width={width}
            className="scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
            overscanCount={2}
            role="listbox"
            aria-label="Floor plans"
          >
            {renderFloorPlan}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
};
