
import { useCallback, useEffect } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';

interface UseObjectEventsProps {
  canvasRef: React.MutableRefObject<Canvas | null>;
  onObjectSelected?: (object: FabricObject | undefined) => void;
  onObjectModified?: (object: FabricObject | undefined) => void;
  onObjectAdded?: (object: FabricObject | undefined) => void;
  onObjectRemoved?: (object: FabricObject | undefined) => void;
}

/**
 * Hook to handle fabric object events (selected, modified, added, removed)
 */
export const useObjectEvents = ({
  canvasRef,
  onObjectSelected,
  onObjectModified,
  onObjectAdded,
  onObjectRemoved
}: UseObjectEventsProps) => {
  
  const handleObjectSelected = useCallback((e: any) => {
    if (onObjectSelected) {
      onObjectSelected(e.target);
    }
  }, [onObjectSelected]);
  
  const handleObjectModified = useCallback((e: any) => {
    if (onObjectModified) {
      onObjectModified(e.target);
    }
  }, [onObjectModified]);
  
  const handleObjectAdded = useCallback((e: any) => {
    if (onObjectAdded) {
      onObjectAdded(e.target);
    }
  }, [onObjectAdded]);
  
  const handleObjectRemoved = useCallback((e: any) => {
    if (onObjectRemoved) {
      onObjectRemoved(e.target);
    }
  }, [onObjectRemoved]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.on('selection:created', handleObjectSelected);
    canvas.on('selection:updated', handleObjectSelected);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    return () => {
      canvas.off('selection:created', handleObjectSelected);
      canvas.off('selection:updated', handleObjectSelected);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [canvasRef, handleObjectSelected, handleObjectModified, handleObjectAdded, handleObjectRemoved]);
  
  return {
    handleObjectSelected,
    handleObjectModified,
    handleObjectAdded,
    handleObjectRemoved
  };
};
