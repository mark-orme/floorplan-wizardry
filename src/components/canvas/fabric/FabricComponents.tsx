
import React from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Point } from '@/types/fabric-unified';

// Define proper interfaces for Fabric objects
export interface IObjectOptions {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  selectable?: boolean;
  evented?: boolean;
  objectCaching?: boolean;
  objectType?: string;
}

export interface IPathOptions extends IObjectOptions {
  path?: string | Point[];
}

export interface ILineOptions extends IObjectOptions {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

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
  path: string | Point[];
  options?: IPathOptions;
}

export const FabricPath: React.FC<FabricPathProps> = ({ path, options }) => {
  const { canvas } = useFabricContext();
  
  React.useEffect(() => {
    if (!canvas) return;
    
    // Use window.fabric to safely access fabric
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Path) {
      const pathObj = new window.fabric.Path(path, options || {});
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
  options?: IObjectOptions;
}

export const FabricGroup: React.FC<FabricGroupProps> = ({ objects, options }) => {
  const { canvas } = useFabricContext();
  
  React.useEffect(() => {
    if (!canvas || !objects.length) return;
    
    // Use window.fabric to safely access fabric
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Group) {
      // Convert objects if needed to ensure compatibility
      const compatibleObjects = objects.map(obj => ({
        ...obj,
        toObject: obj.toObject || (() => ({}))
      }));
      
      const group = new window.fabric.Group(compatibleObjects as any[], options || {});
      canvas.add(group);
      
      return () => {
        canvas.remove(group);
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
