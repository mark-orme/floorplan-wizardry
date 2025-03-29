
/**
 * Canvas References Hook
 * Provides shared references to canvas objects across components
 * @module hooks/useCanvasRefs
 */
import { useRef, createContext, useContext } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

// Create context for canvas references
const CanvasRefsContext = createContext<{
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
}>({
  fabricCanvasRef: { current: null },
  gridLayerRef: { current: [] }
});

/**
 * Provider component for canvas references
 */
export const CanvasRefsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  return (
    <CanvasRefsContext.Provider value={{ fabricCanvasRef, gridLayerRef }}>
      {children}
    </CanvasRefsContext.Provider>
  );
};

/**
 * Hook to use canvas references from anywhere in the component tree
 * @returns Canvas reference objects
 */
export const useCanvasRefs = () => {
  return useContext(CanvasRefsContext);
};

/**
 * Create canvas references for standalone use
 * @returns Canvas reference objects
 */
export const createCanvasRefs = () => {
  const fabricCanvasRef = { current: null as FabricCanvas | null };
  const gridLayerRef = { current: [] as FabricObject[] };
  
  return { fabricCanvasRef, gridLayerRef };
};
