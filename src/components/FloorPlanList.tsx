
import { useState } from "react";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { FloorPlan } from "@/types/floorPlanTypes";

interface FloorPlanListProps {
  floorPlans: FloorPlan[];
  currentFloor: number;
  onSelect: (index: number) => void;
  onAdd: () => void; // This prop should not take parameters
}

export const FloorPlanList = ({
  floorPlans,
  currentFloor,
  onSelect,
  onAdd,
}: FloorPlanListProps) => {
  return (
    <div className="flex flex-col space-y-0.5 p-1 bg-gray-50 dark:bg-gray-900 rounded-md"> {/* Further reduced padding and spacing */}
      <h3 className="text-xs font-medium mb-0.5">Floor Plans</h3> {/* Reduced margin more */}
      <div className="flex flex-col space-y-0"> {/* Removed spacing between buttons */}
        {floorPlans.map((plan, index) => (
          <Button
            key={index}
            variant={currentFloor === index ? "default" : "outline"}
            className="justify-start text-xs py-0 h-6 min-h-0 px-1" /* Smaller height, reduced padding */
            onClick={() => onSelect(index)}
          >
            {plan.label || plan.name}
          </Button>
        ))}
      </div>
      {/* Commented out Add Floor button since we draw all floors on one page
      <Button variant="ghost" size="sm" onClick={onAdd} className="mt-2">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Floor
      </Button>
      */}
    </div>
  );
};
