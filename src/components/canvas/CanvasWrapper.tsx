
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useCanvas } from '@/contexts/CanvasContext';
import { useDrawing } from '@/contexts/DrawingContext';
import { toast } from 'sonner';

/**
 * Canvas wrapper component that renders the canvas element
 * @returns {JSX.Element} Rendered component
 */
export const CanvasWrapper: React.FC = () => {
  const { canvasRef, setCanvas } = useCanvas();
  const { activeTool, lineColor, lineThickness } = useDrawing();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize the canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      console.log('Initializing canvas...');
      
      // Create a new Fabric.js canvas
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
      });
      
      // Set the canvas in the context
      setCanvas(fabricCanvas);
      setIsLoading(false);
      
      console.log('Canvas initialized successfully!');
      toast.success('Canvas ready');
      
      return () => {
        // Clean up on unmount
        fabricCanvas.dispose();
        setCanvas(null);
      };
    } catch (error) {
      console.error('Failed to initialize canvas:', error);
      toast.error('Failed to initialize canvas');
      setIsLoading(false);
    }
  }, [canvasRef, setCanvas]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 relative">
      <canvas 
        ref={canvasRef}
        id="fabric-canvas"
        data-testid="canvas-element"
        className="border border-gray-200 shadow-md"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>Initializing canvas...</p>
          </div>
        </div>
      )}
    </div>
  );
};
