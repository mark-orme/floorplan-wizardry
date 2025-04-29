
import { useCallback, useRef, useEffect } from 'react';
import { ExtendedFabricCanvas } from '@/types/fabric-unified';

interface UseCanvasPanProps {
  fabricCanvasRef: React.MutableRefObject<ExtendedFabricCanvas | null>;
  enabled?: boolean;
  panKey?: 'space' | 'alt';
}

export const useCanvasPan = ({
  fabricCanvasRef,
  enabled = true,
  panKey = 'space'
}: UseCanvasPanProps = {}) => {
  const isPanning = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const isPanKeyPressed = useRef(false);
  
  // Handle pan start
  const handlePanStart = useCallback((e: any) => {
    if (!enabled || !isPanKeyPressed.current) return;
    
    isPanning.current = true;
    lastPosRef.current = { 
      x: e.e.clientX || (e.e.touches?.[0]?.clientX ?? 0),
      y: e.e.clientY || (e.e.touches?.[0]?.clientY ?? 0)
    };
    
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.selection = false;
      canvas.defaultCursor = 'grabbing';
      if (canvas.forEachObject) {
        canvas.forEachObject((obj) => {
          obj.selectable = false;
          if ('evented' in obj) obj.evented = false;
        });
      }
    }
  }, [enabled, fabricCanvasRef]);
  
  // Handle pan move
  const handlePanMove = useCallback((e: any) => {
    if (!enabled || !isPanning.current || !lastPosRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvas.viewportTransform) return;
    
    const currentX = e.e.clientX || (e.e.touches?.[0]?.clientX ?? 0);
    const currentY = e.e.clientY || (e.e.touches?.[0]?.clientY ?? 0);
    
    const deltaX = currentX - lastPosRef.current.x;
    const deltaY = currentY - lastPosRef.current.y;
    
    // Update viewport transform
    canvas.viewportTransform[4] += deltaX;
    canvas.viewportTransform[5] += deltaY;
    canvas.requestRenderAll?.() || canvas.renderAll();
    
    lastPosRef.current = { x: currentX, y: currentY };
  }, [enabled, fabricCanvasRef]);
  
  // Handle pan end
  const handlePanEnd = useCallback(() => {
    if (!enabled) return;
    
    isPanning.current = false;
    lastPosRef.current = null;
    
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.defaultCursor = 'default';
      if (canvas.forEachObject) {
        canvas.forEachObject((obj) => {
          obj.selectable = true;
          if ('evented' in obj) obj.evented = true;
        });
      }
      canvas.selection = true;
    }
  }, [enabled, fabricCanvasRef]);
  
  // Handle key down
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;
    
    if ((panKey === 'space' && e.code === 'Space') || 
        (panKey === 'alt' && e.altKey)) {
      isPanKeyPressed.current = true;
      
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        canvas.defaultCursor = 'grab';
      }
    }
  }, [enabled, panKey, fabricCanvasRef]);
  
  // Handle key up
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;
    
    if ((panKey === 'space' && e.code === 'Space') || 
        (panKey === 'alt' && e.altKey)) {
      isPanKeyPressed.current = false;
      
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        canvas.defaultCursor = 'default';
      }
      
      if (isPanning.current) {
        handlePanEnd();
      }
    }
  }, [enabled, panKey, fabricCanvasRef, handlePanEnd]);
  
  // Set up event listeners
  useEffect(() => {
    if (!enabled) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Add canvas event listeners
    canvas.on('mouse:down', handlePanStart as any);
    canvas.on('mouse:move', handlePanMove as any);
    canvas.on('mouse:up', handlePanEnd as any);
    
    // Add keyboard event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      if (canvas) {
        canvas.off('mouse:down', handlePanStart as any);
        canvas.off('mouse:move', handlePanMove as any);
        canvas.off('mouse:up', handlePanEnd as any);
      }
      
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, fabricCanvasRef, handlePanStart, handlePanMove, handlePanEnd, handleKeyDown, handleKeyUp]);
  
  return {
    isPanning: isPanning.current,
    resetPan: useCallback(() => {
      const canvas = fabricCanvasRef.current;
      if (!canvas || !canvas.viewportTransform) return;
      
      canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
      canvas.requestRenderAll?.() || canvas.renderAll();
    }, [fabricCanvasRef])
  };
};
