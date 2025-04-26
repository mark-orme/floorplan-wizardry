
import React from 'react';
import { CanvasProps } from '@/types/canvas/CanvasProps';
import { Canvas as FabricCanvas } from 'fabric';

export { CanvasProps };

export const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  backgroundColor = '#ffffff',
  onCanvasReady,
  onError,
  showGridDebug
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = React.useState<FabricCanvas | null>(null);
  
  React.useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      // Create a new Canvas instance
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor
      });
      
      setCanvas(fabricCanvas);
      
      if (onCanvasReady) {
        onCanvasReady(fabricCanvas);
      }
      
      return () => {
        fabricCanvas.dispose();
      };
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [width, height, backgroundColor, onCanvasReady, onError]);
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} width={width} height={height} />
      {showGridDebug && (
        <div className="absolute top-0 right-0 bg-white p-1 text-xs">
          Grid Debug Enabled
        </div>
      )}
    </div>
  );
};

export default Canvas;
