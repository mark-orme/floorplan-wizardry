
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useCanvasController } from '@/components/canvas/controller/CanvasController';
import { useWindowSize } from '@/hooks/useWindowSize';
import { setSafeDimensions } from '@/utils/canvas/safeDimensions';

export function useDimensionsManager(containerRef: React.RefObject<HTMLDivElement>) {
  const { canvas } = useCanvasController();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const dimensionsSetRef = useRef(false);
  
  // Update canvas dimensions when container size changes
  const updateDimensions = () => {
    if (!canvas || !containerRef.current) return;
    
    try {
      // Get container dimensions
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Only update if dimensions actually changed
      if (canvas.width !== width || canvas.height !== height) {
        // Use our safe dimensions setter to avoid destructuring issues
        setSafeDimensions(canvas, width, height);
        dimensionsSetRef.current = true;
        console.log('Canvas dimensions updated:', width, height);
      }
    } catch (error) {
      console.error('Error updating canvas dimensions:', error);
    }
  };
  
  // Set up resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Update dimensions initially
    updateDimensions();
    
    // Set up resize observer for continuous updates
    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    
    observer.observe(containerRef.current);
    
    // Clean up observer on unmount
    return () => observer.disconnect();
  }, [canvas, containerRef.current]);
  
  // Also update when window size changes
  useEffect(() => {
    updateDimensions();
  }, [windowWidth, windowHeight, canvas]);
  
  return {
    updateDimensions,
    dimensionsSet: dimensionsSetRef.current
  };
}
