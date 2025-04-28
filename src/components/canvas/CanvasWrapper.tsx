
import React, { useEffect, useState } from 'react';
import { useCanvas } from '@/components/Canvas';
import { Canvas as FabricCanvas } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/ExtendedFabricCanvas';
import { asExtendedCanvas } from '@/utils/canvas/canvasTypeUtils';
import { toast } from 'sonner';

/**
 * Canvas wrapper component that renders the canvas element
 * @returns {JSX.Element} Rendered component
 */
export const CanvasWrapper: React.FC = () => {
  const { canvasRef, setCanvas } = useCanvas();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize the canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      // Use Canvas constructor from fabric
      const fabricCanvas = new window.fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
      });
      
      // Cast to Extended Canvas type
      const extendedCanvas = asExtendedCanvas(fabricCanvas);
      
      // Ensure required properties exist
      if (extendedCanvas && !extendedCanvas.getElement) {
        extendedCanvas.getElement = () => canvasRef.current as HTMLCanvasElement;
      }
      
      setCanvas(extendedCanvas);
      setIsLoading(false);
      
      console.log('Canvas initialized successfully!');
      toast.success('Canvas ready');
      
      return () => {
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
