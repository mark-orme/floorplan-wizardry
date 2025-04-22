
import React from 'react';

interface FloorPlanCanvasProps {
  onCanvasError?: (error: Error) => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({ onCanvasError }) => {
  return (
    <div className="w-full h-[500px] border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center">
      <p className="text-muted-foreground">Canvas will render here</p>
    </div>
  );
};
