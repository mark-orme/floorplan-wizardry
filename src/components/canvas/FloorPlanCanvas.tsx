
import React, { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { ConnectedDrawingCanvas } from './ConnectedDrawingCanvas';
import { useIsMobile } from '@/hooks/use-mobile';

interface FloorPlanCanvasProps {
  onCanvasReady?: (canvas: any) => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({ onCanvasReady }) => {
  const isMobile = useIsMobile();
  
  // Adaptive canvas sizes based on device
  const width = isMobile ? window.innerWidth - 32 : 800;
  const height = isMobile ? window.innerHeight * 0.6 : 600;
  
  const handleCanvasRef = useCallback((canvas: FabricCanvas) => {
    if (onCanvasReady) {
      // Add necessary operations to the canvas object before passing it up
      const canvasOperations = {
        canvas,
        undo: () => {
          console.log("Undo operation");
          // Implement undo logic here if needed
        },
        redo: () => {
          console.log("Redo operation");
          // Implement redo logic here if needed
        },
        clearCanvas: () => {
          const objects = canvas.getObjects();
          objects.forEach(obj => {
            if (!(obj as any).isGrid) { // Don't remove grid objects
              canvas.remove(obj);
            }
          });
          canvas.renderAll();
        },
        saveCanvas: () => {
          console.log("Save operation");
          // Implement save logic here if needed
        },
        canUndo: true,
        canRedo: false
      };
      
      onCanvasReady(canvasOperations);
    }
  }, [onCanvasReady]);
  
  return (
    <div className="relative border border-border rounded-md bg-white shadow-sm w-full h-full">
      <ConnectedDrawingCanvas
        width={width}
        height={height}
        showGrid={true}
        onCanvasReady={handleCanvasRef}
      />
    </div>
  );
};
