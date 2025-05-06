
import React from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/fabric-core';

// Fabric Components as React wrappers
interface FabricCanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  onReady?: (canvas: ExtendedFabricCanvas) => void;
}

export const FabricCanvas: React.FC<FabricCanvasProps> = ({
  width = 800,
  height = 600,
  backgroundColor = '#ffffff',
  onReady
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = React.useRef<ExtendedFabricCanvas | null>(null);
  
  React.useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor,
      renderOnAddRemove: false
    }) as unknown as ExtendedFabricCanvas;
    
    fabricCanvasRef.current = canvas;
    
    if (onReady) {
      onReady(canvas);
    }
    
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [width, height, backgroundColor, onReady]);
  
  return <canvas ref={canvasRef} />;
};

// Helper function to convert Point[] to SVG path string
const pathToString = (points: { x: number; y: number }[]): string => {
  if (!points.length) return '';
  
  let result = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    result += ` L ${points[i].x} ${points[i].y}`;
  }
  return result;
};

interface FabricPathProps {
  path: string | { x: number; y: number }[];
  options?: any; // Using any for now, but should be properly typed
}

export const FabricPath: React.FC<FabricPathProps> = ({ path, options }) => {
  const { canvas } = useFabricContext();
  
  React.useEffect(() => {
    if (!canvas) return;
    
    // Use window.fabric to safely access fabric
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Path) {
      const fabricPath = typeof path === 'string' ? path : pathToString(path);
      const pathObj = new window.fabric.Path(fabricPath, options || {});
      
      canvas.add(pathObj);
      
      return () => {
        canvas.remove(pathObj);
      };
    }
  }, [canvas, path, options]);
  
  return null;
};

interface FabricGroupProps {
  objects: FabricObject[];
  options?: any; // Using any for now, but should be properly typed
}

export const FabricGroup: React.FC<FabricGroupProps> = ({ objects, options }) => {
  const { canvas } = useFabricContext();
  
  React.useEffect(() => {
    if (!canvas || !objects.length) return;
    
    // Use window.fabric to safely access fabric
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Group) {
      // Create a safe copy of objects to work with
      const safeObjects = [...objects];
      const group = new window.fabric.Group(safeObjects, options || {});
      
      canvas.add(group);
      
      return () => {
        if (canvas) {
          canvas.remove(group);
        }
      };
    }
  }, [canvas, objects, options]);
  
  return null;
};

// Context for sharing canvas instance
interface FabricContextType {
  canvas: ExtendedFabricCanvas | null;
}

const FabricContext = React.createContext<FabricContextType>({ canvas: null });

export const FabricProvider: React.FC<{ children: React.ReactNode; canvas?: ExtendedFabricCanvas | null }> = ({ 
  children, 
  canvas 
}) => {
  return (
    <FabricContext.Provider value={{ canvas: canvas || null }}>
      {children}
    </FabricContext.Provider>
  );
};

export const useFabricContext = (): FabricContextType => {
  return React.useContext(FabricContext);
};
