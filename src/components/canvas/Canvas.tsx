import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { ExtendedCanvas } from '@/types/canvas/ExtendedCanvas';
import { toast } from 'sonner';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<ExtendedCanvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
      }) as ExtendedCanvas;
      
      setCanvas(fabricCanvas);
      setIsLoading(false);
      
      return () => {
        fabricCanvas.dispose();
      };
    } catch (error) {
      console.error('Failed to initialize canvas:', error);
      setIsLoading(false);
    }
  }, []);

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

export const CanvasContext = React.createContext<{
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvas: ExtendedCanvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<ExtendedCanvas | null>>;
}>({
  canvasRef: { current: null },
  canvas: null,
  setCanvas: () => {},
});

export const useCanvas = () => React.useContext(CanvasContext);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<ExtendedCanvas | null>(null);
  
  return (
    <CanvasContext.Provider value={{ canvasRef, canvas, setCanvas }}>
      {children}
    </CanvasContext.Provider>
  );
};
