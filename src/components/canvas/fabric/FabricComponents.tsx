
import React from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { ExtendedCanvas, Point } from '@/types/fabric-unified';

// Fabric Components as React wrappers
interface FabricCanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  onReady?: (canvas: ExtendedCanvas) => void;
}

export const FabricCanvas: React.FC<FabricCanvasProps> = ({
  width = 800,
  height = 600,
  backgroundColor = '#ffffff',
  onReady
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = React.useRef<ExtendedCanvas | null>(null);
  
  React.useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor,
      renderOnAddRemove: false
    }) as unknown as ExtendedCanvas;
    
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
const pathToString = (points: Point[]): string => {
  if (!points || !points.length) return '';
  
  // Safely access points array
  let result = `M ${points[0]?.x ?? 0} ${points[0]?.y ?? 0}`;
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    if (point) {
      result += ` L ${point.x ?? 0} ${point.y ?? 0}`;
    }
  }
  return result;
};

interface FabricPathProps {
  path: string | Point[];
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
      
      canvas.add(pathObj as any);
      
      return () => {
        canvas.remove(pathObj as any);
      };
    }
  }, [canvas, path, options]);
  
  return null;
};

interface FabricGroupProps {
  objects: any[]; // Changed from FabricObject[] to any[] to fix type error
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
      
      canvas.add(group as any);
      
      return () => {
        if (canvas) {
          canvas.remove(group as any);
        }
      };
    }
  }, [canvas, objects, options]);
  
  return null;
};

// Context for sharing canvas instance
interface FabricContextType {
  canvas: ExtendedCanvas | null;
}

const FabricContext = React.createContext<FabricContextType>({ canvas: null });

export const FabricProvider: React.FC<{ children: React.ReactNode; canvas?: ExtendedCanvas | null }> = ({ 
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
