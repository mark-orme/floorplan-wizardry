
import { useCallback, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface UseCanvasZoomOptions {
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

/**
 * Hook for canvas zoom functionality
 */
export const useCanvasZoom = (
  canvasRef: React.MutableRefObject<FabricCanvas | null>,
  options: UseCanvasZoomOptions = {}
) => {
  const { 
    minZoom = 0.1, 
    maxZoom = 5, 
    zoomStep = 0.1 
  } = options;
  
  const [zoom, setZoom] = useState(1);
  
  const zoomIn = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    const newZoom = Math.min(zoom + zoomStep, maxZoom);
    canvas.setZoom(newZoom);
    setZoom(newZoom);
  }, [canvasRef, zoom, zoomStep, maxZoom]);
  
  const zoomOut = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    const newZoom = Math.max(zoom - zoomStep, minZoom);
    canvas.setZoom(newZoom);
    setZoom(newZoom);
  }, [canvasRef, zoom, zoomStep, minZoom]);
  
  const setCustomZoom = useCallback((newZoom: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    const clampedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);
    canvas.setZoom(clampedZoom);
    setZoom(clampedZoom);
  }, [canvasRef, minZoom, maxZoom]);
  
  return {
    zoom,
    zoomIn,
    zoomOut,
    setZoom: setCustomZoom
  };
};

export default useCanvasZoom;
