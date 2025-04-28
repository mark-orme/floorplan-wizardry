
import { FloorPlanMetadata } from '@/types/canvas-types';
import React from 'react';

interface FloorPlansListProps {
  floorPlans: {
    id: string;
    metadata: FloorPlanMetadata;
  }[];
  onSelect: (id: string) => void;
}

export const FloorPlansList: React.FC<FloorPlansListProps> = ({ floorPlans, onSelect }) => {
  return (
    <div className="grid gap-4">
      {floorPlans.map(plan => (
        <button
          key={plan.id}
          onClick={() => onSelect(plan.id)}
          className="p-4 border rounded-lg hover:bg-gray-50"
        >
          <h3 className="font-medium">Floor Plan {plan.metadata.name}</h3>
          <p className="text-sm text-gray-600">{plan.metadata.description || 'No description'}</p>
          <p className="text-xs text-gray-400">
            Updated: {new Date(plan.metadata.updated).toLocaleDateString()}
          </p>
        </button>
      ))}
    </div>
  );
};
