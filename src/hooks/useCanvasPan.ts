
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface UseCanvasPanOptions {
  enabled?: boolean;
  panKey?: 'space' | 'alt' | 'shift' | 'none';
  cursorStyle?: string;
}

/**
 * Hook for canvas panning functionality
 */
export const useCanvasPan = (
  canvasRef: React.MutableRefObject<FabricCanvas | null>,
  options: UseCanvasPanOptions = {}
) => {
  const {
    enabled = false,
    panKey = 'space',
    cursorStyle = 'grab'
  } = options;
  
  const [isPanning, setIsPanning] = useState(false);
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  
  // Track if the specified key is pressed
  useEffect(() => {
    if (!canvasRef.current || panKey === 'none') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (panKey === 'space' && e.code === 'Space') ||
        (panKey === 'alt' && e.altKey) ||
        (panKey === 'shift' && e.shiftKey)
      ) {
        setIsKeyPressed(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        (panKey === 'space' && e.code === 'Space') ||
        (panKey === 'alt' && e.altKey === false) ||
        (panKey === 'shift' && e.shiftKey === false)
      ) {
        setIsKeyPressed(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [canvasRef, panKey]);
  
  // Enable panning functionality
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;
    
    let lastX = 0;
    let lastY = 0;
    const originalCursor = canvas.defaultCursor;
    
    const startPan = (e: MouseEvent) => {
      if (panKey !== 'none' && !isKeyPressed) return;
      
      setIsPanning(true);
      canvas.selection = false;
      canvas.defaultCursor = cursorStyle;
      
      lastX = e.clientX;
      lastY = e.clientY;
    };
    
    const pan = (e: MouseEvent) => {
      if (!isPanning) return;
      
      const vpt = canvas.viewportTransform;
      if (!vpt) return;
      
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      
      vpt[4] += dx;
      vpt[5] += dy;
      
      canvas.requestRenderAll();
      
      lastX = e.clientX;
      lastY = e.clientY;
    };
    
    const endPan = () => {
      if (!isPanning) return;
      
      setIsPanning(false);
      canvas.selection = true;
      canvas.defaultCursor = originalCursor;
    };
    
    canvas.on('mouse:down', (e: any) => {
      const evt = e.e as MouseEvent;
      startPan(evt);
    });
    
    canvas.on('mouse:move', (e: any) => {
      const evt = e.e as MouseEvent;
      pan(evt);
    });
    
    canvas.on('mouse:up', () => {
      endPan();
    });
    
    return () => {
      canvas.off('mouse:down');
      canvas.off('mouse:move');
      canvas.off('mouse:up');
    };
  }, [canvasRef, enabled, isPanning, isKeyPressed, panKey, cursorStyle]);
  
  const enablePan = useCallback(() => {
    setIsPanning(true);
  }, []);
  
  const disablePan = useCallback(() => {
    setIsPanning(false);
  }, []);
  
  return {
    isPanning,
    enablePan,
    disablePan
  };
};

export default useCanvasPan;
