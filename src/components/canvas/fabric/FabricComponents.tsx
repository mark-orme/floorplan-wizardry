
import React from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Point } from '@/types/fabric-unified';
import type { IObjectOptions, IPathOptions } from 'fabric/fabric-impl';

// Fabric Components as React wrappers
interface FabricCanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  onReady?: (canvas: Canvas) => void;
}

export const FabricCanvas: React.FC<FabricCanvasProps> = ({
  width = 800,
  height = 600,
  backgroundColor = '#ffffff',
  onReady
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = React.useRef<Canvas | null>(null);
  
  React.useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor,
      renderOnAddRemove: false
    });
    
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

interface FabricPathProps {
  path: string | { x: number; y: number }[];
  options?: IPathOptions;
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

// Helper function to convert Point[] to SVG path string
const pathToString = (points: { x: number; y: number }[]): string => {
  if (!points.length) return '';
  let result = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    result += ` L ${points[i].x} ${points[i].y}`;
  }
  return result;
};

interface FabricGroupProps {
  objects: FabricObject[];
  options?: IObjectOptions;
}

export const FabricGroup: React.FC<FabricGroupProps> = ({ objects, options }) => {
  const { canvas } = useFabricContext();
  
  React.useEffect(() => {
    if (!canvas || !objects.length) return;
    
    // Use window.fabric to safely access fabric
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Group) {
      // Convert objects to ensure compatibility
      const group = new window.fabric.Group(objects, options || {});
      if (canvas) {
        canvas.add(group);
      }
      
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
  canvas: Canvas | null;
}

const FabricContext = React.createContext<FabricContextType>({ canvas: null });

export const FabricProvider: React.FC<{ children: React.ReactNode; canvas?: Canvas }> = ({ 
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
