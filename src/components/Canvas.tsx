
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

export interface CanvasProps {
  width: number;
  height: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  showGridDebug?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onError,
  showGridDebug = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      // Create Fabric canvas instance
      const fabricCanvas = new window.fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
      });
      
      setCanvas(fabricCanvas);
      setIsLoading(false);
      
      // Notify parent component that canvas is ready
      if (onCanvasReady) {
        onCanvasReady(fabricCanvas);
      }
      
      return () => {
        fabricCanvas.dispose();
        setCanvas(null);
      };
    } catch (error) {
      console.error('Failed to initialize canvas:', error);
      setIsLoading(false);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [canvasRef, width, height, onCanvasReady, onError]);

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef}
        className="border border-gray-200 shadow-md"
        data-testid="canvas-element"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
};

// Create a context for canvas
export const CanvasContext = React.createContext<{
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvas: FabricCanvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<FabricCanvas | null>>;
}>({
  canvasRef: { current: null },
  canvas: null,
  setCanvas: () => {},
});

export const useCanvas = () => React.useContext(CanvasContext);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  
  return (
    <CanvasContext.Provider value={{ canvasRef, canvas, setCanvas }}>
      {children}
    </CanvasContext.Provider>
  );
};
