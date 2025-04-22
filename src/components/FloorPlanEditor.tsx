
import React from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useCanvasContext } from '@/contexts/CanvasContext';
import { FloorPlanCanvas } from '@/components/canvas/FloorPlanCanvas';

interface FloorPlanEditorProps {
  onCanvasReady?: (canvas: FabricCanvas) => void;
}

export const FloorPlanEditor: React.FC<FloorPlanEditorProps> = ({ onCanvasReady }) => {
  const { setCanvas } = useCanvasContext();
  
  const handleCanvasReady = (canvas: FabricCanvas) => {
    if (setCanvas) {
      setCanvas(canvas);
    }
    
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <FloorPlanCanvas 
          onCanvasReady={handleCanvasReady}
          width={800}
          height={600}
        />
      </div>
    </div>
  );
};

export default FloorPlanEditor;
