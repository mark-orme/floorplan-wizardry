
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon as Plus, BuildingIcon as Building } from 'lucide-react';
import { FloorPlan } from '@/types/FloorPlan';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SidebarProps {
  floorPlans: FloorPlan[];
  currentFloor: number;
  gia: number;
  onFloorSelect: (floorIndex: number) => void;
  onAddFloor: () => void;
}

/**
 * Sidebar component for floor plans management
 * @param {SidebarProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const Sidebar: React.FC<SidebarProps> = ({
  floorPlans,
  currentFloor,
  gia,
  onFloorSelect,
  onAddFloor
}: SidebarProps): JSX.Element => {
  return (
    <div className="w-64 border-r bg-gray-50 flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Building className="h-5 w-5" />
          Floor Plans
        </h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {floorPlans.map((floorPlan, index) => (
            <Button
              key={floorPlan.id}
              variant={index === currentFloor ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => onFloorSelect(index)}
            >
              {floorPlan.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
      
      <Card className="m-2 mt-auto">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-sm">Gross Internal Area</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-1">
          <p className="text-lg font-semibold">{gia.toFixed(2)} m²</p>
        </CardContent>
      </Card>
      
      <div className="p-2 border-t">
        <Button onClick={onAddFloor} className="w-full" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Floor
        </Button>
      </div>
    </div>
  );
};
