
import { useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

interface UsePathEventsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  isEnabled?: boolean;
  onPathCreated?: (path: FabricObject) => void;
  saveCurrentState?: () => void;
}

export const usePathEvents = ({
  fabricCanvasRef,
  isEnabled = true,
  onPathCreated,
  saveCurrentState
}: UsePathEventsProps) => {
  
  const handlePathCreated = useCallback((event: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isEnabled) return;
    
    const path = event.path as FabricObject;
    if (!path) return;
    
    // Save current state if function is provided
    if (saveCurrentState && typeof saveCurrentState === 'function') {
      saveCurrentState();
    }
    
    // Call path created callback if provided
    if (onPathCreated && typeof onPathCreated === 'function') {
      onPathCreated(path);
    }
  }, [fabricCanvasRef, isEnabled, onPathCreated, saveCurrentState]);
  
  const handlePathDeleted = useCallback((event: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isEnabled) return;
    
    // Save current state if function is provided
    if (saveCurrentState && typeof saveCurrentState === 'function') {
      saveCurrentState();
    }
  }, [fabricCanvasRef, isEnabled, saveCurrentState]);
  
  // Set up event listeners
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isEnabled) return;
    
    canvas.on('path:created', handlePathCreated);
    canvas.on('object:removed', handlePathDeleted);
    
    return () => {
      canvas.off('path:created', handlePathCreated);
      canvas.off('object:removed', handlePathDeleted);
    };
  }, [fabricCanvasRef, isEnabled, handlePathCreated, handlePathDeleted]);
  
  return {
    handlePathCreated,
    handlePathDeleted
  };
};
