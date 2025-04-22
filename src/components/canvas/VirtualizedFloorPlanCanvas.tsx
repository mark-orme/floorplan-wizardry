
import React, { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import useResizeObserver from '@/hooks/useResizeObserver';
import { FloorPlan } from '@/types/core/FloorPlan';

interface VirtualizedFloorPlanCanvasProps {
  floorPlan: FloorPlan;
  onFloorPlanUpdate: (floorPlan: FloorPlan) => void;
  handleCanvasError: (err: Error) => void;
  resetCanvasError: () => void;
  hasError: boolean;
  errorMessage: string;
}

const VirtualizedFloorPlanCanvas: React.FC<VirtualizedFloorPlanCanvasProps> = ({
  floorPlan,
  onFloorPlanUpdate,
  handleCanvasError,
  resetCanvasError,
  hasError,
  errorMessage
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const dimensions = useResizeObserver(containerRef);
  
  // Initialize the canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      // Clear any previous errors
      resetCanvasError();
      
      // Create a new canvas
      const canvas = new FabricCanvas(canvasRef.current, {
        width: dimensions?.width || 800,
        height: dimensions?.height || 600,
        selection: true,
        renderOnAddRemove: true
      });
      
      fabricCanvasRef.current = canvas;
      
      // Load the floor plan data if available
      if (floorPlan.canvasJson) {
        canvas.loadFromJSON(floorPlan.canvasJson, canvas.renderAll.bind(canvas));
      }
      
      // Clean up on unmount
      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    } catch (error) {
      // Use the renamed callback for error handling
      handleCanvasError(error instanceof Error ? error : new Error('Canvas initialization failed'));
    }
  }, [dimensions, floorPlan.canvasJson, handleCanvasError, resetCanvasError]);
  
  // Handle resize
  useEffect(() => {
    if (!fabricCanvasRef.current || !dimensions) return;
    
    try {
      fabricCanvasRef.current.setDimensions({
        width: dimensions.width,
        height: dimensions.height
      });
      fabricCanvasRef.current.renderAll();
    } catch (error) {
      handleCanvasError(error instanceof Error ? error : new Error('Canvas resize failed'));
    }
  }, [dimensions, handleCanvasError]);
  
  // Save changes to floor plan
  const saveChanges = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    try {
      const updatedFloorPlan = {
        ...floorPlan,
        canvasJson: JSON.stringify(fabricCanvasRef.current.toJSON())
      };
      
      onFloorPlanUpdate(updatedFloorPlan);
    } catch (error) {
      handleCanvasError(error instanceof Error ? error : new Error('Failed to save canvas changes'));
    }
  }, [floorPlan, onFloorPlanUpdate, handleCanvasError]);
  
  // Auto-save changes when objects are modified
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const handleObjectModified = () => {
      saveChanges();
    };
    
    canvas.on('object:modified', handleObjectModified);
    
    return () => {
      canvas.off('object:modified', handleObjectModified);
    };
  }, [saveChanges]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative"
      style={{ minHeight: '300px' }}
    >
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500">
          <p>{errorMessage || 'An error occurred with the canvas'}</p>
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          className="w-full h-full border border-gray-200"
        />
      )}
    </div>
  );
};

export default VirtualizedFloorPlanCanvas;
