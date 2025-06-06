
import React, { useRef, useEffect, useState } from 'react';
import * as fabric from 'fabric';
import type { ExtendedFabricCanvas } from '@/types/canvas-types';
import { toast } from 'sonner';

export interface CanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: fabric.Canvas | ExtendedFabricCanvas) => void;
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
  const [canvas, setCanvas] = useState<fabric.Canvas | ExtendedFabricCanvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
      });
      
      // Cast to ExtendedFabricCanvas if needed
      setCanvas(fabricCanvas);
      onCanvasReady?.(fabricCanvas);
      setIsLoading(false);
      
      return () => {
        fabricCanvas.dispose();
      };
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Canvas initialization failed'));
      setIsLoading(false);
    }
  }, [width, height, onCanvasReady, onError]);

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
  canvas: fabric.Canvas | ExtendedFabricCanvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | ExtendedFabricCanvas | null>>;
}>({
  canvasRef: { current: null },
  canvas: null,
  setCanvas: () => {},
});

export const useCanvas = () => React.useContext(CanvasContext);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | ExtendedFabricCanvas | null>(null);
  
  return (
    <CanvasContext.Provider value={{ canvasRef, canvas, setCanvas }}>
      {children}
    </CanvasContext.Provider>
  );
};
