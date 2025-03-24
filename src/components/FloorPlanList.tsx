
import { useState } from "react";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { FloorPlan } from "@/utils/drawing";

interface FloorPlanListProps {
  floorPlans: FloorPlan[];
  currentFloor: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
}

export const FloorPlanList = ({
  floorPlans,
  currentFloor,
  onSelect,
  onAdd,
}: FloorPlanListProps) => {
  return (
    <div className="flex flex-col space-y-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
      <h3 className="text-sm font-medium mb-2">Floor Plans</h3>
      <div className="flex flex-col space-y-1">
        {floorPlans.map((plan, index) => (
          <Button
            key={index}
            variant={currentFloor === index ? "default" : "outline"}
            className="justify-start"
            onClick={() => onSelect(index)}
          >
            {plan.label}
          </Button>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={onAdd} className="mt-2">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Floor
      </Button>
    </div>
  );
};
